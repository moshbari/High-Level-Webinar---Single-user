import { WebinarConfig, DEFAULT_WEBINAR_CONFIG } from '@/types/webinar';

const STORAGE_KEY = 'webinar_configs';

export const generateId = (): string => {
  return `webinar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getWebinars = (): WebinarConfig[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getWebinar = (id: string): WebinarConfig | null => {
  const webinars = getWebinars();
  return webinars.find(w => w.id === id) || null;
};

export const saveWebinar = (config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>): WebinarConfig => {
  const webinars = getWebinars();
  const now = new Date().toISOString();
  
  const newWebinar: WebinarConfig = {
    ...config,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  
  webinars.push(newWebinar);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(webinars));
  
  return newWebinar;
};

export const updateWebinar = (id: string, config: Partial<WebinarConfig>): WebinarConfig | null => {
  const webinars = getWebinars();
  const index = webinars.findIndex(w => w.id === id);
  
  if (index === -1) return null;
  
  const updated: WebinarConfig = {
    ...webinars[index],
    ...config,
    id, // Ensure ID doesn't change
    createdAt: webinars[index].createdAt, // Preserve created date
    updatedAt: new Date().toISOString(),
  };
  
  webinars[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(webinars));
  
  return updated;
};

export const deleteWebinar = (id: string): boolean => {
  const webinars = getWebinars();
  const filtered = webinars.filter(w => w.id !== id);
  
  if (filtered.length === webinars.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

export const createDefaultWebinar = (): Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'> => {
  return { ...DEFAULT_WEBINAR_CONFIG };
};
