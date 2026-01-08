-- Add tracking configuration columns to webinars table
ALTER TABLE public.webinars
ADD COLUMN IF NOT EXISTS enable_tracking boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS tracking_webhook_url text NOT NULL DEFAULT 'https://moshbari.cloud/webhook/webinar-tracking';