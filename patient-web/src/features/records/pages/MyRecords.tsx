import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionContainer } from '@/components/common';
import { MedicalHistoryTimeline } from '../components/MedicalHistoryTimeline';
import { RecordFilterBar } from '../components/RecordFilterBar';
import { recordApi } from '../api/recordApi';
import type { MedicalRecord } from '../types/record';

export const MyRecords: React.FC = () => {
  // Khởi tạo state không cần biến isLoading
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Gọi API ngầm phía sau, dữ liệu có sẽ tự động render không cần xoay loading
    const fetchRecords = async () => {
      try {
        const data = await recordApi.getMedicalHistory();
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch records', error);
      }
    };
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record => 
    record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="w-full min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-5xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-brand-dark mb-2">Hồ sơ y tế</h1>
            <p className="text-[14.5px] text-slate-500 font-medium">Lịch sử khám bệnh, đơn thuốc và kết quả xét nghiệm của bạn.</p>
          </div>
          
          <RecordFilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        {/* Xóa khối Loading, render thẳng dữ liệu hoặc giao diện trống */}
        {filteredRecords.length > 0 ? (
          <MedicalHistoryTimeline records={filteredRecords} />
        ) : (
          <Card className="rounded-3xl border-border-default shadow-sm p-12 text-center flex flex-col items-center justify-center bg-white">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-primary-500" />
            </div>
            <h2 className="text-xl font-black text-brand-dark mb-2">Chưa có dữ liệu bệnh án</h2>
            <p className="text-slate-500 text-[15px] font-medium max-w-md">
              Hồ sơ y tế của bạn (nếu có) sẽ hiển thị tại đây sau khi hoàn tất quá trình khám chữa bệnh tại cơ sở y tế.
            </p>
          </Card>
        )}

      </SectionContainer>
    </main>
  );
};