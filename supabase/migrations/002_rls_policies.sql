-- Row Level Security Policies for Stealth Score
-- Ensures data privacy and security

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Pitch analyses policies
CREATE POLICY "Users can view own analyses" ON public.pitch_analyses
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own analyses" ON public.pitch_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" ON public.pitch_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" ON public.pitch_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can view own events" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can view own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback" ON public.feedback
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feedback" ON public.feedback
  FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- API usage policies
CREATE POLICY "Users can view own API usage" ON public.api_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API usage" ON public.api_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (for service role)
CREATE POLICY "Service role can manage all data" ON public.users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all analyses" ON public.pitch_analyses
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all sessions" ON public.user_sessions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all events" ON public.analytics_events
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all feedback" ON public.feedback
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all API usage" ON public.api_usage
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create functions for common operations
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if user can access this data
  IF auth.uid() != user_uuid AND auth.jwt() ->> 'role' != 'service_role' THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_build_object(
    'total_analyses', COUNT(pa.id),
    'avg_clarity_score', ROUND(AVG(pa.clarity_score), 2),
    'avg_originality_score', ROUND(AVG(pa.originality_score), 2),
    'avg_team_strength_score', ROUND(AVG(pa.team_strength_score), 2),
    'avg_market_fit_score', ROUND(AVG(pa.market_fit_score), 2),
    'avg_overall_score', ROUND(AVG(pa.overall_score), 2),
    'last_analysis', MAX(pa.created_at),
    'credits_remaining', u.credits_remaining,
    'subscription_tier', u.subscription_tier
  ) INTO result
  FROM public.users u
  LEFT JOIN public.pitch_analyses pa ON u.id = pa.user_id
  WHERE u.id = user_uuid
  GROUP BY u.id, u.credits_remaining, u.subscription_tier;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create or update user profile
CREATE OR REPLACE FUNCTION public.upsert_user_profile(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT DEFAULT NULL,
  user_avatar_url TEXT DEFAULT NULL
)
RETURNS public.users AS $$
DECLARE
  result public.users;
BEGIN
  -- Check if user can modify this profile
  IF auth.uid() != user_id AND auth.jwt() ->> 'role' != 'service_role' THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (user_id, user_email, user_full_name, user_avatar_url)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW(),
    last_login = NOW()
  RETURNING * INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track analytics events
CREATE OR REPLACE FUNCTION public.track_event(
  event_type_param TEXT,
  event_name_param TEXT,
  properties_param JSONB DEFAULT '{}',
  session_id_param UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  INSERT INTO public.analytics_events (
    user_id,
    session_id,
    event_type,
    event_name,
    properties
  ) VALUES (
    current_user_id,
    session_id_param,
    event_type_param,
    event_name_param,
    properties_param
  ) RETURNING id INTO event_id;

  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to save pitch analysis
CREATE OR REPLACE FUNCTION public.save_pitch_analysis(
  analysis_data JSONB
)
RETURNS UUID AS $$
DECLARE
  analysis_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  INSERT INTO public.pitch_analyses (
    user_id,
    title,
    content_hash,
    analysis_type,
    clarity_score,
    originality_score,
    team_strength_score,
    market_fit_score,
    overall_score,
    receipt_id,
    feedback,
    suggestions,
    ai_model_used,
    confidence_score
  ) VALUES (
    current_user_id,
    analysis_data->>'title',
    analysis_data->>'content_hash',
    COALESCE(analysis_data->>'analysis_type', 'text'),
    (analysis_data->>'clarity_score')::DECIMAL,
    (analysis_data->>'originality_score')::DECIMAL,
    (analysis_data->>'team_strength_score')::DECIMAL,
    (analysis_data->>'market_fit_score')::DECIMAL,
    (analysis_data->>'overall_score')::DECIMAL,
    analysis_data->>'receipt_id',
    COALESCE(analysis_data->'feedback', '{}'),
    COALESCE(analysis_data->'suggestions', '[]'),
    COALESCE(analysis_data->>'ai_model_used', 'deepseek-r1'),
    COALESCE((analysis_data->>'confidence_score')::DECIMAL, 0.95)
  ) RETURNING id INTO analysis_id;

  -- Update user's total analyses count
  UPDATE public.users 
  SET total_analyses = total_analyses + 1,
      credits_remaining = GREATEST(credits_remaining - 1, 0)
  WHERE id = current_user_id;

  RETURN analysis_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
