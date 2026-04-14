ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS reg_form_bullet_color text DEFAULT '#1e40af',
  ADD COLUMN IF NOT EXISTS reg_form_subheadline_color text;