-- Golf Charity Subscription Platform Database Schema
-- Based on PRD Requirements

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  handicap DECIMAL(4,1),
  home_course TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subscription Plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  billing_period TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  draw_entries INTEGER NOT NULL DEFAULT 1, -- number of draw entries per period
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, past_due, paused
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Charities
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  impact_statement TEXT,
  total_raised_cents INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Charity Allocations (which charities users want to support)
CREATE TABLE IF NOT EXISTS public.charity_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  allocation_percentage INTEGER NOT NULL DEFAULT 100, -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, charity_id)
);

-- 6. Golf Scores
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  date_played DATE NOT NULL,
  gross_score INTEGER NOT NULL,
  handicap_at_time DECIMAL(4,1),
  net_score DECIMAL(5,1),
  holes_played INTEGER DEFAULT 18,
  weather_conditions TEXT,
  notes TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Draws (Monthly/Weekly prize draws)
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  draw_date TIMESTAMPTZ NOT NULL,
  prize_description TEXT NOT NULL,
  prize_value_cents INTEGER,
  status TEXT NOT NULL DEFAULT 'upcoming', -- upcoming, active, completed
  winner_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Draw Entries
CREATE TABLE IF NOT EXISTS public.draw_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entries_count INTEGER NOT NULL DEFAULT 1,
  source TEXT NOT NULL DEFAULT 'subscription', -- subscription, bonus, referral
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(draw_id, user_id, source)
);

-- 9. Rewards/Achievements
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  reward_type TEXT NOT NULL, -- badge, bonus_entry, discount
  criteria JSONB, -- conditions to earn
  bonus_entries INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. User Rewards (earned rewards)
CREATE TABLE IF NOT EXISTS public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, reward_id)
);

-- 11. Donations (tracking charity contributions)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  charity_id UUID NOT NULL REFERENCES public.charities(id),
  amount_cents INTEGER NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id),
  donation_month DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Leaderboard Cache (for performance)
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- weekly, monthly, yearly, all_time
  period_start DATE NOT NULL,
  average_net_score DECIMAL(5,1),
  rounds_played INTEGER DEFAULT 0,
  best_net_score DECIMAL(5,1),
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period, period_start)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can view all profiles, but only update their own
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Subscription Plans: Everyone can view active plans
CREATE POLICY "plans_select_active" ON public.subscription_plans FOR SELECT USING (is_active = true);

-- Subscriptions: Users can only see their own
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert_own" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Charities: Everyone can view active charities
CREATE POLICY "charities_select_active" ON public.charities FOR SELECT USING (is_active = true);

-- Charity Allocations: Users manage their own
CREATE POLICY "allocations_select_own" ON public.charity_allocations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "allocations_insert_own" ON public.charity_allocations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "allocations_update_own" ON public.charity_allocations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "allocations_delete_own" ON public.charity_allocations FOR DELETE USING (auth.uid() = user_id);

-- Scores: Users manage their own, can view all for leaderboard
CREATE POLICY "scores_select_all" ON public.scores FOR SELECT USING (true);
CREATE POLICY "scores_insert_own" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "scores_update_own" ON public.scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "scores_delete_own" ON public.scores FOR DELETE USING (auth.uid() = user_id);

-- Draws: Everyone can view
CREATE POLICY "draws_select_all" ON public.draws FOR SELECT USING (true);

-- Draw Entries: Users see their own
CREATE POLICY "entries_select_own" ON public.draw_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "entries_insert_own" ON public.draw_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rewards: Everyone can view active
CREATE POLICY "rewards_select_active" ON public.rewards FOR SELECT USING (is_active = true);

-- User Rewards: Users see their own
CREATE POLICY "user_rewards_select_own" ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);

-- Donations: Users see their own
CREATE POLICY "donations_select_own" ON public.donations FOR SELECT USING (auth.uid() = user_id);

-- Leaderboard: Everyone can view
CREATE POLICY "leaderboard_select_all" ON public.leaderboard FOR SELECT USING (true);
