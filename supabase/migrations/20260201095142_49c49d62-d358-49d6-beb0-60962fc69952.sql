-- Drop the old check constraint and create a new one that includes 'youtube'
ALTER TABLE public.webinars DROP CONSTRAINT IF EXISTS webinars_video_mode_check;

ALTER TABLE public.webinars ADD CONSTRAINT webinars_video_mode_check 
CHECK (video_mode IN ('single', 'sequence', 'youtube'));