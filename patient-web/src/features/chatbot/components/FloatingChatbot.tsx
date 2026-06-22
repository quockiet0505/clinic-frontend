/* eslint-disable react-hooks/purity */
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { chatbotApi } from '../api/chatbotApi';
import type { ChatMessage } from '../types/chatbot';
import aiAvatar from '@/assets/images/ai-avatar.png';

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là Trợ lý Y tế AI của ClinicPro. Tôi có thể giúp gì cho bạn hôm nay?',
      sender: 'AI',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "Lịch làm việc",
    "Đặt lịch khám",
    "Chi phí khám"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          text: 'Không thể kết nối tới trợ lý AI. Vui lòng kiểm tra AI service (port 8000) và thử lại.',
          sender: 'AI',
          timestamp: new Date(),
        },
      ]);
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
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className="w-[350px] sm:w-[380px] h-[550px] flex flex-col rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-300 border border-white/20 bg-white/80 backdrop-blur-xl"
        >
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 flex items-center justify-between shadow-md z-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 blur-xl rounded-full transform -translate-y-1/2"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <img 
                  src={aiAvatar} 
                  alt="AI Assistant" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary-500 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-white text-[16px] font-bold m-0 leading-tight">Trợ lý Y tế AI</h3>
                <span className="text-white/80 text-[12px] font-medium">Trực tuyến</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer relative z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4" ref={scrollRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex w-full ${msg.sender === 'AI' ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'AI' ? 'flex-row' : 'flex-row-reverse'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${
                    msg.sender === 'AI' ? 'bg-white' : 'bg-primary-100 text-primary-600'
                  }`}>
                    {msg.sender === 'AI' ? (
                      <img src={aiAvatar} alt="AI" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-3.5 rounded-2xl text-[14.5px] font-medium leading-relaxed shadow-sm ${
                    msg.sender === 'AI' 
                      ? 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm' 
                      : 'bg-primary-500 text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="flex gap-2 flex-row">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white shadow-sm">
                    <img src={aiAvatar} alt="AI" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-2">
            <div className="flex overflow-x-auto gap-2 pb-2 [&::-webkit-scrollbar]:hidden">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(reply)}
                  disabled={isTyping}
                  className="whitespace-nowrap px-4 py-2 rounded-full border border-primary-100 bg-white hover:bg-primary-50 text-primary-600 text-[13px] font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={onSubmitForm} className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-full flex items-center px-4 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all shadow-inner">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Hỏi AI về y tế..." 
                  className="flex-1 bg-transparent h-12 text-[14.5px] font-medium text-slate-800 outline-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isTyping}
                className="w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white rounded-full flex items-center justify-center shrink-0 transition-colors shadow-md cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full overflow-hidden shadow-[0_10px_25px_rgba(14,165,233,0.4)] hover:scale-105 hover:shadow-[0_15px_35px_rgba(14,165,233,0.5)] transition-all duration-300 cursor-pointer focus:outline-none border-4 border-white relative group"
        >
          <img 
            src={aiAvatar} 
            alt="AI Assistant" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-500/10 group-hover:bg-transparent transition-colors"></div>
        </button>
      )}
    </div>
  );
};