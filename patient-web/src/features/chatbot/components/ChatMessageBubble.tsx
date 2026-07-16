import React from 'react';
import { User, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ChatMessage } from '../types/chatbot';

// Import ảnh với nhiều cách
import aiAvatarDefault from '@/assets/images/ai-avatar.png';
import aiAvatarUrl from '@/assets/images/ai-avatar.png?url';

// Chọn src ưu tiên
const aiAvatarSrc = (typeof aiAvatarDefault === 'string' && aiAvatarDefault.startsWith('/'))
  ? aiAvatarDefault
  : (aiAvatarUrl || '/src/assets/images/ai-avatar.png');

export const ChatMessageBubble: React.FC<{ message: ChatMessage, onQuickReply?: (text: string) => void }> = ({ message, onQuickReply }) => {
  const isAI = message.sender === 'AI';

  const formatMessage = (text: string) => {
    let formatted = text.replace(/\*\*/g, '');
    formatted = formatted.replace(/([a-zA-ZÀ-ỹ0-9.:])\s*-\s+([A-ZÀ-Ỹ])/g, '$1\n- $2');
    formatted = formatted.replace(/\n(?:\s*\n)+/g, '\n');
    return formatted;
  };

  const rawText = message.text;

  // Extract buttons từ rawText TRƯỚC khi formatMessage (tránh regex bị cản)
  const buttons: string[] = [];
  const buttonRegex = /__BUTTON:([\s\S]*?)__/g;
  let match;
  while ((match = buttonRegex.exec(rawText)) !== null) {
    buttons.push(match[1].trim());
  }

  // Format text sau khi đã bỏ button markers
  const finalDisplayText = isAI
    ? formatMessage(rawText.replace(/__BUTTON:([\s\S]*?)__/g, '').trim())
    : rawText;

  // Debug logs - xóa sau khi xác nhận hoạt động
  console.log("TEXT =", JSON.stringify(rawText));
  console.log("BUTTONS =", buttons);

  // Xử lý markdown link: [text](url)
  const renderLineWithLinks = (line: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      parts.push(line.substring(lastIndex, match.index));
      parts.push(
        <Link key={match.index} to={match[2]} className="text-primary-600 font-bold underline hover:text-primary-700">
          {match[1]}
        </Link>
      );
      lastIndex = match.index + match[0].length;
    }
    parts.push(line.substring(lastIndex));
    return parts;
  };

  if (!message.text) return null;

  return (
    <div className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-[85%] gap-2 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden self-start ${isAI
          ? 'border-2 border-primary-50 bg-white'
          : 'bg-brand-dark text-white'
          }`}>
          {isAI ? (
            <img
              src={aiAvatarSrc}
              alt="AI Assistant"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const icon = parent.querySelector('.bot-fallback') as HTMLElement;
                  if (icon) icon.style.display = 'flex';
                }
              }}
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

        {/* Bubble + Buttons stacked */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className={`p-3 rounded-2xl text-[14px] font-medium leading-relaxed shadow-sm whitespace-pre-wrap break-words ${isAI
            ? 'bg-white border border-border-default text-brand-dark rounded-tl-sm'
            : 'bg-primary-500 text-white rounded-tr-sm'
            }`}>
            {finalDisplayText.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {renderLineWithLinks(line)}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* Quick Reply Buttons - hiện ngay dưới bubble */}
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {buttons.map((btnText, idx) => (
                <button
                  key={idx}
                  onClick={() => onQuickReply?.(btnText)}
                  className="px-4 py-2 bg-white text-primary-600 hover:bg-primary-50 border-2 border-primary-300 hover:border-primary-500 text-[13px] font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95"
                >
                  {btnText}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};