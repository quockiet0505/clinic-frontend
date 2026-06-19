// features/dashboard/components/tabs/PatientsTab.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, Repeat } from 'lucide-react';
import { PatientStat } from '../../types/dashboard';
import Table, { Column } from '@/components/tables/Table';
import EntityAvatar from '@/components/common/EntityAvatar';
import DetailModal from '../common/DetailModal';
import { StatsCard } from '@/components/common/StatsCard';
import { dashboardApi } from '../../api/dashboardApi';

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
      className: 'w-[30%] text-right',
      render: (item) => <span className="font-medium text-emerald-600">{item.totalSpent.toLocaleString()}đ</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<Users size={16} />} label="Tổng bệnh nhân" value={summary.newPatients + summary.returningPatients} bgColor="bg-blue-50" iconColor="text-blue-600" />
        <StatsCard icon={<UserPlus size={16} />} label="Bệnh nhân mới" value={summary.newPatients} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
        <StatsCard icon={<Repeat size={16} />} label="Bệnh nhân quay lại" value={summary.returningPatients} bgColor="bg-purple-50" iconColor="text-purple-600" />
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
