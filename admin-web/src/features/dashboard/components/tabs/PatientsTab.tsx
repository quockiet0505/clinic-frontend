import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, Repeat } from 'lucide-react';
import { PatientStat } from '../../types/dashboard';
import Table, { Column } from '@/components/tables/Table';
import EntityAvatar from '@/components/common/EntityAvatar';
import DetailModal from '../common/DetailModal';
import { StatsCard } from '@/components/common/StatsCard';
import { dashboardApi } from '../../api/dashboardApi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  month: number;
  year: number;
  searchTerm?: string;
}

export default function PatientsTab({ month, year, searchTerm = '' }: Props) {
  const [selectedPatient, setSelectedPatient] = useState<PatientStat | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<PatientStat[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [summary, setSummary] = useState({ newPatients: 0, returningPatients: 0 });
  const pageSize = 20;

  const fetchData = useCallback(async () => {
    try {
      const res = await dashboardApi.getPatientStatsPaged({
        month, year, search: searchTerm || undefined,
        page: currentPage - 1, size: pageSize,
      });
      setData(res.topPatients);
      setTotalElements(res.totalElements);
      setSummary({ newPatients: res.newPatients, returningPatients: res.returningPatients });
    } catch {
      // giữ dữ liệu cũ
    }
  }, [month, year, searchTerm, currentPage]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, month, year]);

  const columns: Column<PatientStat>[] = [
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      className: 'w-[32%] text-left',
      noTruncate: true,
      render: (item) => (
        <div className="flex items-center gap-3 min-w-0">
          <EntityAvatar name={item.patientName} imageUrl={item.avatarUrl} size="md" />
          <span className="font-semibold text-slate-800 truncate" title={item.patientName}>{item.patientName}</span>
        </div>
      ),
    },
    { key: 'visitCount', label: 'Số lần khám', className: 'w-[16%] text-center' },
    {
      key: 'lastVisit',
      label: 'Lần khám gần nhất',
      className: 'w-[22%] text-center',
      render: (item) => <span>{item.lastVisit ? new Date(item.lastVisit).toLocaleDateString('vi-VN') : '—'}</span>,
    },
    {
      key: 'totalSpent',
      label: 'Tổng chi phí',
      className: 'w-[30%] text-left',
      render: (item) => <span className="font-medium text-emerald-600">{item.totalSpent.toLocaleString()}đ</span>,
    },
  ];

  const totalPts = summary.newPatients + summary.returningPatients;
  const donutData = totalPts > 0 ? [
    { name: 'Bệnh nhân mới', value: summary.newPatients, pct: Math.round(summary.newPatients / totalPts * 100), color: '#0284c7' },
    { name: 'Tái khám', value: summary.returningPatients, pct: Math.round(summary.returningPatients / totalPts * 100), color: '#818cf8' },
  ] : [];

  const PtTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xl p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
          <span className="font-semibold text-slate-700">{d.name}</span>
        </div>
        <p className="mt-1 ml-4 text-slate-500">{d.value} bệnh nhân ({d.pct}%)</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Thống kê phân tích bệnh nhân dạng Card lớn tích hợp */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          
          {/* Cột 1: Chỉ số tổng bệnh nhân */}
          <div className="flex items-center gap-4 w-full md:w-auto md:border-r border-slate-100 md:pr-10 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-100 shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tổng bệnh nhân</p>
              <p className="text-3xl font-black text-slate-800 leading-none">{totalPts}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Hoạt động trong tháng</p>
            </div>
          </div>

          {/* Cột 2: Biểu đồ Donut lớn hơn, rõ nét */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            {donutData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius="55%" outerRadius="75%"
                      startAngle={90} endAngle={-270} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip content={<PtTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-800 leading-none">{totalPts}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 font-medium uppercase tracking-wider">Bệnh nhân</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-[11px] text-slate-400">Chưa có dữ liệu</div>
            )}
          </div>

          {/* Cột 3: Chi tiết phần trăm bệnh nhân mới & quay lại */}
          <div className="flex-1 w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 md:pl-10">
            {/* Bệnh nhân mới */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] inline-block" />
                  Bệnh nhân mới
                </span>
                <span className="text-xs font-bold text-sky-600">
                  {summary.newPatients} ca
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800">
                  {totalPts > 0 ? Math.round(summary.newPatients / totalPts * 100) : 0}%
                </span>
                <span className="text-xs text-slate-400 font-medium">tổng lượt</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${totalPts > 0 ? (summary.newPatients / totalPts * 100) : 0}%` }} />
              </div>
            </div>

            {/* Bệnh nhân quay lại */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#818cf8] inline-block" />
                  Bệnh nhân tái khám
                </span>
                <span className="text-xs font-bold text-indigo-600">
                  {summary.returningPatients} ca
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800">
                  {totalPts > 0 ? Math.round(summary.returningPatients / totalPts * 100) : 0}%
                </span>
                <span className="text-xs text-slate-400 font-medium">tổng lượt</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${totalPts > 0 ? (summary.returningPatients / totalPts * 100) : 0}%` }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={data}
          columns={columns}
          onRowClick={setSelectedPatient}
          emptyMessage="Không có dữ liệu bệnh nhân"
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <DetailModal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`Chi tiết bệnh nhân: ${selectedPatient?.patientName}`}>
        {selectedPatient && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-500">Số lần khám</p><p className="text-lg font-bold">{selectedPatient.visitCount}</p></div>
            <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-500">Lần khám gần nhất</p><p className="text-lg font-bold">{selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString('vi-VN') : '—'}</p></div>
            <div className="bg-slate-50 p-3 rounded-xl col-span-2"><p className="text-xs text-slate-500">Tổng chi phí</p><p className="text-lg font-bold text-emerald-600">{selectedPatient.totalSpent.toLocaleString()}đ</p></div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}
