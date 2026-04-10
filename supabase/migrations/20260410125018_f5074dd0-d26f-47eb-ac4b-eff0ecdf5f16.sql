
ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS product_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS vendor_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS slug text DEFAULT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS webinars_slug_unique ON public.webinars (slug) WHERE slug IS NOT NULL AND slug <> '';
