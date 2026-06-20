import React from 'react';
import { Calendar, User, Eye, Stethoscope, Activity, ArrowRight, CheckCircle2, Clock, Ban, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { MedicalRecord } from '../types/record';

interface MedicalHistoryTimelineProps {
  records: MedicalRecord[];
}

export const MedicalHistoryTimeline: React.FC<MedicalHistoryTimelineProps> = ({ records }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status: MedicalRecord['status']) => {
    switch (status) {
      case 'DONE':
        return { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> };
      case 'IN_PROGRESS':
        return { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: <Activity className="w-4 h-4 text-indigo-600" /> };
      case 'WAITING_RESULT':
        return { label: 'Chờ kết quả', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <FlaskConical className="w-4 h-4 text-amber-600" /> };
      case 'CANCELLED':
        return { label: 'Đã hủy', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: <Ban className="w-4 h-4 text-rose-600" /> };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Clock className="w-4 h-4 text-slate-600" /> };
    }
  };

  return (
    <div className="relative pl-4 md:pl-8 space-y-8 before:absolute before:inset-0 before:ml-6 md:before:ml-10 before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary-200 before:via-primary-100 before:to-transparent">
      {records.map((record, index) => {
        const config = getStatusConfig(record.status);
        const dateFormatted = record.createdAt && !isNaN(new Date(record.createdAt).getTime())
          ? format(new Date(record.createdAt), "dd/MM/yyyy", { locale: vi })
          : 'Không có ngày';

        return (
          <div key={record.recordId} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-4 md:-left-8 w-6 h-6 rounded-full bg-white border-4 border-primary-500 shadow-sm flex items-center justify-center top-6 group-hover:scale-125 transition-transform z-10" />

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 ml-6 md:ml-8 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                      Mã hồ sơ: <span className="text-slate-600">#{String(record.recordId).padStart(6, '0')}</span>
                    </span>
                    <div className={`px-3 py-1.5 rounded-full border text-[12.5px] font-bold flex items-center gap-1.5 ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-inner text-white font-black">
                      <Stethoscope className="w-8 h-8 opacity-80" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-black text-slate-800 text-[18px] leading-tight mb-1">
                        BS. {record.mainDoctorName}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500 text-[13px] font-medium mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {dateFormatted}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Chẩn đoán</span>
                    <p className="text-[14.5px] font-bold text-slate-700 leading-snug">{record.diagnosis}</p>
                  </div>
                </div>

                <div className="lg:w-[220px] shrink-0 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-5 lg:pt-0 lg:pl-6">
                  <Button
                    onClick={() => navigate(`/records/detail/${record.recordId}`)}
                    className="w-full h-12 rounded-xl bg-primary-50 text-primary-600 font-bold hover:bg-primary-500 hover:text-white transition-colors group/btn flex items-center justify-center gap-2"
                  >
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};