/* eslint-disable react-hooks/purity */
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { chatbotApi } from '../api/chatbotApi';
import type { ChatMessage } from '../types/chatbot';
import aiAvatar from '@/assets/images/ai-avatar.png'; // import ảnh AI

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Chào bạn! Tôi là Trợ lý Y tế AI của ClinicPro. Tôi có thể giúp gì cho bạn hôm nay?',
      sender: 'AI',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "Chi phí khám bệnh",
    "Đau đầu, chóng mặt",
    "Lịch làm việc"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      text: textToSend.trim(),
      sender: 'USER',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiReply = await chatbotApi.sendMessage(userMsg.text);
      setMessages(prev => [...prev, aiReply]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      
      {/* CHAT WINDOW  */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className="w-[350px] sm:w-[380px] h-[520px] bg-white flex flex-col shadow-2xl shadow-primary-500/20 rounded-3xl border border-border-default overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header với avatar AI và nút X duy nhất */}
          <div className="bg-primary-500 p-4 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <img 
                src={aiAvatar} 
                alt="AI Assistant" 
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <h3 className="text-white text-[16px] font-black m-0">Trợ lý Y tế AI</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white hover:bg-primary-600 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: danh sách tin nhắn */}
          <div className="flex-1 bg-background-light p-4 overflow-y-auto flex flex-col" ref={scrollRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex w-full ${msg.sender === 'AI' ? 'justify-start' : 'justify-end'} mb-4`}>
                <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'AI' ? 'flex-row' : 'flex-row-reverse'}`}>
                  
                  {/* Avatar: AI dùng ảnh, User dùng icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${
                    msg.sender === 'AI' ? 'bg-white' : 'bg-brand-dark text-white'
                  }`}>
                    {msg.sender === 'AI' ? (
                      <img src={aiAvatar} alt="AI" className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-3 rounded-2xl text-[14.5px] font-medium leading-relaxed shadow-sm ${
                    msg.sender === 'AI' 
                      ? 'bg-white border border-border-default text-brand-dark rounded-tl-sm' 
                      : 'bg-primary-500 text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex w-full justify-start mb-4">
                <div className="flex gap-2 flex-row">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-primary-50">
                    <img src={aiAvatar} alt="AI" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-border-default text-primary-500 text-[13px] rounded-tl-sm flex items-center gap-1.5">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer: Quick Replies + Input */}
          <div className="bg-white border-t border-border-default flex flex-col shrink-0">
            <div className="flex overflow-x-auto gap-2 p-3 pb-0 [&::-webkit-scrollbar]:hidden">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(reply)}
                  disabled={isTyping}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full border border-primary-500/30 text-primary-600 bg-primary-50 hover:bg-primary-500 hover:text-white text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reply}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmitForm} className="flex items-center gap-2 p-3">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Hỏi AI về y tế..." 
                className="flex-1 bg-background-light border border-border-default rounded-full px-4 h-11 text-[14.5px] font-medium text-brand-dark outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
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
        </div>
      )}

      {/* Nút toggle  */}
      {!isOpen && (
          <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full overflow-hidden shadow-xl shadow-primary-500/30 hover:scale-105 transition-transform cursor-pointer focus:outline-none"
          >
          <img 
               src={aiAvatar} 
               alt="AI Assistant" 
               className="w-full h-full object-cover"
          />
          </button>
          )}
    </div>
  );
};