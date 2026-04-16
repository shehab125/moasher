-- Moasher Initial Schema
-- Created on 2026-04-16

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Regions (e.g., Central Region, Western Region)
CREATE TABLE IF NOT EXISTS public.regions (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Districts (neighborhoods within regions)
CREATE TABLE IF NOT EXISTS public.districts (
  id SERIAL PRIMARY KEY,
  region_id INTEGER REFERENCES public.regions(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Property Types (Residential, Commercial, Agricultural, Industrial)
CREATE TABLE IF NOT EXISTS public.property_types (
  id SERIAL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Transactions (The core data records)
CREATE TABLE IF NOT EXISTS public.transactions (
  id SERIAL PRIMARY KEY,
  region_id INTEGER REFERENCES public.regions(id) ON DELETE SET NULL,
  district_id INTEGER REFERENCES public.districts(id) ON DELETE SET NULL,
  property_type_id INTEGER REFERENCES public.property_types(id) ON DELETE SET NULL,
  total_price NUMERIC NOT NULL,
  price_per_meter NUMERIC,
  area_sqm NUMERIC NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  usage_type TEXT, -- e.g., 'سكني', 'تجاري'
  plan_number TEXT,
  parcel_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Saved Items (User's bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_id INTEGER REFERENCES public.transactions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, transaction_id)
);

-- 7. Subscription Limits Configuration
CREATE TABLE IF NOT EXISTS public.subscription_limits (
  id SERIAL PRIMARY KEY,
  plan TEXT UNIQUE NOT NULL, -- 'free', 'premium'
  max_saved_items INTEGER,
  historical_data_years INTEGER,
  can_export BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Anyone can view names, but only owners can edit
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Public Reading Data
CREATE POLICY "Regions are viewable by everyone" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Districts are viewable by everyone" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Property types are viewable by everyone" ON public.property_types FOR SELECT USING (true);
CREATE POLICY "Transactions are viewable by everyone" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Limits are viewable by everyone" ON public.subscription_limits FOR SELECT USING (true);

-- Saved Items: Owner only access
CREATE POLICY "Users can manage their own saved items." ON public.saved_items
  FOR ALL USING (auth.uid() = user_id);

-- Profile Trigger (Automatically create profile record on Auth Signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, subscription_plan)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'), 
    new.email, 
    'user', 
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
