// features/profile/components/ProfileCard.tsx
import React from 'react';
import { Mail, Phone, MapPin, CalendarDays, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types/profile';

export default function ProfileCard({ user }: { user: UserProfile }) {
  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center shrink-0">
      <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-4xl shadow-inner mb-4">
        {initial}
      </div>
      <h2 className="text-xl font-bold text-slate-800 text-center">{user.fullName}</h2>
      <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
        <ShieldCheck size={14} /> {user.roleName}
      </div>

      <div className="w-full h-px bg-slate-100 my-6"></div>

      <div className="w-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <Mail size={14} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold text-slate-500">Email</p>
            <p className="text-sm font-medium text-slate-700 truncate">{user.email || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <Phone size={14} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold text-slate-500">Số điện thoại</p>
            <p className="text-sm font-medium text-slate-700 truncate">{user.phone || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <MapPin size={14} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold text-slate-500">Địa chỉ</p>
            <p className="text-sm font-medium text-slate-700 truncate">{user.address || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <CalendarDays size={14} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold text-slate-500">Ngày tham gia</p>
            <p className="text-sm font-medium text-slate-700 truncate">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Chưa có'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}