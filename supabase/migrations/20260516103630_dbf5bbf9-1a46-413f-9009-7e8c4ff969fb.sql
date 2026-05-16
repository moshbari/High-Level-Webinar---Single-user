ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS chatbot_system_prompt TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS chatbot_knowledge_base TEXT NOT NULL DEFAULT '';