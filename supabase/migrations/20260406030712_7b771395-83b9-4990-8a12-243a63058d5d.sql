ALTER TABLE public.webinars ADD COLUMN just_in_time_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE public.webinars ADD COLUMN just_in_time_minutes integer NOT NULL DEFAULT 15;