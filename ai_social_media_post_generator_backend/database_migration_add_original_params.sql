-- Migration to add original request parameters to posts table
-- Run this SQL in your Supabase SQL Editor

-- Add new columns to store original request parameters
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS include_hashtags BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS include_images BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS days INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS additional_context TEXT DEFAULT '';

-- Update existing posts to have default values
UPDATE public.posts 
SET 
  include_hashtags = true,
  include_images = true,
  days = 1,
  additional_context = ''
WHERE 
  include_hashtags IS NULL 
  OR include_images IS NULL 
  OR days IS NULL 
  OR additional_context IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.posts.include_hashtags IS 'Whether hashtags were requested in original post creation';
COMMENT ON COLUMN public.posts.include_images IS 'Whether images were requested in original post creation';
COMMENT ON COLUMN public.posts.days IS 'Number of days requested in original post creation';
COMMENT ON COLUMN public.posts.additional_context IS 'Additional context provided in original post creation';
