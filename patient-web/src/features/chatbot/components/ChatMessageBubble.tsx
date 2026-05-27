import React, { useEffect } from 'react';
import { User, Bot } from 'lucide-react';
import type { ChatMessage } from '../types/chatbot';

// Import ảnh với nhiều cách
import aiAvatarDefault from '@/assets/images/ai-avatar.png';
import aiAvatarUrl from '@/assets/images/ai-avatar.png?url';

// Kiểm tra log ngay khi import
console.log('=== ChatMessageBubble module loaded ===');
console.log('Default import:', aiAvatarDefault);
console.log('Url import:', aiAvatarUrl);


// Chọn src ưu tiên
const aiAvatarSrc = (typeof aiAvatarDefault === 'string' && aiAvatarDefault.startsWith('/')) 
  ? aiAvatarDefault 
  : (aiAvatarUrl || '/src/assets/images/ai-avatar.png');

export const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isAI = message.sender === 'AI';

  useEffect(() => {
    console.log('ChatMessageBubble rendered for:', message.sender, message.text.substring(0, 30));
  }, [message]);

  return (
    <div className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-[85%] gap-2 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar Area */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${
          isAI 
            ? 'border-2 border-primary-50 bg-white' 
            : 'bg-brand-dark text-white'
        }`}>
          {isAI ? (
            <img 
              src={aiAvatarSrc}
              alt="AI Assistant" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error:', aiAvatarSrc);
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const icon = parent.querySelector('.bot-fallback') as HTMLElement;
                  if (icon) icon.style.display = 'flex';
                }
              }}
              onLoad={() => console.log('Image loaded successfully:', aiAvatarSrc)}
            />
          ) : (
            <User className="w-5 h-5" />
          )}
          {isAI && (
            <div className="bot-fallback hidden w-full h-full bg-primary-500 items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`p-3 rounded-2xl text-[14.5px] font-medium leading-relaxed shadow-sm ${
          isAI 
            ? 'bg-white border border-border-default text-brand-dark rounded-tl-sm' 
            : 'bg-primary-500 text-white rounded-tr-sm'
        }`}>
          {message.text}
        </div>
      </div>
    </div>
  );
};