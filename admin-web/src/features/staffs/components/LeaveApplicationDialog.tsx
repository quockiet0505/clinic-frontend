import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function LeaveApplicationDialog({ isOpen, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    leave_type: 'ANNUAL',
    from_date: new Date().toISOString().split('T')[0],
    to_date: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ leave_type: 'ANNUAL', from_date: new Date().toISOString().split('T')[0], to_date: new Date().toISOString().split('T')[0], reason: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <CalendarDays size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Time Off</span>
          </div>
          <DialogTitle className="text-xl font-black">Submit Leave Request</DialogTitle>
          <DialogDescription className="text-blue-100">Provide details for your absence request.</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Leave Type</label>
            <select 
              value={formData.leave_type} 
              onChange={(e) => setFormData({...formData, leave_type: e.target.value})} 
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="ANNUAL">Annual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">From Date</label>
              <Input type="date" value={formData.from_date} onChange={(e) => setFormData({...formData, from_date: e.target.value})} className="h-11 rounded-xl bg-white font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">To Date</label>
              <Input type="date" min={formData.from_date} value={formData.to_date} onChange={(e) => setFormData({...formData, to_date: e.target.value})} className="h-11 rounded-xl bg-white font-medium" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reason</label>
            <textarea 
              value={formData.reason} 
              onChange={(e) => setFormData({...formData, reason: e.target.value})} 
              className="flex w-full rounded-xl border border-slate-200 bg-white p-3 font-medium focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24"
              placeholder="Briefly explain the reason for your leave..."
            />
          </div>
        </div>
        
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button onClick={handleSubmit} disabled={!formData.reason} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-6 shadow-sm">Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}