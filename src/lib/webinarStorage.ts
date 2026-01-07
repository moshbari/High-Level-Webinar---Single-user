import { supabase } from '@/integrations/supabase/client';
import { WebinarConfig, DEFAULT_WEBINAR_CONFIG } from '@/types/webinar';

// Convert database row to WebinarConfig
const rowToConfig = (row: any): WebinarConfig => ({
  id: row.id,
  webinarName: row.webinar_name,
  headerTitle: row.header_title,
  logoText: row.logo_text,
  videoUrl: row.video_url,
  durationMinutes: row.duration_minutes,
  startHour: row.start_hour,
  startMinute: row.start_minute,
  timezone: row.timezone,
  minViewers: row.min_viewers,
  maxViewers: row.max_viewers,
  botName: row.bot_name,
  botAvatar: row.bot_avatar,
  webhookUrl: row.webhook_url,
  typingDelayMin: row.typing_delay_min,
  typingDelayMax: row.typing_delay_max,
  errorMessage: row.error_message,
  enableLeadCapture: row.enable_lead_capture,
  requireName: row.require_name,
  requireEmail: row.require_email,
  welcomeMessage: row.welcome_message,
  leadWebhookUrl: row.lead_webhook_url,
  primaryColor: row.primary_color,
  backgroundColor: row.background_color,
  chatBackground: row.chat_background,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Convert WebinarConfig to database insert/update format
const configToRow = (config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>) => ({
  webinar_name: config.webinarName,
  header_title: config.headerTitle,
  logo_text: config.logoText,
  video_url: config.videoUrl,
  duration_minutes: config.durationMinutes,
  start_hour: config.startHour,
  start_minute: config.startMinute,
  timezone: config.timezone,
  min_viewers: config.minViewers,
  max_viewers: config.maxViewers,
  bot_name: config.botName,
  bot_avatar: config.botAvatar,
  webhook_url: config.webhookUrl,
  typing_delay_min: config.typingDelayMin,
  typing_delay_max: config.typingDelayMax,
  error_message: config.errorMessage,
  enable_lead_capture: config.enableLeadCapture,
  require_name: config.requireName,
  require_email: config.requireEmail,
  welcome_message: config.welcomeMessage,
  lead_webhook_url: config.leadWebhookUrl,
  primary_color: config.primaryColor,
  background_color: config.backgroundColor,
  chat_background: config.chatBackground,
});

export const getWebinars = async (): Promise<WebinarConfig[]> => {
  const { data, error } = await supabase
    .from('webinars')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching webinars:', error);
    return [];
  }
  
  return data.map(rowToConfig);
};

export const getWebinar = async (id: string): Promise<WebinarConfig | null> => {
  const { data, error } = await supabase
    .from('webinars')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching webinar:', error);
    return null;
  }
  
  return rowToConfig(data);
};

export const saveWebinar = async (config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebinarConfig | null> => {
  const { data, error } = await supabase
    .from('webinars')
    .insert(configToRow(config))
    .select()
    .single();
  
  if (error) {
    console.error('Error saving webinar:', error);
    return null;
  }
  
  return rowToConfig(data);
};

export const updateWebinar = async (id: string, config: Partial<WebinarConfig>): Promise<WebinarConfig | null> => {
  const { id: _, createdAt, updatedAt, ...rest } = config as any;
  
  const updateData: any = {};
  if (rest.webinarName !== undefined) updateData.webinar_name = rest.webinarName;
  if (rest.headerTitle !== undefined) updateData.header_title = rest.headerTitle;
  if (rest.logoText !== undefined) updateData.logo_text = rest.logoText;
  if (rest.videoUrl !== undefined) updateData.video_url = rest.videoUrl;
  if (rest.durationMinutes !== undefined) updateData.duration_minutes = rest.durationMinutes;
  if (rest.startHour !== undefined) updateData.start_hour = rest.startHour;
  if (rest.startMinute !== undefined) updateData.start_minute = rest.startMinute;
  if (rest.timezone !== undefined) updateData.timezone = rest.timezone;
  if (rest.minViewers !== undefined) updateData.min_viewers = rest.minViewers;
  if (rest.maxViewers !== undefined) updateData.max_viewers = rest.maxViewers;
  if (rest.botName !== undefined) updateData.bot_name = rest.botName;
  if (rest.botAvatar !== undefined) updateData.bot_avatar = rest.botAvatar;
  if (rest.webhookUrl !== undefined) updateData.webhook_url = rest.webhookUrl;
  if (rest.typingDelayMin !== undefined) updateData.typing_delay_min = rest.typingDelayMin;
  if (rest.typingDelayMax !== undefined) updateData.typing_delay_max = rest.typingDelayMax;
  if (rest.errorMessage !== undefined) updateData.error_message = rest.errorMessage;
  if (rest.enableLeadCapture !== undefined) updateData.enable_lead_capture = rest.enableLeadCapture;
  if (rest.requireName !== undefined) updateData.require_name = rest.requireName;
  if (rest.requireEmail !== undefined) updateData.require_email = rest.requireEmail;
  if (rest.welcomeMessage !== undefined) updateData.welcome_message = rest.welcomeMessage;
  if (rest.leadWebhookUrl !== undefined) updateData.lead_webhook_url = rest.leadWebhookUrl;
  if (rest.primaryColor !== undefined) updateData.primary_color = rest.primaryColor;
  if (rest.backgroundColor !== undefined) updateData.background_color = rest.backgroundColor;
  if (rest.chatBackground !== undefined) updateData.chat_background = rest.chatBackground;

  const { data, error } = await supabase
    .from('webinars')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating webinar:', error);
    return null;
  }
  
  return rowToConfig(data);
};

export const deleteWebinar = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('webinars')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting webinar:', error);
    return false;
  }
  
  return true;
};

export const createDefaultWebinar = (): Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'> => {
  return { ...DEFAULT_WEBINAR_CONFIG };
};
