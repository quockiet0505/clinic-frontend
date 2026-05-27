import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { recordApi } from '../api/recordApi';
import type { MedicalRecordDetail } from '../types/record';
import { PrescriptionDetailModal } from '../components/PrescriptionDetailModal';
import { LabResultViewerModal } from '../components/LabResultViewerModal';
import { useToast } from '@/hooks/useToast';

export const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await recordApi.getRecordDetail(Number(id));
        setRecord(data);
      } catch {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải chi tiết hồ sơ. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // chạy lại khi id thay đổi

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <Card className="p-8 text-center">
          <p className="text-red-500">Không tìm thấy hồ sơ bệnh án.</p>
          <Link to="/records" className="mt-4 inline-block text-primary-500 hover:underline">
            Quay lại danh sách
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <main className="bg-background-light py-10 min-h-screen">
      <SectionContainer className="max-w-4xl">
        <Link to="/records" className="flex items-center gap-2 text-slate-500 hover:text-primary-500 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Quay lại
        </Link>
        <Card className="rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-primary-50/30 px-6 py-4 border-b border-border-default">
            <h1 className="text-2xl font-black text-brand-dark">Bệnh án #{record.recordId}</h1>
            <p className="text-slate-500 text-sm mt-1">
              Ngày khám: {new Date(record.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase">Bác sĩ điều trị</h3>
                <p className="text-brand-dark font-medium">{record.mainDoctorName}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase">Trạng thái</h3>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-700">
                  {record.status === 'DONE' ? 'Hoàn thành' :
                   record.status === 'IN_PROGRESS' ? 'Đang xử lý' :
                   record.status === 'WAITING_RESULT' ? 'Chờ kết quả' : 'Đã hủy'}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase">Chẩn đoán</h3>
              <p className="text-brand-dark">{record.diagnosis}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase">Điều trị</h3>
              <p className="text-brand-dark whitespace-pre-wrap">{record.treatment}</p>
            </div>
            {record.note && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase">Ghi chú</h3>
                <p className="text-slate-600">{record.note}</p>
              </div>
            )}
            {record.prescription && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Đơn thuốc</h3>
                <PrescriptionDetailModal prescription={record.prescription} />
              </div>
            )}
            {record.serviceOrders.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Xét nghiệm & chỉ định</h3>
                <LabResultViewerModal serviceOrders={record.serviceOrders} />
              </div>
            )}
          </CardContent>
        </Card>
      </SectionContainer>
    </main>
  );
};