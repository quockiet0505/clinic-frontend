import React, { useEffect, useState, useRef } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionContainer } from '@/components/common';
import { MedicalHistoryTimeline } from '../components/MedicalHistoryTimeline';
import { recordApi } from '../api/recordApi';
import type { MedicalRecord } from '../types/record';
import { SearchInput } from '@/components/common/SearchInput';
import { useToast } from '@/hooks/useToast';

type StatusFilter = 'ALL' | MedicalRecord['status'];

export const MyRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleSelect = (val: StatusFilter) => {
    setStatusFilter(val);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await recordApi.getMedicalHistory();
        setRecords(data);
      } catch (error: any) {
        console.error('Failed to fetch medical records:', error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.mainDoctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-background-light py-10">
        <SectionContainer className="max-w-5xl">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="h-12 bg-slate-200 rounded-xl w-full mb-8"></div>
            <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
            <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
          </div>
        </SectionContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f9ff]">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <SectionContainer className="max-w-5xl relative z-10">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-3">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => window.location.href = '/'}>Trang chủ</span>
            <span className="text-white/40">/</span>
            <span className="text-white">Hồ sơ y tế</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Hồ Sơ Y Tế</h1>
                <p className="text-white/90 text-sm drop-shadow-sm">Lịch sử khám bệnh, đơn thuốc và kết quả xét nghiệm.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto shrink-0">
              <div className="w-full sm:w-64">
                <SearchInput
                  value={searchQuery}
                  onSearch={setSearchQuery}
                  placeholder="Tìm theo bác sĩ, chẩn đoán..."
                  className="h-11 shadow-md border-transparent bg-white text-slate-700 placeholder:text-slate-400 focus-within:ring-4 focus-within:ring-white/20"
                />
              </div>
              <div 
                className="w-full sm:w-44 shrink-0 relative z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className={`w-full h-11 flex items-center justify-between px-4 rounded-xl bg-white border shadow-sm font-medium text-slate-700 cursor-pointer transition-colors ${isOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200'}`}>
                  <span className="text-[14px]">
                    {statusFilter === 'ALL' && 'Tất cả trạng thái'}
                    {statusFilter === 'IN_PROGRESS' && 'Đang xử lý'}
                    {statusFilter === 'WAITING_RESULT' && 'Chờ kết quả'}
                    {statusFilter === 'DONE' && 'Hoàn thành'}
                    {statusFilter === 'CANCELLED' && 'Đã hủy'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div className={`absolute left-0 right-0 top-full pt-1.5 transition-all duration-200 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  <div className="rounded-xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-1.5 flex flex-col gap-0.5 max-h-64 overflow-y-auto">
                    {[
                      { value: 'ALL', label: 'Tất cả trạng thái' },
                      { value: 'IN_PROGRESS', label: 'Đang xử lý' },
                      { value: 'WAITING_RESULT', label: 'Chờ kết quả' },
                      { value: 'DONE', label: 'Hoàn thành' },
                      { value: 'CANCELLED', label: 'Đã hủy' },
                    ].map(item => (
                      <button
                        key={item.value}
                        onClick={() => handleSelect(item.value as StatusFilter)}
                        className={`w-full text-left cursor-pointer py-2 px-3 text-[13.5px] font-medium rounded-lg transition-all ${
                          statusFilter === item.value ? 'bg-primary-50 text-primary-600' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-5xl py-8">
        {filteredRecords.length > 0 ? (
          <MedicalHistoryTimeline records={filteredRecords} />
        ) : (
          <Card className="rounded-3xl border-border-default shadow-sm p-12 text-center flex flex-col items-center justify-center bg-white">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-cyan-100 rounded-full flex items-center justify-center mb-4 shadow-inner border border-white">
              <FileText className="w-10 h-10 text-cyan-600 drop-shadow-sm" />
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