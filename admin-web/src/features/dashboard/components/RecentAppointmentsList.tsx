import React from 'react';

const recentAppointments = [
  { id: 1, patientName: 'Nguyễn Văn An', service: 'Khám tổng quát', status: 'CONFIRMED', statusLabel: 'Đã xác nhận' },
  { id: 2, patientName: 'Trần Thị Bích', service: 'Xét nghiệm máu', status: 'COMPLETED', statusLabel: 'Hoàn thành' },
  { id: 3, patientName: 'Lê Văn Cường', service: 'Siêu âm', status: 'PENDING', statusLabel: 'Chờ xác nhận' },
  { id: 4, patientName: 'Phạm Thị Dung', service: 'Tái khám', status: 'CONFIRMED', statusLabel: 'Đã xác nhận' },
  { id: 5, patientName: 'Hoàng Văn Em', service: 'Đặt lịch xét nghiệm', status: 'CANCELLED', statusLabel: 'Đã hủy' },
];

const statusColorMap: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
};

export default function RecentAppointmentsList() {
  return (
    <div className="space-y-4">
      {recentAppointments.map((apt) => (
        <div key={apt.id} className="flex items-center gap-4">
          {/* Avatar chữ có màu nền xanh dương nhạt, chữ xanh dương đậm */}
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            {apt.patientName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate" title={apt.patientName}>
              {apt.patientName}
            </h4>
            <p className="text-xs text-slate-500 truncate" title={apt.service}>
              {apt.service}
            </p>
          </div>
          <div
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColorMap[apt.status]}`}
          >
            {apt.statusLabel}
          </div>
        </div>
      ))}
    </div>
  );
}