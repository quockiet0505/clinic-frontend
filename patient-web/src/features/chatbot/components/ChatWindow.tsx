import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatMessageBubble } from './ChatMessageBubble';
import { chatbotApi } from '../api/chatbotApi';
import type { ChatMessage } from '../types/chatbot';

interface Props {
  onClose: () => void;
}

export const ChatWindow: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Chào bạn! Tôi là Trợ lý Y tế AI của ClinicPro. Bạn cần hỗ trợ thông tin gì ạ?',
      sender: 'AI',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    
    const textToSend = textOverride || inputValue.trim();
    if (!textToSend) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      text: textToSend,
      sender: 'USER',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const aiMsgId = Math.random().toString();
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      text: '',
      sender: 'AI',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, initialAiMsg]);

    try {
      await chatbotApi.streamMessage(userMsg.text, (chunkText: string) => {
        setIsTyping(false);
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === aiMsgId
              ? { ...msg, text: msg.text + chunkText }
              : msg
          )
        );
      });
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === aiMsgId
            ? { ...msg, text: 'Xin lỗi, hiện tại trợ lý y tế đang bận hoặc hệ thống đang bảo trì. Bạn vui lòng thử lại sau giây lát nhé.' }
            : msg
        )
      );
    }
  };

  return (
    <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl rounded-3xl border-border-default overflow-hidden animate-in slide-in-from-bottom-5 duration-300 z-50 bg-white">

      {/* Header */}
      <CardHeader className="bg-primary-500 p-4 flex flex-row items-center justify-between border-b border-primary-600/50">
        <CardTitle className="text-white text-[16px] font-black flex items-center gap-2 m-0">
          <Sparkles className="w-5 h-5" /> Trợ lý Y tế AI
        </CardTitle>
        <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-primary-600 p-1.5 rounded-full transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </CardHeader>

      {/* Body: Danh sách tin nhắn */}
      <CardContent className="flex-1 bg-background-light p-4 overflow-y-auto" ref={scrollRef}>
        {messages.map(msg => (
          <ChatMessageBubble 
            key={msg.id} 
            message={msg} 
            onQuickReply={(text) => handleSend(undefined, text)} 
          />
        ))}
        {isTyping && (
          <div className="flex w-full justify-start mb-4">
            <div className="flex gap-2 flex-row">
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-border-default text-slate-400 text-[13px] font-medium rounded-tl-sm flex items-center gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer: Input gửi tin nhắn */}
      <div className="p-3 bg-white border-t border-border-default">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 bg-background-light border border-border-default rounded-full px-4 h-11 text-[14px] text-brand-dark outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-11 h-11 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>

    </Card>
  );
};