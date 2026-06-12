/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { FlaskConical, UserRound, ChevronRight, Download, Stethoscope } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { SectionContainer } from '@/components/common';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { LabResultModalContent } from '../components/LabResultModalContent';

export const LabResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  React.useEffect(() => {
    const fetchResults = async () => {
      try {
        const { recordApi } = await import('../api/recordApi');
        const [labData, recordsData] = await Promise.all([
          recordApi.getLabResults(),
          recordApi.getMedicalHistory().catch(() => [])
        ]);
        
        const recordsMap = new Map(recordsData.map((r: any) => [r.recordId, r]));
        const enriched = labData.map((r: any) => ({
          ...r,
          doctorName: recordsMap.get(r.recordId)?.mainDoctorName || 'Bác sĩ chỉ định',
          diagnosis: recordsMap.get(r.recordId)?.diagnosis || 'Chưa cập nhật chẩn đoán',
        }));
        
        setResults(enriched);
      } catch (error) {
        console.error('Failed to fetch lab results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredResults = results.filter((r: any) => {
    const sName = (r.serviceName || 'Xét nghiệm cận lâm sàng').toLowerCase();
    const isAbnormal = (r.resultData?.toLowerCase().includes('bất thường') || r.conclusion?.toLowerCase().includes('bất thường'));
    const isCompleted = !!r.resultData;

    const matchSearch = r.resultData?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.conclusion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sName.includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    switch (filterType) {
      case 'COMPLETED': return isCompleted;
      case 'PROCESSING': return !isCompleted;
      case 'ABNORMAL': return isAbnormal;
      case 'CLS': return sName.includes('siêu âm') || sName.includes('x-quang') || sName.includes('nội soi') || sName.includes('mri');
      case 'XN': return sName.includes('máu') || sName.includes('nước tiểu') || sName.includes('xét nghiệm') || sName.includes('sinh hóa');
      default: return true;
    }
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <SectionContainer className="max-w-4xl space-y-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="h-14 bg-slate-200 rounded-2xl w-full mb-4"></div>
            <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
            <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
          </div>
        </SectionContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <SectionContainer className="max-w-4xl py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-400 mb-1">
                <span>Trang chủ</span>
                <span>/</span>
                <span className="text-primary-600">Kết quả xét nghiệm</span>
              </div>
              <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary-600" />
                Kết Quả Xét Nghiệm & CLS
              </h1>
            </div>
            <div className="w-full md:w-72">
              <SearchInput value={searchQuery} onSearch={setSearchQuery} placeholder="Tìm xét nghiệm, kết luận..." className="h-10" />
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-4xl py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'COMPLETED', label: 'Đã có kết quả' },
              { id: 'PROCESSING', label: 'Đang xử lý' },
              { id: 'ABNORMAL', label: 'Bất thường' },
              { id: 'CLS', label: 'Chẩn đoán hình ảnh' },
              { id: 'XN', label: 'Xét nghiệm' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === tab.id 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((result: any) => (
              <LabResultCard key={result.resultId} result={result} />
            ))
          ) : (
            <div className="rounded-2xl border border-slate-100 shadow-sm p-14 text-center flex flex-col items-center justify-center bg-white mt-4">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <FlaskConical className="w-10 h-10 text-teal-400" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Chưa có kết quả xét nghiệm</h2>
              <p className="text-slate-500 text-[14px] font-medium max-w-md">
                Hiện tại bạn chưa có kết quả xét nghiệm nào hoặc không có kết quả khớp với bộ lọc.
              </p>
            </div>
          )}
        </div>
      </SectionContainer>
    </main>
  );
};

const getStatusProps = (result: any) => {
  const data = result.resultData?.toLowerCase() || '';
  const conclusion = result.conclusion?.toLowerCase() || '';
  
  if (data.includes('bất thường') || conclusion.includes('bất thường') || data.includes('cao') || data.includes('thấp')) {
    return { label: 'Bất thường', color: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' };
  }
  if (!result.resultData && !result.conclusion) {
    return { label: 'Đang xử lý', color: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500' };
  }
  return { label: 'Đã có kết quả', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' };
};

const LabResultCard: React.FC<{ result: any }> = ({ result }) => {
  const status = getStatusProps(result);
  const isAbnormal = status.label === 'Bất thường';
  
  const isImaging = result.serviceName?.toLowerCase().includes('chụp') || result.serviceName?.toLowerCase().includes('siêu âm');
  const serviceTypeLabel = isImaging ? 'Chẩn đoán hình ảnh' : 'Xét nghiệm';

  return (
    <Dialog>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 hover:shadow-md hover:border-cyan-200 transition-all group flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-start">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 shadow-inner">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-bold uppercase tracking-wider">{serviceTypeLabel}</span>
              </div>
              <h3 className="font-black text-[18px] text-slate-800 leading-tight group-hover:text-cyan-600 transition-colors">
                {result.serviceName || 'Đang cập nhật'}
              </h3>
              <p className="text-slate-500 text-[13.5px] font-medium mt-1">
                Mã XN: #{String(result.resultId).padStart(5, '0')} • {new Date(result.enteredAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full border text-[12px] font-bold flex items-center gap-1.5 shrink-0 ${status.color}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isAbnormal ? 'animate-pulse' : ''} ${status.dot}`} />
            {status.label}
          </div>
        </div>

        {result.conclusion && (
          <div className="mt-2 p-4 rounded-xl border ml-0 md:ml-[72px] bg-slate-50 border-slate-100 relative overflow-hidden">
            <p className="text-[14px] text-slate-600 font-medium leading-relaxed line-clamp-2" title={result.conclusion}>
              {isAbnormal && <span className="font-bold text-amber-600 mr-1">⚠️ Bất thường.</span>}
              <span className="font-bold text-slate-700">Kết luận:</span> {result.conclusion}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-between items-center pt-5 mt-2 border-t border-slate-100 pl-0 md:pl-[72px]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2 text-[14px] text-slate-600">
              <UserRound className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-bold">BS. {result.doctorName || 'Đang cập nhật'}</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-slate-600">
              <Stethoscope className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium text-[13px]">KTV: {result.technicianName || 'Đang cập nhật'}</span>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none justify-center flex items-center gap-2 text-[13px] font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
              <Download className="w-4 h-4" /> Tải PDF
             </button>
             <DialogTrigger asChild>
               <button className="flex-1 md:flex-none justify-center flex items-center gap-2 text-[13px] font-bold text-white bg-cyan-500 border border-transparent px-4 py-2.5 rounded-xl hover:bg-cyan-600 transition-colors cursor-pointer shadow-sm shadow-cyan-200">
                 Xem kết quả <ChevronRight className="w-4 h-4" />
               </button>
             </DialogTrigger>
          </div>
        </div>
      </div>
      <LabResultModalContent result={result} />
    </Dialog>
  );
};
