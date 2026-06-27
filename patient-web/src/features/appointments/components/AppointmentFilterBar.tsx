import React, { useState, useRef } from 'react';
import { PATIENT_BOOKABLE_SERVICE_TYPES, SERVICE_TYPE_LABELS } from '@/constants/serviceTypes';
import { SearchInput } from '@/components/common/SearchInput';
import type { AppointmentStatus } from '../types/appointment';

interface AppointmentFilterBarProps {
  status: AppointmentStatus | 'ALL';
  onStatusChange: (value: AppointmentStatus | 'ALL') => void;
  serviceType: string;
  onServiceTypeChange: (value: string) => void;
}

export const AppointmentFilterBar: React.FC<AppointmentFilterBarProps> = ({
  status,
  onStatusChange,
  serviceType,
  onServiceTypeChange,
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const serviceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleStatusEnter = () => {
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    setIsStatusOpen(true);
  };
  const handleStatusLeave = () => {
    statusTimeoutRef.current = setTimeout(() => setIsStatusOpen(false), 150);
  };

  const handleServiceEnter = () => {
    if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current);
    setIsServiceOpen(true);
  };
  const handleServiceLeave = () => {
    serviceTimeoutRef.current = setTimeout(() => setIsServiceOpen(false), 150);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center justify-end">
      
      {/* Lọc theo Loại Dịch Vụ */}
      <div 
        className="w-full sm:w-44 shrink-0 relative z-50"
        onMouseEnter={handleServiceEnter}
        onMouseLeave={handleServiceLeave}
      >
        <button className={`w-full h-11 flex items-center justify-between px-4 rounded-full bg-white border shadow-sm font-medium text-slate-700 cursor-pointer transition-colors ${isServiceOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200'}`}>
          <span className="text-[14px]">
            {serviceType === 'ALL'
              ? 'Loại dịch vụ'
              : (SERVICE_TYPE_LABELS[serviceType] ?? serviceType)}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isServiceOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div className={`absolute left-0 right-0 top-full pt-2 transition-all duration-200 ${isServiceOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-1.5 flex flex-col gap-0.5">
            {[
              { value: 'ALL', label: 'Tất cả dịch vụ' },
              ...PATIENT_BOOKABLE_SERVICE_TYPES.map((t) => ({
                value: t,
                label: SERVICE_TYPE_LABELS[t] ?? t,
              })),
            ].map(item => (
              <button
                key={item.value}
                onClick={() => { onServiceTypeChange(item.value as any); setIsServiceOpen(false); }}
                className={`w-full text-left cursor-pointer py-2 px-3 text-[13.5px] font-medium rounded-xl transition-all ${
                  serviceType === item.value ? 'bg-primary-50 text-primary-600' : 'text-slate-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lọc theo Trạng Thái */}
      <div 
        className="w-full sm:w-44 shrink-0 relative z-40"
        onMouseEnter={handleStatusEnter}
        onMouseLeave={handleStatusLeave}
      >
        <button className={`w-full h-11 flex items-center justify-between px-4 rounded-full bg-white border shadow-sm font-medium text-slate-700 cursor-pointer transition-colors ${isStatusOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200'}`}>
          <span className="text-[14px]">
            {status === 'ALL' && 'Trạng thái'}
            {status === 'PENDING' && 'Chờ xác nhận'}
            {status === 'CONFIRMED' && 'Đã xác nhận'}
            {status === 'CHECKED_IN' && 'Đã đến viện'}
            {status === 'IN_PROGRESS' && 'Đang khám'}
            {status === 'WAITING_RESULT' && 'Chờ kết quả'}
            {status === 'COMPLETED' && 'Hoàn thành'}
            {status === 'CANCELLED' && 'Đã hủy'}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isStatusOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div className={`absolute left-0 right-0 top-full pt-2 transition-all duration-200 ${isStatusOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-1.5 flex flex-col gap-0.5 max-h-64 overflow-y-auto">
            {[
              { value: 'ALL', label: 'Tất cả trạng thái' },
              { value: 'PENDING', label: 'Chờ xác nhận' },
              { value: 'CONFIRMED', label: 'Đã xác nhận' },
              { value: 'CHECKED_IN', label: 'Đã đến viện' },
              { value: 'IN_PROGRESS', label: 'Đang khám' },
              { value: 'WAITING_RESULT', label: 'Chờ kết quả' },
              { value: 'COMPLETED', label: 'Hoàn thành' },
              { value: 'CANCELLED', label: 'Đã hủy' },
            ].map(item => (
              <button
                key={item.value}
                onClick={() => { onStatusChange(item.value as any); setIsStatusOpen(false); }}
                className={`w-full text-left cursor-pointer py-2 px-3 text-[13.5px] font-medium rounded-xl transition-all ${
                  status === item.value ? 'bg-primary-50 text-primary-600' : 'text-slate-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};