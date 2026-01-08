export interface WebinarConfig {
  id: string;
  // Basic Info
  webinarName: string;
  headerTitle: string;
  logoText: string;
  
  // Video
  videoUrl: string;
  durationSeconds: number;
  
  // Schedule
  startHour: number;
  startMinute: number;
  timezone: string;
  
  // Viewers
  minViewers: number;
  maxViewers: number;
  
  // Chatbot
  botName: string;
  botAvatar: string;
  webhookUrl: string;
  typingDelayMin: number;
  typingDelayMax: number;
  errorMessage: string;
  
  // Lead Capture
  enableLeadCapture: boolean;
  requireName: boolean;
  requireEmail: boolean;
  welcomeMessage: string;
  leadWebhookUrl: string;
  
  // CTA Settings
  enableCta: boolean;
  ctaShowAfterSeconds: number;
  ctaHeadline: string;
  ctaSubheadline: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  ctaButtonColor: string;
  ctaStyle: 'banner' | 'floating';
  ctaShowUrgency: boolean;
  ctaUrgencyText: string;
  
  // Tracking Settings
  enableTracking: boolean;
  trackingWebhookUrl: string;
  
  // Branding
  primaryColor: string;
  backgroundColor: string;
  chatBackground: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  userName?: string;
}

export interface LeadData {
  name: string;
  email: string;
  timestamp: string;
  webinarName: string;
  source: string;
}

export interface DbChatMessage {
  id: string;
  webinar_id: string;
  lead_id: string | null;
  user_name: string;
  user_email: string;
  user_message: string;
  ai_response: string;
  sent_at: string;
  session_date: string;
}

export interface DbLead {
  id: string;
  webinar_id: string;
  name: string;
  email: string;
  captured_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export type WebinarState = 'countdown' | 'live' | 'ended';

export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona (AZ)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST)' },
];

export const DEFAULT_WEBINAR_CONFIG: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'> = {
  webinarName: '',
  headerTitle: 'Customers - Exclusive Training Session',
  logoText: 'W',
  videoUrl: '',
  durationSeconds: 13200, // 3 hours 40 minutes
  startHour: 20,
  startMinute: 0,
  timezone: 'Asia/Dubai',
  minViewers: 150,
  maxViewers: 300,
  botName: 'Admin',
  botAvatar: 'M',
  webhookUrl: 'https://moshbari.cloud/webhook/webby-chatbot-6jan26',
  typingDelayMin: 3,
  typingDelayMax: 5,
  errorMessage: "Let's keep watching the webinar! I'll answer all questions at the end. 😊",
  enableLeadCapture: true,
  requireName: true,
  requireEmail: true,
  welcomeMessage: "Hi {name}! 👋 Ask me anything about the training.",
  leadWebhookUrl: '',
  enableCta: true,
  ctaShowAfterSeconds: 7920, // 2 hours 12 minutes
  ctaHeadline: '99% DFY $500 Comm System',
  ctaSubheadline: 'With 16 AI Employees',
  ctaButtonText: 'Secure Your Spot Now →',
  ctaButtonUrl: '',
  ctaButtonColor: '#e53935',
  ctaStyle: 'banner',
  ctaShowUrgency: false,
  ctaUrgencyText: '⚡ Limited spots available!',
  enableTracking: true,
  trackingWebhookUrl: 'https://moshbari.cloud/webhook/webinar-tracking',
  primaryColor: '#e53935',
  backgroundColor: '#0a0a0f',
  chatBackground: '#12121a',
};
