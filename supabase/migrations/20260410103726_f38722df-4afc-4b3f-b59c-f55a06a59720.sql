ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS reg_form_email_platform text DEFAULT 'ghl';
ALTER TABLE public.webinars ADD COLUMN IF NOT EXISTS reg_form_systeme_webhook_url text DEFAULT '';