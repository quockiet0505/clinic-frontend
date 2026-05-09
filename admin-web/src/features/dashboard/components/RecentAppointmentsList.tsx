import React from 'react';

export default function RecentAppointmentsList() {
  return (
    <div className="space-y-5">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <img src={`https://i.pravatar.cc/150?img=${i+10}`} className="w-10 h-10 rounded-full border border-slate-200" alt="patient avatar" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800">Patient Name {i+1}</h4>
            <p className="text-xs text-slate-500">General Checkup</p>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
            Confirmed
          </div>
        </div>
      ))}
    </div>
  );
}