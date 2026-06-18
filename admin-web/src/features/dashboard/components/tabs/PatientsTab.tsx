// features/dashboard/components/tabs/PatientsTab.tsx
import React, { useState, useMemo } from 'react';
import { Users, UserPlus, Repeat } from 'lucide-react';
import { PatientStatsSummary, PatientStat } from '../../types/dashboard';
import Table, { Column } from '@/components/tables/Table';
import DetailModal from '../common/DetailModal';
import { StatsCard } from '@/components/common/StatsCard';
import { getImageUrl } from '@/utils/image';

interface Props {
  data: PatientStatsSummary | null;
  loading?: boolean;
  searchTerm?: string;
}

export default function PatientsTab({ data, loading = false, searchTerm = '' }: Props) {
  const [selectedPatient, setSelectedPatient] = useState<PatientStat | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const safeData: PatientStatsSummary = data || {
    newPatients: 0,
    returningPatients: 0,
    topPatients: [],
  };

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return safeData.topPatients;
    return safeData.topPatients.filter(p =>
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeData.topPatients, searchTerm]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredPatients.length]);

  const columns: Column<PatientStat>[] = [
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      className: 'w-[30%] min-w-[160px]',
      render: (item: PatientStat) => {
        const avatarUrl = getImageUrl(item.avatarUrl);
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={item.patientName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'text-sm font-bold';
                      fallback.textContent = item.patientName.charAt(0).toUpperCase();
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span className="text-sm font-bold">{item.patientName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="font-semibold text-slate-800 truncate" title={item.patientName}>
              {item.patientName}
            </span>
          </div>
        );
      },
    },
    { key: 'visitCount', label: 'Số lần khám', className: 'w-[15%] text-center' },
    {
      key: 'lastVisit',
      label: 'Lần khám gần nhất',
      className: 'w-[20%] text-center',
      render: (item: PatientStat) => (
        <span>{item.lastVisit ? new Date(item.lastVisit).toLocaleDateString('vi-VN') : '—'}</span>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Tổng chi phí',
      className: 'w-[25%] text-right',
      render: (item: PatientStat) => (
        <span className="font-medium text-emerald-600">{item.totalSpent.toLocaleString()}đ</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={<Users size={16} />} label="Tổng bệnh nhân" value={safeData.newPatients + safeData.returningPatients} bgColor="bg-blue-50" iconColor="text-blue-600" />
        <StatsCard icon={<UserPlus size={16} />} label="Bệnh nhân mới" value={safeData.newPatients} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
        <StatsCard icon={<Repeat size={16} />} label="Bệnh nhân quay lại" value={safeData.returningPatients} bgColor="bg-purple-50" iconColor="text-purple-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table
          data={filteredPatients}
          columns={columns}
          onRowClick={(item) => setSelectedPatient(item)}
          loading={false}
          emptyMessage="Không có dữ liệu bệnh nhân"
          maxHeight="500px"
          pagination={{
            page: currentPage,
            size: pageSize,
            total: filteredPatients.length,
            onPageChange: setCurrentPage,
          }}
        />
      </div>

      <DetailModal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`Chi tiết bệnh nhân: ${selectedPatient?.patientName}`}>
        {selectedPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-500">Số lần khám</p><p className="text-lg font-bold">{selectedPatient.visitCount}</p></div>
              <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-500">Lần khám gần nhất</p><p className="text-lg font-bold">{selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString('vi-VN') : '—'}</p></div>
              <div className="bg-slate-50 p-3 rounded-xl col-span-2"><p className="text-xs text-slate-500">Tổng chi phí</p><p className="text-lg font-bold text-emerald-600">{selectedPatient.totalSpent.toLocaleString()}đ</p></div>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}