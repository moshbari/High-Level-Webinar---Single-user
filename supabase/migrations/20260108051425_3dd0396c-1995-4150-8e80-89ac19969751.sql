-- Add UPDATE policy for webinar_events
CREATE POLICY "Anyone can update webinar_events"
ON public.webinar_events
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Add DELETE policy for webinar_events
CREATE POLICY "Anyone can delete webinar_events"
ON public.webinar_events
FOR DELETE
USING (true);