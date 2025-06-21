-- Stealth Score Complete Database Schema for Supabase
-- Copy and paste this entire script into Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
  credits_remaining INTEGER DEFAULT 10,
  total_analyses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);

-- Pitch analyses table
CREATE TABLE public.pitch_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content_hash TEXT NOT NULL,
  analysis_type TEXT DEFAULT 'text' CHECK (analysis_type IN ('text', 'audio', 'document')),
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  
  -- Analysis scores
  clarity_score DECIMAL(3,1) CHECK (clarity_score >= 0 AND clarity_score <= 10),
  originality_score DECIMAL(3,1) CHECK (originality_score >= 0 AND originality_score <= 10),
  team_strength_score DECIMAL(3,1) CHECK (team_strength_score >= 0 AND team_strength_score <= 10),
  market_fit_score DECIMAL(3,1) CHECK (market_fit_score >= 0 AND market_fit_score <= 10),
  overall_score DECIMAL(3,1) CHECK (overall_score >= 0 AND overall_score <= 10),
  
  -- Analysis metadata
  receipt_id TEXT UNIQUE NOT NULL,
  analysis_duration INTEGER,
  ai_model_used TEXT DEFAULT 'deepseek-r1',
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Feedback and suggestions
  feedback JSONB DEFAULT '{}',
  suggestions JSONB DEFAULT '[]',
  improvement_areas JSONB DEFAULT '[]',
  
  -- Privacy and security
  encryption_key_hash TEXT,
  privacy_level TEXT DEFAULT 'standard' CHECK (privacy_level IN ('standard', 'enhanced', 'maximum')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Status tracking
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'archived')),
  error_message TEXT,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  shared_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}'
);

-- User sessions table for analytics
CREATE TABLE public.user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  pages_visited INTEGER DEFAULT 0,
  analyses_performed INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  page_url TEXT,
  referrer TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Performance metrics
  load_time INTEGER,
  interaction_time INTEGER,
  
  -- A/B testing
  experiment_id TEXT,
  variant TEXT
);

-- Feedback and ratings table
CREATE TABLE public.feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES public.pitch_analyses(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  feedback_type TEXT CHECK (feedback_type IN ('analysis_quality', 'ui_experience', 'feature_request', 'bug_report', 'general')),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription and billing table
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE public.api_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time INTEGER,
  request_size INTEGER,
  response_size INTEGER,
  ip_address INET,
  user_agent TEXT,
  api_key_hash TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Rate limiting
  rate_limit_remaining INTEGER,
  rate_limit_reset TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_pitch_analyses_user_id ON public.pitch_analyses(user_id);
CREATE INDEX idx_pitch_analyses_created_at ON public.pitch_analyses(created_at DESC);
CREATE INDEX idx_pitch_analyses_status ON public.pitch_analyses(status);
CREATE INDEX idx_pitch_analyses_receipt_id ON public.pitch_analyses(receipt_id);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_started_at ON public.user_sessions(started_at DESC);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_timestamp ON public.analytics_events(timestamp DESC);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX idx_feedback_analysis_id ON public.feedback(analysis_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX idx_api_usage_timestamp ON public.api_usage(timestamp DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pitch_analyses_updated_at BEFORE UPDATE ON public.pitch_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON public.feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
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

-- Utility Functions

-- Function to get user statistics
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

  -- Update user's total analyses count and deduct credits
  UPDATE public.users
  SET total_analyses = total_analyses + 1,
      credits_remaining = GREATEST(credits_remaining - 1, 0)
  WHERE id = current_user_id;

  RETURN analysis_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
