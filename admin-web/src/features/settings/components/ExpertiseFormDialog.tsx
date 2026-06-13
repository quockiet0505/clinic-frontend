import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ExpertiseFormDialog({ expertise, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });

  useEffect(() => {
    if (expertise) {
      setFormData({
        name: expertise.expertiseName || '',
        description: expertise.description || '',
        status: expertise.status || 'Active'
      });
    }
  }, [expertise]);

  if (!expertise) return null;

  return (
    <Dialog open={!!expertise} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Award size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Department Data</span>
          </div>
          <DialogTitle className="text-xl font-black">{expertise.expertiseId === 0 ? 'Add Specialty' : 'Edit Specialty'}</DialogTitle>
          <DialogDescription className="text-blue-100">Configure department details and operational status.</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Specialty Name</label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-11 rounded-xl border-slate-200 bg-white font-bold" />
          </div>
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Mô tả</label>
            <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="h-11 rounded-xl border-slate-200 bg-white" />
          </div>
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái</label>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-medium outline-none">
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Ngưng hoạt động</option>
            </select>
          </div>
        </div>
        
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500 cursor-pointer">Hủy</Button>
          <Button onClick={() => onSave(expertise.expertiseId, formData)} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-6 shadow-sm">Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}