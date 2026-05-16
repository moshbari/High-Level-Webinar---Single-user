
-- Restrict SELECT/UPDATE/DELETE on per-webinar data to the webinar owner (or admin).
-- INSERTs remain open since anonymous public viewers need to write chats/events/leads.

-- ============ chat_messages ============
DROP POLICY IF EXISTS "Anyone can view chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can delete chat_messages" ON public.chat_messages;

CREATE POLICY "Owners and admins can view chat_messages"
ON public.chat_messages FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = chat_messages.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Owners and admins can delete chat_messages"
ON public.chat_messages FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = chat_messages.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

-- ============ chat_sessions ============
DROP POLICY IF EXISTS "Anyone can view chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can update chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can delete chat_sessions" ON public.chat_sessions;

CREATE POLICY "Owners and admins can view chat_sessions"
ON public.chat_sessions FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = chat_sessions.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Owners and admins can update chat_sessions"
ON public.chat_sessions FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = chat_sessions.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Owners and admins can delete chat_sessions"
ON public.chat_sessions FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = chat_sessions.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

-- ============ pending_replies ============
DROP POLICY IF EXISTS "Anyone can view pending_replies" ON public.pending_replies;
DROP POLICY IF EXISTS "Anyone can update pending_replies" ON public.pending_replies;
DROP POLICY IF EXISTS "Anyone can delete pending_replies" ON public.pending_replies;

CREATE POLICY "Owners and admins can view pending_replies"
ON public.pending_replies FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = pending_replies.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Owners and admins can update pending_replies"
ON public.pending_replies FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = pending_replies.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Owners and admins can delete pending_replies"
ON public.pending_replies FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = pending_replies.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

-- ============ webinar_events (webinar_id is TEXT) ============
DROP POLICY IF EXISTS "Anyone can view webinar_events" ON public.webinar_events;
DROP POLICY IF EXISTS "Anyone can update webinar_events" ON public.webinar_events;
DROP POLICY IF EXISTS "Anyone can delete webinar_events" ON public.webinar_events;

CREATE POLICY "Owners and admins can view webinar_events"
ON public.webinar_events FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id::text = webinar_events.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Owners and admins can update webinar_events"
ON public.webinar_events FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id::text = webinar_events.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Owners and admins can delete webinar_events"
ON public.webinar_events FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id::text = webinar_events.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

-- ============ cta_clicks ============
DROP POLICY IF EXISTS "Anyone can view cta_clicks" ON public.cta_clicks;

CREATE POLICY "Owners and admins can view cta_clicks"
ON public.cta_clicks FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = cta_clicks.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

-- ============ leads ============
DROP POLICY IF EXISTS "Anyone can view leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can delete leads" ON public.leads;

CREATE POLICY "Owners and admins can view leads"
ON public.leads FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = leads.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Owners and admins can delete leads"
ON public.leads FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.webinars w
          WHERE w.id = leads.webinar_id
            AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role)))
);

-- Helpful indexes for the EXISTS lookups
CREATE INDEX IF NOT EXISTS idx_chat_messages_webinar_id ON public.chat_messages(webinar_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_webinar_id ON public.chat_sessions(webinar_id);
CREATE INDEX IF NOT EXISTS idx_pending_replies_webinar_id ON public.pending_replies(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_events_webinar_id ON public.webinar_events(webinar_id);
CREATE INDEX IF NOT EXISTS idx_cta_clicks_webinar_id ON public.cta_clicks(webinar_id);
CREATE INDEX IF NOT EXISTS idx_leads_webinar_id ON public.leads(webinar_id);
