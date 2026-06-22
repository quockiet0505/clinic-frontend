import type { ChatMessage } from '../types/chatbot';
import { getAiChatBaseUrl, getOrCreateSessionId } from '@/config/aiChat';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface AiChatResponse {
  reply: string;
  session_id: string;
}

function getAccessToken(): string | null {
  return localStorage.getItem('token');
}

export const chatbotApi = {
  sendMessage: async (message: string): Promise<ChatMessage> => {
    const baseUrl = getAiChatBaseUrl();
    const sessionId = getOrCreateSessionId();
    const accessToken = getAccessToken();

    const response = await fetch(`${baseUrl}/api/v1/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        ...(accessToken ? { access_token: accessToken } : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Không thể kết nối tới AI Chat service');
    }

    const data = (await response.json()) as AiChatResponse;

    return {
      id: generateId(),
      text: data.reply || 'Xin lỗi, tôi chưa thể trả lời ngay lúc này.',
      sender: 'AI',
      timestamp: new Date(),
    };
  },
};
