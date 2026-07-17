// features/patients/components/PatientTable.tsx
import React from 'react';
import { Eye, Edit2, Trash2, Phone, MapPin, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Table, { Column } from '@/components/tables/Table';
import EntityAvatar from '@/components/common/EntityAvatar';
import ActionMenu from '@/components/common/ActionMenu';
import { Patient } from '../types/patient';

interface Props {
  data: Patient[];
  onViewDetails: (id: number) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onUnlockBooking?: (patient: Patient) => void;
  onToggleAccountStatus?: (patient: Patient) => void;
  loading?: boolean;
  pagination?: { page: number; size: number; total: number; onPageChange: (page: number) => void };
}

const formatGender = (gender?: string) => {
  const g = gender?.trim().toUpperCase();
  if (g === 'MALE' || g === 'NAM') return 'Nam';
  if (g === 'FEMALE' || g === 'NU' || g === 'NỮ') return 'Nữ';
  return gender || 'Khác';
};

const getBirthYear = (dateOfBirth?: string) => {
  if (!dateOfBirth) return null;
  const year = dateOfBirth.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
};

export default function PatientTable({ data, onViewDetails, onEdit, onDelete, onUnlockBooking, onToggleAccountStatus, loading = false, pagination }: Props) {
  const columns: Column<Patient>[] = [
    {
      key: 'fullName',
      label: 'Bệnh nhân',
      className: 'w-[25%] text-left',
      noTruncate: true,
      render: (patient) => {
        const birthYear = getBirthYear(patient.dateOfBirth);
        const genderLabel = formatGender(patient.gender);
        const meta = [genderLabel, birthYear].filter(Boolean).join(' • ');
        return (
          <div className="flex items-center gap-3 min-w-0">
            <EntityAvatar name={patient.fullName} imageUrl={patient.avatarUrl} size="md" />
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate text-sm">{patient.fullName}</p>
              <p className="text-xs text-slate-500 mt-0.5">#{patient.patientId}{meta ? ` • ${meta}` : ''}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      className: 'w-[30%]',
      render: (patient) => (
        <div className="flex items-start gap-2 text-sm text-slate-600 min-w-0">
          <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
          <span className="line-clamp-2" title={patient.address}>{patient.address?.trim() || '—'}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      className: 'w-[15%]',
      render: (patient) => (
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Phone size={14} className="text-blue-500 shrink-0" />
          <span className="font-medium">{patient.phone?.trim() || '—'}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[30%] lg:w-[15%]',
      noTruncate: true,
      render: (patient) => (
        <ActionMenu>
          <Button onClick={() => onViewDetails(patient.patientId)} variant="outline" className="h-8 px-2 rounded-lg text-xs font-semibold border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors w-full flex items-center justify-start">
            <Eye size={14} className="mr-1.5 shrink-0" /> <span className="truncate">Chi tiết</span>
          </Button>
          {patient.bookingLocked && onUnlockBooking && (
            <Button onClick={() => onUnlockBooking(patient)} variant="outline" className="h-8 px-2 rounded-lg text-xs font-semibold border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 transition-colors w-full flex items-center justify-start">
              <Activity size={14} className="mr-1.5 shrink-0" /> <span className="truncate">Mở khóa</span>
            </Button>
          )}
          {patient.accountId && onToggleAccountStatus && (
            <Button
              onClick={() => onToggleAccountStatus(patient)}
              variant="outline"
              className={`h-8 px-2 rounded-lg text-xs font-semibold transition-colors w-full flex items-center justify-start ${patient.isActive === 0
                  ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                  : 'border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300'
                }`}
            >
              <ShieldCheck size={14} className="mr-1.5 shrink-0" />
              <span className="truncate">{patient.isActive === 0 ? "Mở khóa" : "Khóa"}</span>
            </Button>
          )}
          <Button onClick={() => onDelete(patient)} variant="outline" title="Xóa" className="h-8 px-2 rounded-lg text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-colors w-full flex items-center justify-start">
            <Trash2 size={14} className="mr-1.5 shrink-0" /> <span className="truncate">Xóa</span>
          </Button>
        </ActionMenu>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có bệnh nhân nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}
