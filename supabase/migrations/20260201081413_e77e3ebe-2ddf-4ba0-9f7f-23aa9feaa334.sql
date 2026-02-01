-- Add youtube_video_id column to webinars table for YouTube video integration
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS youtube_video_id TEXT DEFAULT '';