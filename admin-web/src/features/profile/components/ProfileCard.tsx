import React from 'react';
import { Mail, Phone, MapPin, CalendarDays, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types/profile';

export default function ProfileCard({ user }: { user: UserProfile }) {
  // Lấy chữ cái đầu của tên làm Avatar
  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="w-full lg:w-80 bg-white rounded-[32px] shadow-sm border border-slate-200 p-6 flex flex-col items-center shrink-0">
      <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-[24px] flex items-center justify-center font-black text-4xl shadow-inner mb-4">
        {initial}
      </div>
      <h2 className="text-xl font-black text-slate-900 text-center">{user.fullName}</h2>
      <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-widest border border-blue-100">
        <ShieldCheck size={14}/> {user.roleName}
      </div>

      <div className="w-full h-px bg-slate-100 my-6"></div>

      <div className="w-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Mail size={14}/></div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
            <p className="text-sm font-bold text-slate-700 truncate">{user.email || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Phone size={14}/></div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số điện thoại</p>
            <p className="text-sm font-bold text-slate-700 truncate">{user.phone || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><MapPin size={14}/></div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Địa chỉ</p>
            <p className="text-sm font-bold text-slate-700 truncate">{user.address || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><CalendarDays size={14}/></div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày tham gia</p>
            <p className="text-sm font-bold text-slate-700 truncate">{user.createdAt.split('T')[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}