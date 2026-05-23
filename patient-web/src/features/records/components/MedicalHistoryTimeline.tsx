import React from 'react';
import { Calendar, User, FileText, MapPin, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PrescriptionDetailModal } from './PrescriptionDetailModal';
import { LabResultViewerModal } from './LabResultViewerModal';
import type { MedicalRecord } from '../types/record';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const MedicalHistoryTimeline: React.FC<{ records: MedicalRecord[] }> = ({ records }) => {
  const navigate = useNavigate();
  if (records.length === 0) return null;

  return (
    <div className="relative border-l-2 border-primary-500/20 ml-3 md:ml-6 space-y-10 py-4">
      {records.map((record) => (
        <div key={record.id} className="relative pl-8 md:pl-12">
          {/* Timeline Node */}
          <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-white border-4 border-primary-500 shadow-sm"></div>

          <Card className="rounded-3xl border-border-default shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
            <div className="bg-background-light px-6 py-4 border-b border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-primary-600 font-black text-[16px]">
                <Calendar className="w-5 h-5" />
                {format(new Date(record.visitDate), "dd 'tháng' MM, yyyy", { locale: vi })}
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white border border-border-default text-xs font-bold text-slate-500">
                  Mã BA: {record.id}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/records/detail/${record.id}`)} className="text-primary-500 hover:text-primary-600 hover:bg-primary-50 font-bold h-8">
                   <Eye className="w-4 h-4 mr-1"/> Xem chi tiết
                </Button>
              </div>
            </div>

            <CardContent className="p-6 md:p-8 flex flex-col gap-6">
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-[14.5px] font-medium text-slate-600 pb-6 border-b border-border-default">
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary-500" /> <span className="text-brand-dark font-bold">{record.doctorName}</span> ({record.specialty})</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500" /> {record.facility}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Triệu chứng lâm sàng</span>
                  <p className="text-brand-dark text-[15px] leading-relaxed">{record.symptoms}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Chẩn đoán</span>
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <p className="text-brand-dark font-bold text-[15px] leading-relaxed">{record.diagnosis}</p>
                  </div>
                </div>
              </div>

              {record.notes && (
                <div className="bg-warning/10 border border-warning/20 p-4 rounded-2xl text-[14.5px] text-brand-dark">
                  <span className="font-bold text-warning mr-2">Lời dặn:</span> {record.notes}
                </div>
              )}

              {/* Import các component nhỏ vào đây */}
              {(record.prescriptions || record.labResults) && (
                <div className="flex flex-wrap gap-4 pt-2">
                  {record.prescriptions && <PrescriptionDetailModal items={record.prescriptions} />}
                  {record.labResults && <LabResultViewerModal items={record.labResults} />}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};