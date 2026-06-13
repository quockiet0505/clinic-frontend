import React, { useState } from 'react';
import { Edit, Trash2, ShieldCheck, Lock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import RoleFormDialog from '../components/RoleFormDialog';
import { Button } from '@/components/ui/button';
import { Role } from '../types/settings';

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([
    { roleId: 1, roleCode: 'ADMIN', roleName: 'System Administrator' },
    { roleId: 2, roleCode: 'DOCTOR', roleName: 'Medical Specialist' },
  ]);

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader 
        title="Roles & Permissions" 
        description="Manage system access levels and user role codes (role table)." 
        actionText="Create New Role"
        onAction={() => setEditingRole({ roleId: 0, roleCode: '', roleName: '' })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.roleId} className="group bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-all relative">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-900 tracking-tight">{role.roleName}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">CODE: {role.roleCode}</p>
            </div>
            
            {/* Nút thao tác hiện khi hover */}
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button onClick={() => setEditingRole(role)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50">
                <Edit size={14} />
              </Button>
              <Button onClick={() => setDeletingRole(role)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50">
                <Trash2 size={14} />
              </Button>
            </div>
            
            <Lock size={14} className="absolute top-4 right-4 text-slate-200 group-hover:hidden" />
          </div>
        ))}
      </div>

      {/* Dialog Thêm/Sửa */}
      <RoleFormDialog 
        role={editingRole} 
        onClose={() => setEditingRole(null)} 
        onSave={(id: number, data: any) => {
          console.log("Saving Role:", id, data);
          setEditingRole(null);
        }} 
      />

      {/* Dialog Xóa từ Common */}
      <ConfirmDialog 
        isOpen={!!deletingRole}
        title="Delete Access Role"
        description={`Are you sure you want to permanently delete the "${deletingRole?.roleName}" role? Users assigned to this role may lose access.`}
        confirmText="Yes, Delete Role"
        onClose={() => setDeletingRole(null)}
        onConfirm={() => {
          setRoles(roles.filter(r => r.roleId !== deletingRole?.roleId));
          setDeletingRole(null);
        }}
      />
    </div>
  );
}