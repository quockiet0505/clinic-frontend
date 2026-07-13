// features/dashboard/components/tabs/StaffTab.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Stethoscope, ShieldCheck, TestTube, Briefcase, Mail, Phone, BarChart2 } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import Table, { Column } from '@/components/tables/Table';
import EntityAvatar from '@/components/common/EntityAvatar';
import DetailModal from '../common/DetailModal';
import { Staff } from '@/features/staffs/types/staff';
import { isStaffActive } from '@/features/staffs/utils/staffUtils';
import { RoleDisplay } from '@/features/staffs/utils/roleDisplay';
import { staffApi } from '@/features/staffs/api/staffApi';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

type FilterType = 'ALL' | 'DOCTOR' | 'RECEPTIONIST' | 'NURSE' | 'LAB_TECH' | 'ADMIN';

interface Props {
  searchTerm?: string;
}

export default function StaffTab({ searchTerm = '' }: Props) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Staff[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
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

  const fetchAllStaff = useCallback(async () => {
    try {
      const res = await staffApi.getAll();
      setAllStaff(res);
    } catch (e) {
      console.error('Error fetching all staff:', e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchAllStaff();
  }, [fetchAllStaff]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const stats = useMemo(() => {
    return {
      total: allStaff.length,
      doctors: allStaff.filter((s) => s.staffType === 'DOCTOR').length,
      receptionists: allStaff.filter((s) => s.staffType === 'RECEPTIONIST').length,
      nurses: allStaff.filter((s) => s.staffType === 'NURSE').length,
      labTech: allStaff.filter((s) => s.staffType === 'LAB_TECH').length,
      admins: allStaff.filter((s) => s.staffType === 'ADMIN').length,
    };
  }, [allStaff]);

  // 1. Tỷ trọng vai trò nhân viên
  const roleData = useMemo(() => {
    if (!allStaff.length) return [];
    const counts = allStaff.reduce((acc, s) => {
      acc[s.staffType] = (acc[s.staffType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Bác sĩ', value: counts['DOCTOR'] || 0, color: '#0284c7' },
      { name: 'KTV', value: counts['LAB_TECH'] || 0, color: '#818cf8' },
      { name: 'Tiếp tân', value: counts['RECEPTIONIST'] || 0, color: '#d97706' },
      { name: 'Điều dưỡng', value: counts['NURSE'] || 0, color: '#db2777' },
      { name: 'Quản trị viên', value: counts['ADMIN'] || 0, color: '#fb923c' },
    ].filter(d => d.value > 0);
  }, [allStaff]);

  // 2. Phân bổ nhân viên theo chuyên khoa
  const expertiseData = useMemo(() => {
    if (!allStaff.length) return [];
    const counts = allStaff.reduce((acc, s) => {
      const ext = s.expertiseName || 'Khác / Hành chính';
      acc[ext] = (acc[ext] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allStaff]);

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

  const RoleTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const total = roleData.reduce((sum, item) => sum + item.value, 0);
    const pct = total > 0 ? Math.round(d.value / total * 100) : 0;
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xl p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
          <span className="font-semibold text-slate-700">{d.name}</span>
        </div>
        <p className="mt-1 ml-4 text-slate-500">{d.value} nhân sự ({pct}%)</p>
      </div>
    );
  };

  // 2a. Phân bổ nhân sự Bác sĩ theo Chuyên khoa Lâm sàng
  const clinicalExpertiseData = useMemo(() => {
    if (!allStaff.length) return [];
    const doctors = allStaff.filter(s => s.staffType === 'DOCTOR');
    const counts = doctors.reduce((acc, s) => {
      const ext = s.expertiseName || 'Chuyên khoa lâm sàng';
      acc[ext] = (acc[ext] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allStaff]);

  // 2b. Phân bổ nhân sự Kỹ thuật viên theo Chuyên khoa Kỹ thuật
  const technicalExpertiseData = useMemo(() => {
    if (!allStaff.length) return [];
    const techs = allStaff.filter(s => s.staffType === 'LAB_TECH');
    const counts = techs.reduce((acc, s) => {
      const ext = s.expertiseName || 'Kỹ thuật cận lâm sàng';
      acc[ext] = (acc[ext] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allStaff]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Tất cả */}
        <div onClick={() => setFilterType('ALL')} className="cursor-pointer">
          <StatsCard
            icon={<Users size={18} className="text-white" />}
            label="Tất cả"
            value={stats.total}
            bgColor="from-sky-400 to-sky-600"
            className={filterType === 'ALL'
              ? 'bg-sky-50/40 border-sky-300 ring-2 ring-sky-300/30'
              : 'border-slate-200/80 hover:border-slate-300 opacity-75'
            }
          />
        </div>

        {/* Bác sĩ */}
        <div onClick={() => setFilterType('DOCTOR')} className="cursor-pointer">
          <StatsCard
            icon={<Stethoscope size={18} className="text-white" />}
            label="Bác sĩ"
            value={stats.doctors}
            bgColor="from-indigo-400 to-indigo-600"
            className={filterType === 'DOCTOR'
              ? 'bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-300/30'
              : 'border-slate-200/80 hover:border-slate-300 opacity-75'
            }
          />
        </div>

        {/* Tiếp tân */}
        <div onClick={() => setFilterType('RECEPTIONIST')} className="cursor-pointer">
          <StatsCard
            icon={<Briefcase size={18} className="text-white" />}
            label="Tiếp tân"
            value={stats.receptionists}
            bgColor="from-amber-400 to-amber-600"
            className={filterType === 'RECEPTIONIST'
              ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-300/30'
              : 'border-slate-200/80 hover:border-slate-300 opacity-75'
            }
          />
        </div>

        {/* Điều dưỡng */}
        <div onClick={() => setFilterType('NURSE')} className="cursor-pointer">
          <StatsCard
            icon={<Briefcase size={18} className="text-white" />}
            label="Điều dưỡng"
            value={stats.nurses}
            bgColor="from-pink-400 to-pink-600"
            className={filterType === 'NURSE'
              ? 'bg-pink-50/40 border-pink-300 ring-2 ring-pink-300/30'
              : 'border-slate-200/80 hover:border-slate-300 opacity-75'
            }
          />
        </div>

        {/* Kỹ thuật viên */}
        <div onClick={() => setFilterType('LAB_TECH')} className="cursor-pointer">
          <StatsCard
            icon={<TestTube size={18} className="text-white" />}
            label="Kỹ thuật viên"
            value={stats.labTech}
            bgColor="from-purple-400 to-purple-600"
            className={filterType === 'LAB_TECH'
              ? 'bg-purple-50/40 border-purple-300 ring-2 ring-purple-300/30'
              : 'border-slate-200/80 hover:border-slate-300 opacity-75'
            }
          />
        </div>

        {/* Quản trị viên */}
        <div onClick={() => setFilterType('ADMIN')} className="cursor-pointer">
          <StatsCard
            icon={<ShieldCheck size={18} className="text-white" />}
            label="Quản trị viên"
            value={stats.admins}
            bgColor="from-orange-400 to-orange-600"
            className={filterType === 'ADMIN'
              ? 'bg-orange-50/40 border-orange-300 ring-2 ring-orange-300/30'
              : 'border-slate-200/80 hover:border-slate-300 opacity-75'
            }
          />
        </div>
      </div>

      {/* Grid 2 biểu đồ chuyên khoa đứng cạnh nhau (Lâm sàng 2/3, Kỹ thuật 1/3) */}
      {allStaff.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Biểu đồ 1: Lâm sàng (Bác sĩ) – lg:col-span-2 */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[360px]">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-semibold text-slate-600">Top chuyên khoa lâm sàng đông bác sĩ nhất</h3>
              <span className="text-[10px] text-slate-400 bg-sky-50 text-sky-700 px-2 py-1 rounded-lg font-bold">Bác sĩ</span>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clinicalExpertiseData.slice(0, 8)} margin={{ top: 20, right: 10, left: -25, bottom: 20 }} barSize={26}>
                  <defs>
                    <linearGradient id="clinicalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} dy={8} interval={0} angle={-15} textAnchor="end" height={45} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.4 }} />
                  <Bar dataKey="value" fill="url(#clinicalGrad)" radius={[6, 6, 0, 0]} label={{ position: 'top', fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ 2: Kỹ thuật (Kỹ thuật viên) – lg:col-span-1 */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[360px]">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-semibold text-slate-600">Nhân sự theo chuyên khoa kỹ thuật</h3>
              <span className="text-[10px] text-slate-400 bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-bold">KTV</span>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={technicalExpertiseData.slice(0, 8)} margin={{ top: 20, right: 10, left: -25, bottom: 20 }} barSize={26}>
                  <defs>
                    <linearGradient id="techGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity={1} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} dy={8} interval={0} angle={-15} textAnchor="end" height={45} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.4 }} />
                  <Bar dataKey="value" fill="url(#techGrad)" radius={[6, 6, 0, 0]} label={{ position: 'top', fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

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

