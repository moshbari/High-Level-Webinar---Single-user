export interface WebinarConfig {
  id: string;
  // Basic Info
  webinarName: string;
  headerTitle: string;
  logoText: string;
  
  // Video
  videoUrl: string;
  durationMinutes: number;
  
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
  headerTitle: 'Exclusive Training Session',
  logoText: 'W',
  videoUrl: '',
  durationMinutes: 60,
  startHour: 12,
  startMinute: 0,
  timezone: 'America/New_York',
  minViewers: 150,
  maxViewers: 300,
  botName: 'Support Team',
  botAvatar: 'AI',
  webhookUrl: '',
  typingDelayMin: 3,
  typingDelayMax: 5,
  errorMessage: "Let's keep watching the webinar! I'll answer all questions at the end. 😊",
  enableLeadCapture: true,
  requireName: true,
  requireEmail: true,
  welcomeMessage: "Hi {name}! 👋 Ask me anything about the training.",
  leadWebhookUrl: '',
  primaryColor: '#e53935',
  backgroundColor: '#0a0a0f',
  chatBackground: '#12121a',
};
