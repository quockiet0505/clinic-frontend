// features/dashboard/components/tabs/StaffTab.tsx
import React, { useState, useMemo } from 'react';
import { Users, Stethoscope, ShieldCheck, TestTube, Briefcase, Mail, Phone } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import Table, { Column } from '@/components/tables/Table';
import DetailModal from '../common/DetailModal';
import { Staff } from '@/features/staffs/types/staff';
import { getImageUrl } from '@/utils/image';

type FilterType = 'ALL' | 'DOCTOR' | 'STAFF' | 'LAB_TECH' | 'ADMIN';

interface Props {
  data: Staff[];
  loading?: boolean;
  searchTerm?: string;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'DOCTOR': return <Stethoscope size={16} className="text-blue-500" />;
    case 'ADMIN': return <ShieldCheck size={16} className="text-purple-500" />;
    case 'LAB_TECH': return <TestTube size={16} className="text-emerald-500" />;
    case 'STAFF': return <Briefcase size={16} className="text-slate-500" />;
    default: return <UserCog size={16} className="text-slate-400" />;
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'DOCTOR': return 'Bác sĩ';
    case 'ADMIN': return 'Quản trị viên';
    case 'LAB_TECH': return 'Kỹ thuật viên';
    case 'STAFF': return 'Nhân viên';
    default: return role;
  }
};

export default function StaffTab({ data, loading = false, searchTerm = '' }: Props) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const stats = {
    total: data.length,
    doctors: data.filter(s => s.staffType === 'DOCTOR').length,
    staffs: data.filter(s => s.staffType === 'STAFF').length,
    labTech: data.filter(s => s.staffType === 'LAB_TECH').length,
    admins: data.filter(s => s.staffType === 'ADMIN').length,
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchType = filterType === 'ALL' || item.staffType === filterType;
      const matchSearch = item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.phone && item.phone.includes(searchTerm));
      return matchType && matchSearch;
    });
  }, [data, filterType, searchTerm]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length, filterType]);

  const columns: Column<Staff>[] = [
    {
      key: 'fullName',
      label: 'Nhân viên',
      className: 'w-[32%] min-w-[160px]',
      render: (item: Staff) => {
        const avatarUrl = getImageUrl(item.imageUrl);
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={item.fullName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'text-sm font-bold';
                      fallback.textContent = item.fullName.charAt(0).toUpperCase();
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span className="text-sm font-bold">{item.fullName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate text-sm" title={item.fullName}>
                {item.fullName}
              </p>
              {item.expertiseName && (
                <p className="text-xs text-slate-500 truncate">{item.expertiseName}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'email',
      label: 'Email',
      className: 'w-[22%] min-w-[120px]',
      render: (item: Staff) => (
        <div className="flex items-center gap-1.5">
          <Mail size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700 truncate" title={item.email || 'Chưa có email'}>
            {item.email || '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'SĐT',
      className: 'w-[14%] min-w-[100px]',
      render: (item: Staff) => (
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700">
            {item.phone || '—'}
          </span>
        </div>
      ),
    },
    {
      key: 'staffType',
      label: 'Vai trò',
      className: 'w-[14%] min-w-[100px]',
      render: (item: Staff) => (
        <div className="flex items-center gap-1.5">
          {getRoleIcon(item.staffType)}
          <span className="text-sm font-medium text-slate-700">{getRoleLabel(item.staffType)}</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      className: 'w-[18%] min-w-[100px]',
      render: (item: Staff) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }`}>
          {item.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div onClick={() => setFilterType('ALL')} className="cursor-pointer">
          <StatsCard icon={<Users size={16} />} label="Tất cả" value={stats.total} bgColor={filterType === 'ALL' ? 'bg-blue-100' : 'bg-blue-50'} iconColor={filterType === 'ALL' ? 'text-blue-700' : 'text-blue-600'} />
        </div>
        <div onClick={() => setFilterType('DOCTOR')} className="cursor-pointer">
          <StatsCard icon={<Stethoscope size={16} />} label="Bác sĩ" value={stats.doctors} bgColor={filterType === 'DOCTOR' ? 'bg-indigo-100' : 'bg-indigo-50'} iconColor={filterType === 'DOCTOR' ? 'text-indigo-700' : 'text-indigo-600'} />
        </div>
        <div onClick={() => setFilterType('STAFF')} className="cursor-pointer">
          <StatsCard icon={<Briefcase size={16} />} label="Nhân viên" value={stats.staffs} bgColor={filterType === 'STAFF' ? 'bg-slate-200' : 'bg-slate-100'} iconColor={filterType === 'STAFF' ? 'text-slate-700' : 'text-slate-600'} />
        </div>
        <div onClick={() => setFilterType('LAB_TECH')} className="cursor-pointer">
          <StatsCard icon={<TestTube size={16} />} label="Kỹ thuật viên" value={stats.labTech} bgColor={filterType === 'LAB_TECH' ? 'bg-emerald-100' : 'bg-emerald-50'} iconColor={filterType === 'LAB_TECH' ? 'text-emerald-700' : 'text-emerald-600'} />
        </div>
        <div onClick={() => setFilterType('ADMIN')} className="cursor-pointer">
          <StatsCard icon={<ShieldCheck size={16} />} label="Quản trị viên" value={stats.admins} bgColor={filterType === 'ADMIN' ? 'bg-purple-100' : 'bg-purple-50'} iconColor={filterType === 'ADMIN' ? 'text-purple-700' : 'text-purple-600'} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={filteredData}
          columns={columns}
          onRowClick={(item) => setSelectedStaff(item)}
          loading={false}
          emptyMessage="Không có nhân viên nào phù hợp"
          maxHeight="500px"
          pagination={{
            page: currentPage,
            size: pageSize,
            total: filteredData.length,
            onPageChange: setCurrentPage,
          }}
        />
      </div>

      <DetailModal isOpen={!!selectedStaff} onClose={() => setSelectedStaff(null)} title={`Chi tiết nhân viên: ${selectedStaff?.fullName}`}>
        {selectedStaff && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-500">Email</p><p className="text-sm font-medium text-slate-800">{selectedStaff.email || '—'}</p></div>
              <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-500">SĐT</p><p className="text-sm font-medium text-slate-800">{selectedStaff.phone || '—'}</p></div>
              <div className="bg-slate-50 p-3 rounded-xl col-span-2"><p className="text-xs text-slate-500">Vai trò</p><p className="text-sm font-medium text-slate-800 flex items-center gap-2">{getRoleIcon(selectedStaff.staffType)} {getRoleLabel(selectedStaff.staffType)}</p></div>
              <div className="bg-slate-50 p-3 rounded-xl col-span-2"><p className="text-xs text-slate-500">Trạng thái</p><p className={`text-sm font-medium ${selectedStaff.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>{selectedStaff.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}</p></div>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}