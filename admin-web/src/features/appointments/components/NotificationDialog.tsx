import React, { useState } from 'react';
import { BellRing } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function NotificationDialog({ patient, onClose, onSend }: any) {
  const [type, setType] = useState('SYSTEM');
  const [content, setContent] = useState('');

  if (!patient) return null;

  return (
    <Dialog open={!!patient} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        <div className="bg-amber-500 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <BellRing size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Gửi Thông báo</span>
          </div>
          <DialogTitle className="text-xl font-black">Remind {patient.patientName}</DialogTitle>
          <DialogDescription className="text-amber-100">This will create a record in the system notification table.</DialogDescription>
        </div>
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Notification Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold outline-none">
              <option value="SYSTEM">System App Alert</option>
              <option value="EMAIL">Email Notification</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Message Content</label>
            <textarea 
              value={content} onChange={(e) => setContent(e.target.value)} 
              className="flex w-full rounded-xl border border-slate-200 bg-white p-3 font-medium outline-none resize-none h-24"
              placeholder="e.g. Friendly reminder: You are due for a post-surgery checkup..."
            />
          </div>
        </div>
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500 cursor-pointer">Hủy</Button>
          <Button onClick={() => onSend(type, content)} disabled={!content.trim()} className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 shadow-sm">Send Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}