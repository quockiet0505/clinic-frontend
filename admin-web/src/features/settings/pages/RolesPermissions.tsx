import React, { useState } from 'react';
import { Edit, Trash2, ShieldCheck, Lock } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import RoleFormDialog from '../components/RoleFormDialog';
import { Button } from '@/components/ui/button';
import { Role } from '../types/settings';
import { settingsApi } from '../api/settingsApi';

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await settingsApi.getRoles();
      if (data && data.length > 0) {
        setRoles(data);
      } else {
        setRoles([
          { roleId: 1, roleCode: 'ADMIN', roleName: 'Quản trị hệ thống' },
          { roleId: 2, roleCode: 'DOCTOR', roleName: 'Bác sĩ chuyên khoa' },
        ]);
      }
    } catch (e) {
      setRoles([
        { roleId: 1, roleCode: 'ADMIN', roleName: 'Quản trị hệ thống' },
        { roleId: 2, roleCode: 'DOCTOR', roleName: 'Bác sĩ chuyên khoa' },
      ]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <PageHeader
        title="Phân quyền"
        description="Quản lý mức độ truy cập và mã vai trò của người dùng trên hệ thống."
        actionText="Tạo Vai trò mới"
        onAction={() => setEditingRole({ roleId: 0, roleCode: '', roleName: '' })}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải dữ liệu phân quyền...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.roleId} className="group bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-all relative">
              <div className="w-14 h-14 rounded-[16px] bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 tracking-tight">{role.roleName}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">MÃ: {role.roleCode}</p>
              </div>

              {/* Nút thao tác hiện khi hover */}
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button onClick={() => setEditingRole(role)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-[10px] text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                    <Edit size={14} />
                  </Button>
                  <Button onClick={() => setDeletingRole(role)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-[10px] text-red-600 border border-transparent hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer">
                    <Trash2 size={14} />
                  </Button>
              </div>

              <Lock size={14} className="absolute top-4 right-4 text-slate-200 group-hover:hidden" />
            </div>
          ))}
        </div>
      )}

      {/* Dialog Thêm/Sửa */}
      <RoleFormDialog
        role={editingRole}
        onClose={() => setEditingRole(null)}
        onSave={async (id: number, data: any) => {
          if (id === 0) {
            await settingsApi.createRole(data);
          } else {
            await settingsApi.updateRole(id, data);
          }
          await fetchData();
          setEditingRole(null);
        }}
      />

      {/* Dialog Xóa từ Common */}
      <ConfirmDialog
        isOpen={!!deletingRole}
        title="Xóa Vai trò"
        description={`Bạn có chắc chắn muốn xóa vĩnh viễn vai trò "${deletingRole?.roleName}"? Người dùng thuộc vai trò này có thể sẽ bị mất quyền truy cập.`}
        confirmText="Xác nhận xóa"
        onClose={() => setDeletingRole(null)}
        onConfirm={async () => {
          if (deletingRole) {
            await settingsApi.deleteRole(deletingRole.roleId);
            await fetchData();
          }
          setDeletingRole(null);
        }}
      />
    </div>
  );
}