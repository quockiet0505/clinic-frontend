import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ChatSessionTable from '../components/ChatSessionTable';
import ChatHistoryModal from '../components/ChatHistoryModal';
import { ChatSession } from '../types/crm';

const TODAY = new Date().toISOString().split('T')[0];

export default function AiChatLogs() {
  const [sessions] = useState<ChatSession[]>([
    { session_id: 1, patient_name: 'Liam Anderson', started_at: `${TODAY} 14:00`, ended_at: `${TODAY} 14:15`, message_count: 4, messages: [
      { message_id: 1, session_id: 1, sender_type: 'USER', message_content: 'How do I book an appointment?', created_at: `${TODAY} 14:01` },
      { message_id: 2, session_id: 1, sender_type: 'BOT', message_content: 'You can book an appointment through our Patient Portal or by calling the front desk.', created_at: `${TODAY} 14:01` }
    ]},
  ]);
  
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  const filtered = sessions.filter(s => (s.patient_name || 'Guest').toLowerCase().includes(search.toLowerCase()) || s.session_id.toString().includes(search));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="AI Chatbot Logs" description="Review automated conversational support provided to patients." />
      
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex shadow-sm shrink-0 w-full sm:w-[400px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search user or session ID..." />
      </div>

      <ChatSessionTable data={filtered} onView={setSelectedSession} />
      <ChatHistoryModal session={selectedSession} onClose={() => setSelectedSession(null)} />
    </div>
  );
}