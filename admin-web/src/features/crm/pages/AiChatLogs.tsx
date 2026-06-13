import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ChatSessionTable from '../components/ChatSessionTable';
import ChatHistoryModal from '../components/ChatHistoryModal';
import { ChatSession } from '../types/crm';

const TODAY = new Date().toISOString().split('T')[0];

export default function AiChatLogs() {
  const [sessions] = useState<ChatSession[]>([
    { sessionId: 1, patientName: 'Liam Anderson', startedAt: `${TODAY} 14:00`, endedAt: `${TODAY} 14:15`, messageCount: 4, messages: [
      { messageId: 1, sessionId: 1, senderType: 'USER', messageContent: 'How do I book an appointment?', createdAt: `${TODAY} 14:01` },
      { messageId: 2, sessionId: 1, senderType: 'BOT', messageContent: 'You can book an appointment through our Patient Portal or by calling the front desk.', createdAt: `${TODAY} 14:01` }
    ]},
  ]);
  
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  const filtered = sessions.filter(s => (s.patientName || 'Guest').toLowerCase().includes(search.toLowerCase()) || s.sessionId.toString().includes(search));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="AI Chatbot Logs" description="Review automated conversational support provided to patients." />
      
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex shadow-sm shrink-0 w-full sm:w-[400px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm user or session ID..." />
      </div>

      <ChatSessionTable data={filtered} onView={setSelectedSession} />
      <ChatHistoryModal session={selectedSession} onClose={() => setSelectedSession(null)} />
    </div>
  );
}