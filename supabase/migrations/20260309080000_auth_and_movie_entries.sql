-- Auth and Movie Entries Migration
-- Creates user_profiles and movie_entries tables with RLS

-- 1. user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. movie_entries table
CREATE TABLE IF NOT EXISTS public.movie_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    movie_name TEXT NOT NULL,
    watch_date TEXT,
    language TEXT,
    theatre TEXT,
    screen_type TEXT,
    screen_number TEXT,
    companions TEXT,
    ticket_count INTEGER DEFAULT 1,
    seat_numbers TEXT,
    is_3d BOOLEAN DEFAULT false,
    is_opening_day BOOLEAN DEFAULT false,
    is_opening_show BOOLEAN DEFAULT false,
    show_time TEXT,
    payment_mode TEXT,
    popcorn_size TEXT DEFAULT 'none',
    cost_popcorn NUMERIC(10,2) DEFAULT 0,
    cost_coke NUMERIC(10,2) DEFAULT 0,
    cost_snacks NUMERIC(10,2) DEFAULT 0,
    cost_vada_paav NUMERIC(10,2) DEFAULT 0,
    cost_nachos NUMERIC(10,2) DEFAULT 0,
    cost_hot_dog NUMERIC(10,2) DEFAULT 0,
    cost_coffee NUMERIC(10,2) DEFAULT 0,
    cost_pressed_juice NUMERIC(10,2) DEFAULT 0,
    cost_water NUMERIC(10,2) DEFAULT 0,
    cost_samosa_chat NUMERIC(10,2) DEFAULT 0,
    cost_puffs NUMERIC(10,2) DEFAULT 0,
    cost_ticket NUMERIC(10,2) DEFAULT 0,
    cost_booking_charges NUMERIC(10,2) DEFAULT 0,
    cost_tax NUMERIC(10,2) DEFAULT 0,
    cost_parking NUMERIC(10,2) DEFAULT 0,
    total_cost NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_movie_entries_user_id ON public.movie_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_entries_watch_date ON public.movie_entries(watch_date);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- 4. Functions (BEFORE RLS policies)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_entries ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "users_manage_own_movie_entries" ON public.movie_entries;
CREATE POLICY "users_manage_own_movie_entries"
ON public.movie_entries
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_movie_entries_updated_at ON public.movie_entries;
CREATE TRIGGER update_movie_entries_updated_at
    BEFORE UPDATE ON public.movie_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
