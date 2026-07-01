// features/dashboard/components/tabs/StaffTab.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Users, Stethoscope, ShieldCheck, TestTube, Briefcase, Mail, Phone } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import Table, { Column } from '@/components/tables/Table';
import EntityAvatar from '@/components/common/EntityAvatar';
import DetailModal from '../common/DetailModal';
import { Staff } from '@/features/staffs/types/staff';
import { isStaffActive } from '@/features/staffs/utils/staffUtils';
import { RoleDisplay } from '@/features/staffs/utils/roleDisplay';
import { staffApi } from '@/features/staffs/api/staffApi';

type FilterType = 'ALL' | 'DOCTOR' | 'STAFF' | 'LAB_TECH' | 'ADMIN';

interface Props {
  searchTerm?: string;
}

export default function StaffTab({ searchTerm = '' }: Props) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Staff[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;

  const fetchData = useCallback(async () => {
    try {
      const res = await staffApi.getAllPaged({
        search: searchTerm || undefined,
        staffType: filterType === 'ALL' ? undefined : filterType,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'fullName',
        sortDir: 'ASC',
      });
      setData(res.content);
      setTotalElements(res.totalElements);
    } catch {
      // giữ dữ liệu cũ
    }
  }, [searchTerm, filterType, currentPage]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterType]);

  const stats = {
    total: filterType === 'ALL' ? totalElements : totalElements,
    doctors: data.filter((s) => s.staffType === 'DOCTOR').length,
    staffs: data.filter((s) => s.staffType === 'STAFF').length,
    labTech: data.filter((s) => s.staffType === 'LAB_TECH').length,
    admins: data.filter((s) => s.staffType === 'ADMIN').length,
  };

  const columns: Column<Staff>[] = [
    {
      key: 'fullName',
      label: 'Nhân viên',
      className: 'w-[28%] text-left',
      noTruncate: true,
      render: (item) => (
        <div className="flex items-center gap-3 min-w-0">
          <EntityAvatar name={item.fullName} imageUrl={item.imageUrl} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate text-sm">{item.fullName}</p>
            {item.expertiseName && <p className="text-xs text-slate-500 truncate">{item.expertiseName}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      className: 'w-[20%] text-left',
      render: (item) => (
        <div className="flex items-center gap-1.5 min-w-0">
          <Mail size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700 truncate">{item.email || '—'}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'SĐT',
      className: 'w-[17%] text-left',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700">{item.phone || '—'}</span>
        </div>
      ),
    },
    {
      key: 'staffType',
      label: 'Vai trò',
      className: 'w-[17%] text-left',
      noTruncate: true,
      render: (item) => <RoleDisplay role={item.staffType} />,
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      className: 'w-[20%] text-center',
      render: (item) => {
        const active = isStaffActive(item);
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>{active ? 'Hoạt động' : 'Ngừng hoạt động'}</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div onClick={() => setFilterType('ALL')} className="cursor-pointer">
          <StatsCard icon={<Users size={16} strokeWidth={2} />} label="Tất cả" value={totalElements} bgColor={filterType === 'ALL' ? 'bg-blue-100' : 'bg-blue-50'} iconColor="text-blue-600" />
        </div>
        <div onClick={() => setFilterType('DOCTOR')} className="cursor-pointer">
          <StatsCard icon={<Stethoscope size={16} strokeWidth={2} />} label="Bác sĩ" value={stats.doctors} bgColor={filterType === 'DOCTOR' ? 'bg-indigo-100' : 'bg-indigo-50'} iconColor="text-indigo-600" />
        </div>
        <div onClick={() => setFilterType('STAFF')} className="cursor-pointer">
          <StatsCard icon={<Briefcase size={16} strokeWidth={2} />} label="Nhân viên" value={stats.staffs} bgColor={filterType === 'STAFF' ? 'bg-slate-200' : 'bg-slate-100'} iconColor="text-slate-600" />
        </div>
        <div onClick={() => setFilterType('LAB_TECH')} className="cursor-pointer">
          <StatsCard icon={<TestTube size={16} strokeWidth={2} />} label="Kỹ thuật viên" value={stats.labTech} bgColor={filterType === 'LAB_TECH' ? 'bg-emerald-100' : 'bg-emerald-50'} iconColor="text-emerald-600" />
        </div>
        <div onClick={() => setFilterType('ADMIN')} className="cursor-pointer">
          <StatsCard icon={<ShieldCheck size={16} strokeWidth={2} />} label="Quản trị viên" value={stats.admins} bgColor={filterType === 'ADMIN' ? 'bg-purple-100' : 'bg-purple-50'} iconColor="text-purple-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={data}
          columns={columns}
          onRowClick={setSelectedStaff}
          emptyMessage="Không có nhân viên nào phù hợp"
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <DetailModal isOpen={!!selectedStaff} onClose={() => setSelectedStaff(null)} title={`Chi tiết nhân viên: ${selectedStaff?.fullName}`}>
        {selectedStaff && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-500">Email</p><p className="text-sm font-medium">{selectedStaff.email || '—'}</p></div>
            <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-500">SĐT</p><p className="text-sm font-medium">{selectedStaff.phone || '—'}</p></div>
            <div className="bg-slate-50 p-3 rounded-xl col-span-2">
              <p className="text-xs text-slate-500">Vai trò</p>
              <div className="mt-1"><RoleDisplay role={selectedStaff.staffType} /></div>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}
