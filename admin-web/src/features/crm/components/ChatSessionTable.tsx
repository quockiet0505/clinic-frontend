import React from 'react';
import { Bot, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChatSession } from '../types/crm';

export default function ChatSessionTable({ data, onView }: { data: ChatSession[], onView: (s: ChatSession) => void }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Session ID</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">User</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Duration</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Messages</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(session => (
            <TableRow key={session.session_id} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Bot size={18}/></div>
                  <div>
                    <p className="font-bold text-slate-900">SESS-{session.session_id}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{session.started_at.split(' ')[0]}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell><span className="font-bold text-slate-800">{session.patient_name || 'Anonymous Guest'}</span></TableCell>
              <TableCell>
                <p className="text-xs font-bold text-slate-600">Start: {session.started_at.split(' ')[1]}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">End: {session.ended_at ? session.ended_at.split(' ')[1] : 'Ongoing'}</p>
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">
                  <MessageCircle size={14} /> {session.message_count}
                </span>
              </TableCell>
              <TableCell className="text-right pr-8">
                <Button onClick={() => onView(session)} variant="outline" size="sm" className="h-9 font-bold rounded-xl px-4 text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Eye size={14} className="mr-1.5"/> Read Log
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}