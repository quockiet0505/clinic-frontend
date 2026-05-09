import React from 'react';
import { Bot, User, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ChatHistoryModal({ session, onClose }: any) {
  if (!session) return null;

  return (
    <Dialog open={!!session} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl bg-slate-50">
        
        <div className="bg-blue-600 p-6 flex justify-between items-start">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Bot size={16} /> <span className="text-xs font-bold uppercase tracking-widest">AI Support Log</span>
            </div>
            <DialogTitle className="text-xl font-black">Session #{session.session_id}</DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">
              User: <span className="font-bold text-white">{session.patient_name || 'Guest'}</span>
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 text-white hover:bg-blue-700"><X size={20}/></Button>
        </div>
        
        <div className="p-6 space-y-4 h-[50vh] overflow-y-auto custom-scrollbar flex flex-col">
          {session.messages?.map((msg: any) => {
            const isBot = msg.sender_type === 'BOT';
            return (
              <div key={msg.message_id} className={`flex gap-3 max-w-[85%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                  {isBot ? <Bot size={16}/> : <User size={16}/>}
                </div>
                <div>
                  <div className={`p-4 rounded-2xl text-sm font-medium ${isBot ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm' : 'bg-blue-600 text-white rounded-tr-sm'}`}>
                    {msg.message_content}
                  </div>
                  <p className={`text-[10px] font-bold text-slate-400 mt-1 ${isBot ? 'text-left' : 'text-right'}`}>
                    {msg.created_at.split(' ')[1]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </DialogContent>
    </Dialog>
  );
}