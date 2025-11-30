-- Migration: Create keep-alive table for database activity
-- This table is used to keep the database active by inserting and deleting records

CREATE TABLE IF NOT EXISTS public.db_keepalive (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL DEFAULT 'goodmorning db',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_db_keepalive_message ON public.db_keepalive(message);
CREATE INDEX IF NOT EXISTS idx_db_keepalive_created_at ON public.db_keepalive(created_at);

-- Enable Row Level Security (but we'll use service role key to bypass it)
ALTER TABLE public.db_keepalive ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows service role to do everything
-- This allows the backend to insert/delete without RLS restrictions
CREATE POLICY "Service role can manage keepalive" ON public.db_keepalive
    FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.db_keepalive TO postgres, anon, authenticated, service_role;

