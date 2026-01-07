-- Create webinars table
CREATE TABLE public.webinars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  webinar_name TEXT NOT NULL,
  header_title TEXT NOT NULL DEFAULT 'Exclusive Training Session',
  logo_text TEXT NOT NULL DEFAULT 'W',
  
  -- Video Settings
  video_url TEXT NOT NULL DEFAULT '',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- Schedule Settings
  start_hour INTEGER NOT NULL DEFAULT 12,
  start_minute INTEGER NOT NULL DEFAULT 0,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  
  -- Viewer Count
  min_viewers INTEGER NOT NULL DEFAULT 150,
  max_viewers INTEGER NOT NULL DEFAULT 300,
  
  -- Chatbot Settings
  bot_name TEXT NOT NULL DEFAULT 'Support Team',
  bot_avatar TEXT NOT NULL DEFAULT 'AI',
  webhook_url TEXT NOT NULL DEFAULT '',
  typing_delay_min INTEGER NOT NULL DEFAULT 3,
  typing_delay_max INTEGER NOT NULL DEFAULT 5,
  error_message TEXT NOT NULL DEFAULT 'Let''s keep watching the webinar! I''ll answer all questions at the end. 😊',
  
  -- Lead Capture Settings
  enable_lead_capture BOOLEAN NOT NULL DEFAULT true,
  require_name BOOLEAN NOT NULL DEFAULT true,
  require_email BOOLEAN NOT NULL DEFAULT true,
  welcome_message TEXT NOT NULL DEFAULT 'Hi {name}! 👋 Ask me anything about the training.',
  lead_webhook_url TEXT NOT NULL DEFAULT '',
  
  -- Branding
  primary_color TEXT NOT NULL DEFAULT '#e53935',
  background_color TEXT NOT NULL DEFAULT '#0a0a0f',
  chat_background TEXT NOT NULL DEFAULT '#12121a',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;

-- Create policies - webinars are public (no auth required for this app)
-- Anyone can view webinars
CREATE POLICY "Anyone can view webinars" 
ON public.webinars 
FOR SELECT 
USING (true);

-- Anyone can create webinars
CREATE POLICY "Anyone can create webinars" 
ON public.webinars 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update webinars
CREATE POLICY "Anyone can update webinars" 
ON public.webinars 
FOR UPDATE 
USING (true);

-- Anyone can delete webinars
CREATE POLICY "Anyone can delete webinars" 
ON public.webinars 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_webinars_updated_at
BEFORE UPDATE ON public.webinars
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();