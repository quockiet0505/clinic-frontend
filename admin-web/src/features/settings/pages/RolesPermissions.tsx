// features/settings/pages/RolesPermissions.tsx
import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import GradientButton from '@/components/common/GradientButton';
import { Plus } from 'lucide-react';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { RolesPermissionsFilterBar } from '../components/RolesPermissionsFilterBar';
import RoleFormDialog from '../components/RoleFormDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';
import { Role } from '../types/settings';
import { settingsApi } from '../api/settingsApi';

const roleColorMap: Record<string, { iconBg: string; iconColor: string; codeBg: string; codeText: string }> = {
  ADMIN: { iconBg: 'bg-rose-50', iconColor: 'text-rose-600', codeBg: 'bg-rose-50', codeText: 'text-rose-700 border-rose-200' },
  DOCTOR: { iconBg: 'bg-blue-50', iconColor: 'text-blue-600', codeBg: 'bg-blue-50', codeText: 'text-blue-700 border-blue-200' },
  STAFF: { iconBg: 'bg-slate-100', iconColor: 'text-slate-600', codeBg: 'bg-slate-100', codeText: 'text-slate-700 border-slate-200' },
  LAB_TECH: { iconBg: 'bg-purple-50', iconColor: 'text-purple-600', codeBg: 'bg-purple-50', codeText: 'text-purple-700 border-purple-200' },
  PATIENT: { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', codeBg: 'bg-emerald-50', codeText: 'text-emerald-700 border-emerald-200' },
};

const roleNameMap: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  DOCTOR: 'Bác sĩ',
  STAFF: 'Nhân viên',
  LAB_TECH: 'Kỹ thuật viên xét nghiệm',
  PATIENT: 'Bệnh nhân',
};

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await settingsApi.getRoles();
      if (Array.isArray(data) && data.length > 0) {
        setRoles(data);
      } else {
        setRoles([
          { roleId: 1, roleCode: 'ADMIN', roleName: 'Quản trị viên' },
          { roleId: 2, roleCode: 'DOCTOR', roleName: 'Bác sĩ' },
          { roleId: 3, roleCode: 'STAFF', roleName: 'Nhân viên' },
          { roleId: 4, roleCode: 'LAB_TECH', roleName: 'Kỹ thuật viên xét nghiệm' },
          { roleId: 5, roleCode: 'PATIENT', roleName: 'Bệnh nhân' },
        ]);
      }
    } catch (e) {
      setRoles([
        { roleId: 1, roleCode: 'ADMIN', roleName: 'Quản trị viên' },
        { roleId: 2, roleCode: 'DOCTOR', roleName: 'Bác sĩ' },
        { roleId: 3, roleCode: 'STAFF', roleName: 'Nhân viên' },
        { roleId: 4, roleCode: 'LAB_TECH', roleName: 'Kỹ thuật viên xét nghiệm' },
        { roleId: 5, roleCode: 'PATIENT', roleName: 'Bệnh nhân' },
      ]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const getDisplayName = (role: Role) => {
    if (role.roleName && (role.roleName === 'Quản trị viên' || role.roleName === 'Bác sĩ' || role.roleName === 'Nhân viên' || role.roleName === 'Kỹ thuật viên xét nghiệm' || role.roleName === 'Bệnh nhân')) {
      return role.roleName;
    }
    return roleNameMap[role.roleCode] || role.roleName || role.roleCode;
  };

  const filteredRoles = roles.filter(role =>
    getDisplayName(role).toLowerCase().includes(search.toLowerCase()) ||
    role.roleCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader
          title="Phân quyền"
          description="Quản lý mức độ truy cập và mã vai trò của người dùng trên hệ thống."
        />
        <GradientButton onClick={() => setEditingRole({ roleId: 0, roleCode: '', roleName: '' })}>
          <Plus size={18} className="mr-2" /> Tạo vai trò mới
        </GradientButton>
      </div>

      <RolesPermissionsFilterBar search={search} onSearchChange={setSearch} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
          <Table className="min-w-[650px]">
            <TableHeader className="bg-slate-100 sticky top-0 z-10">
              <TableRow>
                <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[35%] text-sm">Tên vai trò</TableHead>
                <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%] text-sm">Mã vai trò</TableHead>
                <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%] text-sm">Số người dùng</TableHead>
                <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%] text-sm">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => {
                const colors = roleColorMap[role.roleCode] || roleColorMap.STAFF;
                return (
                  <TableRow key={role.roleId} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${colors.iconBg} ${colors.iconColor} flex items-center justify-center`}>
                          <ShieldCheck size={16} />
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">{getDisplayName(role)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <code className={`text-xs px-2 py-1 rounded-md border font-medium ${colors.codeBg} ${colors.codeText}`}>
                        {role.roleCode}
                      </code>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-slate-500">—</TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex gap-2">
                        <EditButton onClick={() => setEditingRole(role)} />
                        <DeleteButton onClick={() => setDeletingRole(role)} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredRoles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400 text-sm font-medium">
                    Không có vai trò nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

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

      <ConfirmDialog
        isOpen={!!deletingRole}
        title="Xóa vai trò"
        description={`Bạn có chắc chắn muốn xóa vai trò "${deletingRole?.roleName}"? Người dùng thuộc vai trò này sẽ mất quyền truy cập.`}
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