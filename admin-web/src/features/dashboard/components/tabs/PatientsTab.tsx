// features/dashboard/components/tabs/PatientsTab.tsx
import React, { useState } from 'react';
import { Users, UserPlus, Repeat } from 'lucide-react';
import { PatientStatsSummary, PatientStat } from '../../types/dashboard';
import DataTable from '../common/DataTable';
import DetailModal from '../common/DetailModal';
import { StatsCard } from '@/components/common/StatsCard';

interface Props {
  data: PatientStatsSummary | null;
  loading?: boolean;
}

export default function PatientsTab({ data, loading = false }: Props) {
  const [selectedPatient, setSelectedPatient] = useState<PatientStat | null>(null);

  const safeData: PatientStatsSummary = data || {
    newPatients: 0,
    returningPatients: 0,
    topPatients: [],
  };

  const columns = [
    { key: 'index', label: '#', render: (_: any, __: any, index: number) => index + 1 },
    { key: 'patientName', label: 'Tên bệnh nhân' },
    { key: 'visitCount', label: 'Số lần khám' },
    {
      key: 'lastVisit',
      label: 'Lần khám gần nhất',
      render: (item: PatientStat) => (
        <span>{item.lastVisit ? new Date(item.lastVisit).toLocaleDateString('vi-VN') : '—'}</span>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Tổng chi phí',
      render: (item: PatientStat) => (
        <span className="font-medium text-emerald-600">{item.totalSpent.toLocaleString()}đ</span>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center py-8 text-slate-400">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - dùng StatCard đồng bộ với các tab khác */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          icon={<Users size={16} />}
          label="Tổng bệnh nhân"
          value={safeData.newPatients + safeData.returningPatients}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          icon={<UserPlus size={16} />}
          label="Bệnh nhân mới"
          value={safeData.newPatients}
          bgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatsCard
          icon={<Repeat size={16} />}
          label="Bệnh nhân quay lại"
          value={safeData.returningPatients}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          data={safeData.topPatients || []}
          columns={columns}
          onRowClick={(item) => setSelectedPatient(item)}
          emptyMessage="Không có dữ liệu bệnh nhân"
        />
      </div>

      <DetailModal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={`Chi tiết bệnh nhân: ${selectedPatient?.patientName}`}
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Số lần khám</p>
                <p className="text-lg font-bold">{selectedPatient.visitCount}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-500">Lần khám gần nhất</p>
                <p className="text-lg font-bold">
                  {selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString('vi-VN') : '—'}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl col-span-2">
                <p className="text-xs text-slate-500">Tổng chi phí</p>
                <p className="text-lg font-bold text-emerald-600">
                  {selectedPatient.totalSpent.toLocaleString()}đ
                </p>
              </div>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
}