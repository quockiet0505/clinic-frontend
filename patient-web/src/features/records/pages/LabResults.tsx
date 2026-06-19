/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
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
      <main className="min-h-screen bg-[#f0f9ff]">
        <div className="bg-brand-dark py-12 px-4">
          <SectionContainer className="max-w-4xl">
            <div className="h-5 bg-white/10 rounded w-32 mb-3 animate-pulse" />
            <div className="h-8 bg-white/10 rounded w-52 animate-pulse" />
          </SectionContainer>
        </div>
        <SectionContainer className="max-w-4xl py-8">
          <div className="flex flex-col gap-4">
            <div className="h-40 bg-white border border-slate-200 rounded-3xl w-full animate-pulse" />
            <div className="h-40 bg-white border border-slate-200 rounded-3xl w-full animate-pulse" />
          </div>
        </SectionContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f9ff]">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-brand-dark py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <SectionContainer className="max-w-4xl relative z-10">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-primary-400 mb-3">
            <span>Trang chủ</span><span className="text-white/20">/</span>
            <span className="text-primary-200">Kết quả xét nghiệm</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-400/30">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Kết Quả Xét Nghiệm & CLS</h1>
                <p className="text-primary-300 text-sm">Xem và tải kết quả chẩn đoán cận lâm sàng</p>
              </div>
            </div>
            <div className="w-full md:w-80 shrink-0">
              <SearchInput value={searchQuery} onSearch={setSearchQuery} placeholder="Tìm xét nghiệm, kết luận..." className="h-11 shadow-sm" />
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-4xl py-8 flex flex-col gap-6">
        {/* Toolbar: Filters - Modern Segmented Control */}
        <div className="bg-slate-100/80 p-1 rounded-[14px] border border-slate-200/60 shadow-sm flex items-center gap-1 overflow-x-auto hide-scrollbar w-full md:w-fit">
          {[
            { id: 'ALL', label: `Tất cả (${results.length})` },
            { id: 'COMPLETED', label: 'Đã có kết quả' },
            { id: 'PROCESSING', label: 'Đang xử lý' },
            { id: 'ABNORMAL', label: 'Bất thường' },
            { id: 'CLS', label: 'Chẩn đoán hình ảnh' },
            { id: 'XN', label: 'Xét nghiệm' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                filterType === tab.id 
                  ? 'bg-white text-cyan-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-slate-200/50' 
                  : 'bg-transparent text-slate-500 border border-transparent hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((result: any) => (
              <LabResultCard key={result.resultId} result={result} />
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 shadow-sm p-14 text-center flex flex-col items-center justify-center bg-white mt-2">
              <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mb-4">
                <FlaskConical className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-[17px] font-black text-brand-dark mb-2">Chưa có kết quả xét nghiệm</h2>
              <p className="text-slate-500 text-[14px] font-medium max-w-md mt-1">
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
  return { label: 'Đã có kết quả', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500' };
};

const LabResultCard: React.FC<{ result: any }> = ({ result }) => {
  const status = getStatusProps(result);
  const isAbnormal = status.label === 'Bất thường';
  
  const isImaging = result.serviceName?.toLowerCase().includes('chụp') || result.serviceName?.toLowerCase().includes('siêu âm');
  const serviceTypeLabel = isImaging ? 'Chẩn đoán hình ảnh' : 'Xét nghiệm';

  return (
    <Dialog>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 hover:shadow-md hover:border-cyan-300 transition-all group flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-start">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 shadow-inner">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 text-[10px] font-bold uppercase tracking-widest">{serviceTypeLabel}</span>
              </div>
              <h3 className="font-black text-[18px] text-brand-dark leading-tight group-hover:text-cyan-600 transition-colors">
                {result.serviceName || 'Đang cập nhật'}
              </h3>
              <p className="text-slate-500 text-[13px] font-medium mt-1">
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
          <div className="mt-1 p-4 rounded-xl border ml-0 md:ml-[72px] bg-slate-50 border-slate-200 relative overflow-hidden">
            <p className="text-[13px] text-slate-600 font-medium leading-relaxed line-clamp-2" title={result.conclusion}>
              {isAbnormal && <span className="font-bold text-amber-600 mr-1">⚠️ Bất thường.</span>}
              <span className="font-bold text-brand-dark">Kết luận:</span> {result.conclusion}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-between items-center pt-5 mt-1 border-t border-slate-100 pl-0 md:pl-[72px]">
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
             <button className="flex-1 md:flex-none justify-center flex items-center gap-2 text-[13px] font-bold text-slate-600 bg-white border border-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
              <Download className="w-4 h-4" /> Tải PDF
             </button>
             <DialogTrigger asChild>
               <button className="flex-1 md:flex-none justify-center flex items-center gap-2 text-[13px] font-bold text-white bg-cyan-500 border border-transparent px-5 py-2.5 rounded-xl hover:bg-cyan-600 transition-colors cursor-pointer shadow-sm active:scale-[0.98]">
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
