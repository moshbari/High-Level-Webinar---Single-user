-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS on leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS policies for leads (public access for now)
CREATE POLICY "Anyone can view leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Anyone can create leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete leads" ON public.leads FOR DELETE USING (true);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_messages
CREATE POLICY "Anyone can view chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete chat_messages" ON public.chat_messages FOR DELETE USING (true);

-- Create cta_clicks table
CREATE TABLE public.cta_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  minutes_watched INTEGER NOT NULL DEFAULT 0,
  button_text TEXT,
  button_url TEXT
);

-- Enable RLS on cta_clicks
ALTER TABLE public.cta_clicks ENABLE ROW LEVEL SECURITY;

-- RLS policies for cta_clicks
CREATE POLICY "Anyone can view cta_clicks" ON public.cta_clicks FOR SELECT USING (true);
CREATE POLICY "Anyone can create cta_clicks" ON public.cta_clicks FOR INSERT WITH CHECK (true);

-- Add CTA fields to webinars table
ALTER TABLE public.webinars
ADD COLUMN enable_cta BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN cta_show_after_minutes INTEGER NOT NULL DEFAULT 45,
ADD COLUMN cta_headline TEXT NOT NULL DEFAULT 'Ready to Transform Your Life?',
ADD COLUMN cta_subheadline TEXT NOT NULL DEFAULT 'Join thousands of successful students',
ADD COLUMN cta_button_text TEXT NOT NULL DEFAULT 'Get Instant Access →',
ADD COLUMN cta_button_url TEXT NOT NULL DEFAULT '',
ADD COLUMN cta_button_color TEXT NOT NULL DEFAULT '#e53935',
ADD COLUMN cta_style TEXT NOT NULL DEFAULT 'banner',
ADD COLUMN cta_show_urgency BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN cta_urgency_text TEXT NOT NULL DEFAULT '⚡ Limited spots available!';