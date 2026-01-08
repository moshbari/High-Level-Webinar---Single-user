-- Create webinar_events table for tracking attendee behavior
CREATE TABLE public.webinar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  webinar_id TEXT NOT NULL,
  webinar_name TEXT,
  user_name TEXT,
  user_email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  watch_percent INTEGER,
  watch_minutes NUMERIC(10,2),
  cta_url TEXT,
  chat_message TEXT,
  session_id TEXT,
  device_type TEXT
);

-- Create indexes for efficient querying
CREATE INDEX idx_webinar_events_user_email ON public.webinar_events(user_email);
CREATE INDEX idx_webinar_events_event_type ON public.webinar_events(event_type);
CREATE INDEX idx_webinar_events_webinar_id ON public.webinar_events(webinar_id);
CREATE INDEX idx_webinar_events_created_at ON public.webinar_events(created_at);

-- Enable Row Level Security
ALTER TABLE public.webinar_events ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (edge function will use service role)
CREATE POLICY "Anyone can insert webinar_events"
ON public.webinar_events
FOR INSERT
WITH CHECK (true);

-- Allow viewing events (for admin dashboard)
CREATE POLICY "Anyone can view webinar_events"
ON public.webinar_events
FOR SELECT
USING (true);