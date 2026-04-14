import { VideoSequenceItem, VideoMode } from './clip';

export interface WebinarConfig {
  id: string;
  // Basic Info
  webinarName: string;
  headerTitle: string;
  logoText: string;
  
  // Video
  videoUrl: string;
  durationSeconds: number;
  videoMode: VideoMode;
  videoSequence: VideoSequenceItem[];
  
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
  
  // Registration Form Settings
  enableRegistrationForm: boolean;
  regFormHeadline: string;
  regFormSubheadline: string;
  regFormNameLabel: string;
  regFormNamePlaceholder: string;
  regFormEmailLabel: string;
  regFormEmailPlaceholder: string;
  regFormButtonText: string;
  regFormButtonColor: string;
  regFormEmailPlatform: 'ghl' | 'systeme';
  regFormGhlWebhookUrl: string;
  regFormSystemeWebhookUrl: string;
  regFormThankYouUrl: string;
  regFormShowDatetime: boolean;
  regFormBackground: string;
  regFormTextColor: string;
  regFormBorderRadius: 'none' | 'slight' | 'rounded' | 'pill';
  regFormShowPrivacy: boolean;
  regFormPrivacyText: string;
  regFormTheme: 'dark' | 'light';
  
  // Font Settings
  regFormFontFamily: string;
  regFormHeadlineFontFamily: string;
  regFormHeadlineFontSize: string;
  regFormBodyFontSize: string;
  regFormHeadlineColor: string;
  regFormHeadlineFontWeight: string;
  
  // Landing Page Template
  regFormLayout: 'simple' | 'landing';
  regFormPreHeadline: string;
  regFormPostHeadline: string;
  regFormBulletHeadline: string;
  regFormBullets: string[];
  regFormPresenters: Array<{ name: string; title: string; photoUrl: string }>;
  regFormHeroImageUrl: string;
  regFormDisclaimerText: string;
  regFormLegalLinks: Array<{ label: string; url: string }>;
  
  // Just-in-Time Sessions
  justInTimeEnabled: boolean;
  justInTimeMinutes: number;
  
  // Product & Vendor
  productName: string;
  vendorName: string;
  
  // Custom URL Slug
  slug: string;
  
  // IPN Webhook
  ipnWebhookSlug: string;
  ipnForwardEnabled: boolean;
  ipnForwardUrl: string;

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
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York - Eastern Time (ET)' },
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
  videoMode: 'single',
  videoSequence: [],
  startHour: 20,
  startMinute: 0,
  timezone: 'Asia/Dubai',
  minViewers: 257,
  maxViewers: 283,
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
  ctaShowUrgency: true,
  ctaUrgencyText: '⚡ Limited spots available!',
  enableTracking: true,
  trackingWebhookUrl: 'https://moshbari.cloud/webhook/webinar-tracking',
  primaryColor: '#e53935',
  backgroundColor: '#0a0a0f',
  chatBackground: '#12121a',
  // Registration Form defaults
  enableRegistrationForm: false,
  regFormHeadline: 'Register for the Free Training',
  regFormSubheadline: 'Save your spot now!',
  regFormNameLabel: 'Your Name',
  regFormNamePlaceholder: 'Enter your name',
  regFormEmailLabel: 'Your Email',
  regFormEmailPlaceholder: 'Enter your email',
  regFormButtonText: 'Reserve My Seat →',
  regFormButtonColor: '#e53935',
  regFormEmailPlatform: 'ghl',
  regFormGhlWebhookUrl: '',
  regFormSystemeWebhookUrl: '',
  regFormThankYouUrl: '',
  regFormShowDatetime: true,
  regFormBackground: '#0a0a0f',
  regFormTextColor: '#ffffff',
  regFormBorderRadius: 'rounded',
  regFormShowPrivacy: true,
  regFormPrivacyText: 'We respect your privacy. Unsubscribe anytime.',
  regFormTheme: 'dark',
  // Font Settings
  regFormFontFamily: 'Inter',
  regFormHeadlineFontFamily: 'Space Grotesk',
  regFormHeadlineFontSize: '2.5rem',
  regFormBodyFontSize: '1rem',
  regFormHeadlineColor: '',
  regFormHeadlineFontWeight: '700',
  // Landing Page Template
  regFormLayout: 'simple',
  regFormPreHeadline: '',
  regFormPostHeadline: '',
  regFormBulletHeadline: 'What You Will Learn:',
  regFormBullets: [],
  regFormPresenters: [],
  regFormHeroImageUrl: '',
  regFormDisclaimerText: 'This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.\n\n*Earnings and income representations made by Mosh Bari, Mosh Bari\'s agency, and Mosh Bari\'s agency and their advertisers/sponsors (collectively, "Mosh Bari\'s agency") are aspirational statements only of your earnings potential. These results are not typical and results will vary. The results on this page are OUR results and from years of testing. We can in NO way guarantee you will get similar results.',
  regFormLegalLinks: [
    { label: 'Privacy Policy', url: 'https://winarzapps.com/privacy-policy/' },
    { label: 'Terms of Service', url: 'https://winarzapps.com/terms-of-service/' },
    { label: 'Disclaimer', url: 'https://winarzapps.com/earning-disclaimer' },
  ],
  // Just-in-Time Sessions
  justInTimeEnabled: false,
  justInTimeMinutes: 15,
  // Product & Vendor
  productName: '',
  vendorName: '',
  // Custom URL Slug
  slug: '',
  // IPN Webhook
  ipnWebhookSlug: '',
  ipnForwardEnabled: false,
  ipnForwardUrl: '',
};
