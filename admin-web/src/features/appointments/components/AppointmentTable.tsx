import React from 'react';
import { Clock, Globe, UserRound, Calendar, Sparkles, AlertTriangle } from 'lucide-react';
import Table, { Column } from '@/components/tables/Table';
import StatusBadge from '@/components/common/StatusBadge';
import { Appointment, getBookingModeLabel } from '../types/appointment';
import { formatDateTime } from '@/utils/formatters';
import { CheckInButton, CancelButton, TransferButton, CallPatientButton, SkipPatientButton, SendToLabButton, ReturnFromLabButton, CompleteButton, ReturnToQueueButton } from '@/components/common/ActionButtons';
import { useAuth } from '@/context/AuthContext';

interface Props {
  data: Appointment[];
  onCheckIn: (id: number) => void;
  onCancel: (apt: Appointment) => void;
  onTransfer?: (apt: Appointment) => void;
  onCall?: (id: number) => void;
  onSkip?: (id: number) => void;
  onReturnToQueue?: (id: number) => void;
  onSendToLab?: (id: number) => void;
  onReturnFromLab?: (id: number) => void;
  onComplete?: (id: number) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function AppointmentTable({ 
  data, onCheckIn, onCancel, onTransfer, 
  onCall, onSkip, onReturnToQueue, onSendToLab, onReturnFromLab, onComplete,
  loading = false, pagination 
}: Props) {
  const { user } = useAuth();
  const isDoctor = user?.role === 'DOCTOR';
  const isStaffOrAdmin = user?.role === 'STAFF' || user?.role === 'ADMIN';
  const columns: Column<Appointment>[] = [
    {
      key: 'appointmentType',
      label: 'Nguồn',
      className: 'w-[10%]',
      render: (item) =>
        item.appointmentType === 'ONLINE' ? (
          <div className="flex items-center gap-1.5 text-indigo-600">
            <Globe size={16} />
            <span className="text-xs font-semibold">Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-500">
            <UserRound size={16} />
            <span className="text-xs font-semibold">Trực tiếp</span>
          </div>
        ),
    },
    {
      key: 'queueNumber',
      label: 'STT',
      className: 'w-[8%]',
      render: (item) => (
        <div className="font-bold text-lg text-slate-700">
          {item.queueNumber !== null && item.queueNumber !== undefined ? (
            item.queueNumber === 0 ? (
              <span className="text-amber-600 flex items-center gap-1 text-sm"><AlertTriangle size={14}/> Ưu tiên</span>
            ) : (
              `#${item.queueNumber}`
            )
          ) : (
            <span className="text-slate-300 text-sm">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'appointmentDate',
      label: 'Ngày & ID',
      className: 'w-[18%]',
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={14} className="text-slate-400" />
            {formatDateTime(item.appointmentDate)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">#APT-{item.appointmentId}</p>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Bệnh nhân',
      className: 'w-[20%]',
      render: (item) => (
        <div>
          <p className="font-medium text-slate-800">{item.patientName}</p>
          <p className="text-xs text-slate-500 mt-0.5">ID: PAT-{item.patientId}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              {getBookingModeLabel(item.bookingMode)}
            </span>
            {item.isAiSuggested && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 flex items-center gap-0.5">
                <Sparkles size={10} /> AI gợi ý
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'timeStart',
      label: 'Lịch khám & Bác sĩ',
      className: 'w-[22%]',
      render: (item) => (
        <div>
          <div className="flex items-center gap-1 text-sm text-slate-700">
            <Clock size={14} className="text-blue-500" />
            <span>
              {item.appointmentDate} • {item.timeStart?.substring(0, 5)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-slate-600">{item.doctorName || 'Chưa gán bác sĩ'}</p>
            {item.isDoctorBusy && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded" title="Bác sĩ có lịch nghỉ bận vào ngày này">
                <AlertTriangle size={12} /> Bận
              </span>
            )}
          </div>
          {item.expertiseName && (
            <p className="text-xs text-slate-500 mt-0.5">Khoa: {item.expertiseName}</p>
          )}
          {item.suggestedExpertiseName && item.suggestedExpertiseName !== item.expertiseName && (
            <p className="text-xs text-violet-600 mt-0.5">AI gợi ý: {item.suggestedExpertiseName}</p>
          )}
          {item.serviceName && (
            <p className="text-xs text-slate-500 mt-0.5">DV: {item.serviceName}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      className: 'w-[15%]',
      render: (item) => (
        <div>
          <StatusBadge status={item.status} />
          {item.status === 'CANCELLED' && item.cancelReason && (
            <p className="text-xs text-rose-500 mt-1 truncate max-w-[150px]" title={item.cancelReason}>
              {item.cancelReason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'w-[20%]',
      render: (item) => (
        <div className="flex flex-wrap gap-2">
          {/* Staff/Admin Actions */}
          {isStaffOrAdmin && ['PENDING', 'CONFIRMED'].includes(item.status) && (
            <CheckInButton onClick={() => onCheckIn(item.appointmentId)} />
          )}
          {isStaffOrAdmin && ['PENDING', 'CONFIRMED', 'CHECKED_IN'].includes(item.status) && onTransfer && (
            <TransferButton onClick={() => onTransfer(item)} />
          )}
          {isStaffOrAdmin && ['SKIPPED'].includes(item.status) && onReturnToQueue && (
            <ReturnToQueueButton onClick={() => onReturnToQueue(item.appointmentId)} />
          )}
          {isStaffOrAdmin && ['WAITING_RESULT'].includes(item.status) && onReturnFromLab && (
            <ReturnFromLabButton onClick={() => onReturnFromLab(item.appointmentId)} />
          )}
          {isStaffOrAdmin && !['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(item.status) && (
            <CancelButton onClick={() => onCancel(item)} />
          )}

          {/* Doctor Actions */}
          {isDoctor && ['CHECKED_IN', 'SKIPPED'].includes(item.status) && onCall && (
            <CallPatientButton onClick={() => onCall(item.appointmentId)} />
          )}
          {isDoctor && ['CHECKED_IN', 'IN_PROGRESS'].includes(item.status) && onSkip && (
            <SkipPatientButton onClick={() => onSkip(item.appointmentId)} />
          )}
          {isDoctor && ['IN_PROGRESS'].includes(item.status) && onSendToLab && (
            <SendToLabButton onClick={() => onSendToLab(item.appointmentId)} />
          )}
          {isDoctor && ['IN_PROGRESS'].includes(item.status) && onComplete && (
            <CompleteButton onClick={() => onComplete(item.appointmentId)} />
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Không có lịch hẹn nào."
      pagination={pagination}
      rowClassName="hover:bg-slate-50 border-b border-slate-100 transition-colors"
    />
  );
}