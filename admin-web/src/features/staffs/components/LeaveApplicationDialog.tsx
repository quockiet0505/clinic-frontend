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
    leaveType: 'ANNUAL',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ leaveType: 'ANNUAL', fromDate: new Date().toISOString().split('T')[0], toDate: new Date().toISOString().split('T')[0], reason: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <CalendarDays size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Nghỉ Phép</span>
          </div>
          <DialogTitle className="text-xl font-black">Nộp Đơn Xin Nghỉ</DialogTitle>
          <DialogDescription className="text-blue-100">Điền thông tin chi tiết cho đơn xin nghỉ của bạn.</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-6">
          <div>
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Loại Nghỉ Phép</label>
            <select 
              value={formData.leaveType} 
              onChange={(e) => setFormData({...formData, leaveType: e.target.value})} 
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold outline-none cursor-pointer"
            >
              <option value="ANNUAL">Nghỉ phép năm</option>
              <option value="SICK">Nghỉ ốm</option>
              <option value="UNPAID">Nghỉ không lương</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Từ ngày</label>
              <Input type="date" value={formData.fromDate} onChange={(e) => setFormData({...formData, fromDate: e.target.value})} className="h-11 rounded-xl bg-white font-medium text-slate-700 cursor-pointer" />
            </div>
            <div>
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Đến ngày</label>
              <Input type="date" min={formData.fromDate} value={formData.toDate} onChange={(e) => setFormData({...formData, toDate: e.target.value})} className="h-11 rounded-xl bg-white font-medium text-slate-700 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Lý do</label>
            <textarea 
              value={formData.reason} 
              onChange={(e) => setFormData({...formData, reason: e.target.value})} 
              className="flex w-full rounded-xl border border-slate-200 bg-white p-3 font-medium outline-none resize-none h-24"
              placeholder="Giải thích ngắn gọn lý do xin nghỉ..."
            />
          </div>
        </div>
        
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="outline" className="border-[#DCE3EC] bg-white text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-bold cursor-pointer transition-all"  onClick={onClose} >Hủy</Button>
          <Button onClick={handleSubmit} disabled={!formData.reason} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-6 cursor-pointer">Gửi Đơn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}