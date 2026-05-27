import React from 'react';
import { Calendar, User, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { MedicalRecord } from '../types/record';

interface MedicalHistoryTimelineProps {
  records: MedicalRecord[];
}

export const MedicalHistoryTimeline: React.FC<MedicalHistoryTimelineProps> = ({ records }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: MedicalRecord['status']) => {
    switch (status) {
      case 'DONE':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Hoàn thành</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Đang xử lý</span>;
      case 'WAITING_RESULT':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Chờ kết quả</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Đã hủy</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {records.map((record) => (
        <Card
          key={record.recordId}
          className="rounded-2xl border-border-default shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          <div className="bg-primary-50/30 px-6 py-4 border-b border-border-default flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
              <Calendar className="w-4 h-4" />
              {record.createdAt && !isNaN(new Date(record.createdAt).getTime())
                  ? format(
                      new Date(record.createdAt),
                      "dd 'tháng' MM, yyyy",
                      { locale: vi }
                    )
                  : 'Không có ngày'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/records/detail/${record.recordId}`)}
              className="rounded-xl border-primary-500/30 text-primary-600 hover:bg-primary-50"
            >
              <Eye className="w-4 h-4 mr-1" /> Chi tiết
            </Button>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4 text-primary-500" />
                <span className="font-medium">{record.mainDoctorName}</span>
              </div>
              {getStatusBadge(record.status)}
            </div>
            <div className="space-y-1">
              <p>
                <span className="font-bold text-brand-dark">Chẩn đoán:</span> {record.diagnosis}
              </p>
              <p className="text-sm text-slate-500">Mã hồ sơ: {record.recordId}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};