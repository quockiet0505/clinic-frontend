import React from 'react';
import { CalendarDays, Stethoscope, FileText, Activity } from 'lucide-react';

interface VisitRecord {
  record_id: number;
  date: string;
  doctor: string;
  diagnosis: string;
  treatment?: string;
}

interface Props {
  visits: VisitRecord[];
}

export default function PatientHistoryTimeline({ visits }: Props) {
  if (!visits || visits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-400">
        <Activity size={32} className="mb-2 opacity-50" />
        <p className="font-medium text-sm">No clinical history found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      {/* Vertical Line */}
      <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-100"></div>

      <div className="space-y-6 relative">
        {visits.map((visit, index) => (
          <div key={visit.record_id} className="flex gap-4 relative">
            {/* Timeline Dot / Icon */}
            <div className="w-10 h-10 rounded-full bg-blue-50 border-[3px] border-white text-blue-600 flex items-center justify-center shrink-0 z-10 shadow-sm mt-1">
              <CalendarDays size={16} />
            </div>

            {/* Content Card */}
            <div className="bg-slate-50 rounded-2xl p-4 flex-1 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{visit.diagnosis}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">{visit.date}</p>
                </div>
                <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Stethoscope size={12} className="text-blue-500"/> {visit.doctor}
                </span>
              </div>
              
              {visit.treatment && (
                <div className="mt-3 text-sm font-medium text-slate-600 bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2">
                  <FileText size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <p>{visit.treatment}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}