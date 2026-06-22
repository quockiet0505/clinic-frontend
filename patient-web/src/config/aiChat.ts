const SESSION_KEY = 'clinic_ai_session_id';

export const getAiChatBaseUrl = (): string =>
  import.meta.env.VITE_AI_CHAT_URL || 'http://localhost:8000';

export const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return 'web-session';

  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const sessionId = `web-${crypto.randomUUID()}`;
  localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};
