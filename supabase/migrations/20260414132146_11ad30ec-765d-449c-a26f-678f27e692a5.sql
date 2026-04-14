ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS reg_form_font_family text DEFAULT 'Inter',
  ADD COLUMN IF NOT EXISTS reg_form_headline_font_family text DEFAULT 'Space Grotesk',
  ADD COLUMN IF NOT EXISTS reg_form_headline_font_size text DEFAULT '2.5rem',
  ADD COLUMN IF NOT EXISTS reg_form_body_font_size text DEFAULT '1rem',
  ADD COLUMN IF NOT EXISTS reg_form_headline_color text,
  ADD COLUMN IF NOT EXISTS reg_form_headline_font_weight text DEFAULT '700';