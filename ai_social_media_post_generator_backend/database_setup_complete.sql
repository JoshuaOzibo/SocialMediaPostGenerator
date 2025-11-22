-- ============================================================================
-- COMPLETE DATABASE SETUP FOR AI SOCIAL POST GENERATOR
-- ============================================================================
-- This file contains everything needed to set up your database.
-- Run this entire file in your Supabase SQL Editor.
-- ============================================================================

-- Step 1: Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('twitter', 'facebook', 'instagram', 'linkedin', 'tiktok')),
    tone VARCHAR(50) NOT NULL CHECK (tone IN ('professional', 'casual', 'humorous', 'formal', 'friendly', 'enthusiastic')),
    input_bullets TEXT[] NOT NULL,
    generated_posts TEXT[] NOT NULL,
    hashtags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    image_metadata JSONB DEFAULT '[]',
    individual_posts JSONB DEFAULT '[]', -- Store individual posts with their own hashtags and images
    include_hashtags BOOLEAN DEFAULT true,
    include_images BOOLEAN DEFAULT true,
    days INTEGER DEFAULT 1,
    additional_context TEXT DEFAULT '',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create user_profiles table for additional user data
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    preferred_platforms VARCHAR(50)[] DEFAULT '{}',
    brand_voice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create scheduled_posts table for advanced scheduling
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    hashtags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    image_metadata JSONB DEFAULT '[]',
    posting_date DATE NOT NULL,
    day_number INTEGER NOT NULL,
    platform VARCHAR(50) NOT NULL,
    tone VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_at ON public.scheduled_posts(posting_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON public.scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON public.scheduled_posts(user_id);

-- Step 5: Enable Row Level Security on all tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view their own scheduled posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "Users can insert their own scheduled posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "Users can update their own scheduled posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "Users can delete their own scheduled posts" ON public.scheduled_posts;

-- Step 7: Create RLS policies for posts table
CREATE POLICY "Users can view their own posts" ON public.posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- Step 8: Create RLS policies for user_profiles table
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Step 9: Create RLS policies for scheduled_posts table
CREATE POLICY "Users can view their own scheduled posts" ON public.scheduled_posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled posts" ON public.scheduled_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled posts" ON public.scheduled_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled posts" ON public.scheduled_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Step 10: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 11: Drop existing triggers if they exist (to allow re-running this script)
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_scheduled_posts_updated_at ON public.scheduled_posts;

-- Step 12: Create triggers for updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at BEFORE UPDATE ON public.scheduled_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 13: Grant necessary permissions to ensure PostgREST can access the tables
-- This ensures the tables are exposed to the REST API
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.posts TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.scheduled_posts TO postgres, anon, authenticated, service_role;

-- Step 14: Grant sequence permissions (for auto-increment IDs if any)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Step 15: Add comments for documentation
COMMENT ON COLUMN public.posts.include_hashtags IS 'Whether hashtags were requested in original post creation';
COMMENT ON COLUMN public.posts.include_images IS 'Whether images were requested in original post creation';
COMMENT ON COLUMN public.posts.days IS 'Number of days requested in original post creation';
COMMENT ON COLUMN public.posts.additional_context IS 'Additional context provided in original post creation';

-- Step 16: Attempt to notify PostgREST to reload schema cache
-- Note: This may not work in all Supabase setups, but it's harmless to try
DO $$
BEGIN
    PERFORM pg_notify('pgrst', 'reload schema');
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore if notification fails
        NULL;
END $$;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- After running this script:
-- 1. Wait 1-2 minutes for PostgREST to refresh its schema cache
-- 2. Verify tables exist by checking the Supabase Dashboard → Table Editor
-- 3. Test your backend health endpoint: http://localhost:8080/api/v1/health/health
-- ============================================================================
