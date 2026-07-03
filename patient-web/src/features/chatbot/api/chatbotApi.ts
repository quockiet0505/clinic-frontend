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

  streamMessage: async (
    message: string,
    onChunk: (text: string) => void
  ): Promise<void> => {
    const baseUrl = getAiChatBaseUrl();
    const sessionId = getOrCreateSessionId();
    const accessToken = getAccessToken();

    const response = await fetch(`${baseUrl}/api/v1/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        ...(accessToken ? { access_token: accessToken } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (!response.body) {
      throw new Error('ReadableStream not yet supported in this browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          let text = line.substring(6); // Bỏ chữ "data: "
          if (text === '[DONE]') continue;
          
          // Xử lý xuống dòng cho chunk nếu frontend cần
          text = text.replace(/\\n/g, '\n');
          onChunk(text);
        }
      }
    }
  },

  clearSession: async (): Promise<void> => {
    const baseUrl = getAiChatBaseUrl();
    const sessionId = getOrCreateSessionId();
    try {
      await fetch(`${baseUrl}/api/v1/chat/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      // Optionally reset session ID in localStorage if desired:
      // localStorage.removeItem('chat_session_id');
    } catch (e) {
      console.error("Failed to clear session", e);
    }
  }
};
