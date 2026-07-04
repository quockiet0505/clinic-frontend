const SESSION_KEY = 'clinic_ai_session_id';

export const getAiChatBaseUrl = (): string =>
  import.meta.env.VITE_AI_CHAT_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for insecure contexts (HTTP)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return 'web-session';

  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = `web-${generateUUID()}`;
  localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};
