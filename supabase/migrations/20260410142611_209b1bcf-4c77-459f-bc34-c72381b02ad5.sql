ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS ipn_forward_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS ipn_forward_url text DEFAULT '';