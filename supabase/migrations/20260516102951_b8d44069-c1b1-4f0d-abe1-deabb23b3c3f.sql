DROP POLICY IF EXISTS "Anyone can view webinars for public pages" ON public.webinars;

CREATE POLICY "Anon can view webinars for public pages"
ON public.webinars
FOR SELECT
TO anon
USING (true);