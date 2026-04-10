ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS ipn_webhook_slug text DEFAULT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS webinars_ipn_webhook_slug_unique ON public.webinars (ipn_webhook_slug) WHERE ipn_webhook_slug IS NOT NULL AND ipn_webhook_slug <> '';