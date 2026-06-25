// features/settings/pages/RolesPermissions.tsx
import React, { useState } from 'react';
import { ShieldCheck, Users, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import GradientButton from '@/components/common/GradientButton';
import { StatsCard } from '@/components/common/StatsCard';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { RolesPermissionsFilterBar } from '../components/RolesPermissionsFilterBar';
import RoleFormDialog from '../components/RoleFormDialog';
import SharedTable from '@/components/tables/Table';
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
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getRolesPaged({
        search: search || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'roleName',
        sortDir: 'ASC',
      });
      setRoles(res.content);
      setTotalElements(res.totalElements);
    } catch (e) {
      console.error(e);
      setRoles([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, currentPage]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const getDisplayName = (role: Role) => {
    if (role.roleName && (role.roleName === 'Quản trị viên' || role.roleName === 'Bác sĩ' || role.roleName === 'Nhân viên' || role.roleName === 'Kỹ thuật viên xét nghiệm' || role.roleName === 'Bệnh nhân')) {
      return role.roleName;
    }
    return roleNameMap[role.roleCode] || role.roleName || role.roleCode;
  };

  const filteredRoles = roles;

  const totalRoles = totalElements;
  const totalUsers = 0; // TODO: Lấy từ API khi có

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      {/* Header + Stats + Action Button cùng hàng */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader
          title="Phân quyền"
          description="Quản lý mức độ truy cập và mã vai trò của người dùng trên hệ thống."
        />
        <div className="flex items-center gap-3">
          <StatsCard
            icon={<ShieldCheck size={16} />}
            label="Tổng vai trò"
            value={totalRoles}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            className="shrink-0"
          />
          <StatsCard
            icon={<Users size={16} />}
            label="Tổng người dùng"
            value={totalUsers || '-'}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            className="shrink-0"
          />
          <GradientButton onClick={() => setEditingRole({ roleId: 0, roleCode: '', roleName: '' })} className="shrink-0">
            <Plus size={18} className="mr-2" /> Tạo vai trò mới
          </GradientButton>
        </div>
      </div>

      <RolesPermissionsFilterBar search={search} onSearchChange={setSearch} />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SharedTable
          data={filteredRoles}
          loading={loading}
          emptyMessage="Không có vai trò nào phù hợp."
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
          columns={[
            {
              key: 'roleName',
              label: 'Tên vai trò',
              className: 'w-[35%]',
              render: (role: Role) => {
                const colors = roleColorMap[role.roleCode] || roleColorMap.STAFF;
                return (
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${colors.iconBg} ${colors.iconColor} flex items-center justify-center`}>
                      <ShieldCheck size={16} />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">{getDisplayName(role)}</span>
                  </div>
                );
              },
            },
            {
              key: 'roleCode',
              label: 'Mã vai trò',
              className: 'w-[25%]',
              render: (role: Role) => {
                const colors = roleColorMap[role.roleCode] || roleColorMap.STAFF;
                return (
                  <code className={`text-xs px-2 py-1 rounded-md border font-medium ${colors.codeBg} ${colors.codeText}`}>
                    {role.roleCode}
                  </code>
                );
              },
            },
            {
              key: 'users',
              label: 'Số người dùng',
              className: 'w-[20%]',
              render: () => <span className="text-sm text-slate-500">—</span>,
            },
            {
              key: 'actions',
              label: 'Thao tác',
              className: 'w-[20%]',
              render: (role: Role) => (
                <div className="flex gap-2">
                  <EditButton onClick={() => setEditingRole(role)} />
                  <DeleteButton onClick={() => setDeletingRole(role)} />
                </div>
              ),
            },
          ]}
          rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
        />
      </div>

      <RoleFormDialog
        role={editingRole}
        onClose={() => setEditingRole(null)}
        onSave={async (id: number, data: any) => {
          try {
            if (id === 0) {
              await settingsApi.createRole(data);
            } else {
              await settingsApi.updateRole(id, data);
            }
            await fetchData();
            setEditingRole(null);
          } catch {
            /* toast: axios interceptor */
          }
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
            try {
              await settingsApi.deleteRole(deletingRole.roleId);
              await fetchData();
            } catch {
              /* toast: axios interceptor */
            }
          }
          setDeletingRole(null);
        }}
      />
    </div>
  );
}