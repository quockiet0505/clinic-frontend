import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RoleFormDialog({ role, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ roleName: '', roleCode: '' });

  useEffect(() => {
    if (role) {
      setFormData({
        roleName: role.roleName || '',
        roleCode: role.roleCode || ''
      });
    }
  }, [role]);

  if (!role) return null;

  return (
    <Dialog open={!!role} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        {/* Header xanh đặc trưng */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Shield size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Access Control</span>
          </div>
          <DialogTitle className="text-xl font-black">
            {role.roleId === 0 ? 'Create New Role' : 'Edit Role Settings'}
          </DialogTitle>
          <DialogDescription className="text-blue-100">
            Configure system access levels and unique role identification codes.
          </DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Role Name</label>
            <Input 
              value={formData.roleName} 
              onChange={(e) => setFormData({...formData, roleName: e.target.value})} 
              className="h-11 rounded-xl border-slate-200 bg-white font-bold" 
              placeholder="e.g. Senior Doctor"
            />
          </div>
          <div className="space-y-2">
            <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Role Code (Uppercase)</label>
            <Input 
              value={formData.roleCode} 
              onChange={(e) => setFormData({...formData, roleCode: e.target.value.toUpperCase()})} 
              className="h-11 rounded-xl border-slate-200 bg-white font-black text-blue-600" 
              placeholder="E.G. SR_DOCTOR"
              disabled={role.roleId !== 0} // Không cho sửa code nếu đã tạo
            />
          </div>
        </div>
        
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500 cursor-pointer">Hủy</Button>
          <Button 
            onClick={() => onSave(role.roleId, formData)} 
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-6 shadow-sm"
          >
            Save Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}