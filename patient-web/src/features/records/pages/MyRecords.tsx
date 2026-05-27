import React, { useEffect, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionContainer } from '@/components/common';
import { MedicalHistoryTimeline } from '../components/MedicalHistoryTimeline';
import { RecordFilterBar } from '../components/RecordFilterBar';
import { recordApi } from '../api/recordApi';
import type { MedicalRecord } from '../types/record';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';

type StatusFilter = 'ALL' | MedicalRecord['status'];

export const MyRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await recordApi.getMedicalHistory();
        setRecords(data);
      } catch {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải hồ sơ y tế. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chỉ chạy một lần khi mount

  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.mainDoctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-brand-dark mb-2">Hồ sơ y tế</h1>
            <p className="text-[14.5px] text-slate-500 font-medium">
              Lịch sử khám bệnh, đơn thuốc và kết quả xét nghiệm.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <RecordFilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as StatusFilter)}>
              <SelectTrigger className="w-[160px] h-12 rounded-2xl bg-white border-border-default">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-lg">
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="IN_PROGRESS">Đang xử lý</SelectItem>
                <SelectItem value="WAITING_RESULT">Chờ kết quả</SelectItem>
                <SelectItem value="DONE">Hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {filteredRecords.length > 0 ? (
          <MedicalHistoryTimeline records={filteredRecords} />
        ) : (
          <Card className="rounded-3xl border-border-default shadow-sm p-12 text-center flex flex-col items-center justify-center bg-white">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-primary-500" />
            </div>
            <h2 className="text-xl font-black text-brand-dark mb-2">Chưa có dữ liệu bệnh án</h2>
            <p className="text-slate-500 text-[15px] font-medium max-w-md">
              Hồ sơ y tế của bạn sẽ hiển thị tại đây sau khi hoàn tất khám chữa bệnh.
            </p>
          </Card>
        )}
      </SectionContainer>
    </main>
  );
};