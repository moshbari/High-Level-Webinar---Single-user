
-- Add landing page template columns to webinars
ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS reg_form_layout text DEFAULT 'simple',
  ADD COLUMN IF NOT EXISTS reg_form_pre_headline text DEFAULT '',
  ADD COLUMN IF NOT EXISTS reg_form_post_headline text DEFAULT '',
  ADD COLUMN IF NOT EXISTS reg_form_bullet_headline text DEFAULT 'What You Will Learn:',
  ADD COLUMN IF NOT EXISTS reg_form_bullets jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS reg_form_presenters jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS reg_form_hero_image_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS reg_form_disclaimer_text text DEFAULT '',
  ADD COLUMN IF NOT EXISTS reg_form_legal_links jsonb DEFAULT '[]'::jsonb;

-- Create storage bucket for registration page assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('registration-assets', 'registration-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Registration assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'registration-assets');

-- Authenticated users can upload to their own folder
CREATE POLICY "Authenticated users can upload registration assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'registration-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Authenticated users can update their own uploads
CREATE POLICY "Authenticated users can update registration assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'registration-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Authenticated users can delete their own uploads
CREATE POLICY "Authenticated users can delete registration assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'registration-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
