-- Stealth Score Database Schema
-- Initial migration for Supabase integration

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
  content_hash TEXT NOT NULL, -- SHA-256 hash of encrypted content
  analysis_type TEXT DEFAULT 'text' CHECK (analysis_type IN ('text', 'audio', 'document')),
  file_url TEXT, -- For uploaded files
  file_type TEXT, -- MIME type
  file_size INTEGER, -- File size in bytes
  
  -- Analysis scores
  clarity_score DECIMAL(3,1) CHECK (clarity_score >= 0 AND clarity_score <= 10),
  originality_score DECIMAL(3,1) CHECK (originality_score >= 0 AND originality_score <= 10),
  team_strength_score DECIMAL(3,1) CHECK (team_strength_score >= 0 AND team_strength_score <= 10),
  market_fit_score DECIMAL(3,1) CHECK (market_fit_score >= 0 AND market_fit_score <= 10),
  overall_score DECIMAL(3,1) CHECK (overall_score >= 0 AND overall_score <= 10),
  
  -- Analysis metadata
  receipt_id TEXT UNIQUE NOT NULL,
  analysis_duration INTEGER, -- Duration in milliseconds
  ai_model_used TEXT DEFAULT 'deepseek-r1',
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Feedback and suggestions
  feedback JSONB DEFAULT '{}',
  suggestions JSONB DEFAULT '[]',
  improvement_areas JSONB DEFAULT '[]',
  
  -- Privacy and security
  encryption_key_hash TEXT, -- Hash of the encryption key used
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
  duration INTEGER, -- Duration in seconds
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
  load_time INTEGER, -- Page load time in milliseconds
  interaction_time INTEGER, -- Time to first interaction
  
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
  response_time INTEGER, -- Response time in milliseconds
  request_size INTEGER, -- Request size in bytes
  response_size INTEGER, -- Response size in bytes
  ip_address INET,
  user_agent TEXT,
  api_key_hash TEXT, -- Hash of API key if used
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
