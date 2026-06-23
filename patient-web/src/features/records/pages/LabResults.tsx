/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  UserRound,
  ChevronRight,
  FileText,
  Stethoscope,
  CalendarDays,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { SectionContainer, DateFilter } from '@/components/common';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { LabResultModalContent } from '../components/LabResultModalContent';
import { formatDoctorName } from '@/utils/generatePdf';

type StatusTab = 'ALL' | 'COMPLETED' | 'PROCESSING';
type TypeFilter = 'ALL' | 'CLS' | 'XN';

const isImagingService = (name: string) =>
  name.includes('siêu âm') ||
  name.includes('x-quang') ||
  name.includes('nội soi') ||
  name.includes('mri') ||
  name.includes('chụp') ||
  name.includes('ct');

const isLabService = (name: string) =>
  name.includes('máu') ||
  name.includes('nước tiểu') ||
  name.includes('xét nghiệm') ||
  name.includes('sinh hóa') ||
  name.includes('huyết học');

export const LabResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<StatusTab>('ALL');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const serviceTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const handleServiceEnter = () => {
    if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current);
    setIsServiceOpen(true);
  };
  const handleServiceLeave = () => {
    serviceTimeoutRef.current = setTimeout(() => setIsServiceOpen(false), 150);
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { recordApi } = await import('../api/recordApi');
        const labData = await recordApi.getLabResults();

        const initialEnriched = labData.map((r: any) => ({
          ...r,
          doctorName: r.doctorName || 'Bác sĩ chỉ định',
          diagnosis: 'Chưa cập nhật chẩn đoán',
        }));
        setResults(initialEnriched);
        setLoading(false);

        recordApi
          .getMedicalHistory()
          .then(async (recordsData) => {
            const recordsMap = new Map<any, any>(
              recordsData.map((r: any) => [r.recordId, r] as [any, any]),
            );
            const orderToRecordId = new Map<number, number>();

            await Promise.all(
              recordsData.map(async (rec: any) => {
                try {
                  const detail = await recordApi.getRecordDetail(rec.recordId);
                  detail.serviceOrders.forEach((o) => {
                    orderToRecordId.set(o.orderId, rec.recordId);
                  });
                } catch {
                  /* bỏ qua hồ sơ không truy cập được */
                }
              }),
            );

            setResults((prev) =>
              prev.map((r) => {
                const recordId = orderToRecordId.get(r.orderId);
                const rec = recordId ? recordsMap.get(recordId) : undefined;
                return {
                  ...r,
                  recordId,
                  doctorName: rec?.mainDoctorName || r.doctorName,
                  diagnosis: rec?.diagnosis || r.diagnosis,
                };
              }),
            );
          })
          .catch(() => {});
      } catch (error) {
        console.error('Failed to fetch lab results:', error);
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const stats = React.useMemo(() => {
    let completed = 0;
    let processing = 0;
    results.forEach((r) => {
      if (r.resultData) completed++;
      else processing++;
    });
    return { total: results.length, completed, processing };
  }, [results]);

  const filteredResults = results.filter((r: any) => {
    const sName = (r.serviceName || 'Xét nghiệm cận lâm sàng').toLowerCase();
    const isCompleted = !!r.resultData;
    const matchSearch =
      r.resultData?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.conclusion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sName.includes(searchQuery.toLowerCase());

    let matchDate = true;
    if (fromDate) matchDate = matchDate && new Date(r.enteredAt) >= new Date(fromDate);
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      matchDate = matchDate && new Date(r.enteredAt) <= end;
    }
    if (!matchSearch || !matchDate) return false;

    if (statusTab === 'COMPLETED' && !isCompleted) return false;
    if (statusTab === 'PROCESSING' && isCompleted) return false;

    if (typeFilter === 'CLS' && !isImagingService(sName)) return false;
    if (typeFilter === 'XN' && !isLabService(sName)) return false;

    return true;
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f9ff]">
        <div className="bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-12 px-4">
          <SectionContainer className="max-w-4xl">
            <div className="h-5 bg-white/10 rounded w-32 mb-3 animate-pulse" />
            <div className="h-8 bg-white/10 rounded w-52 animate-pulse" />
          </SectionContainer>
        </div>
        <SectionContainer className="max-w-4xl py-8">
          <div className="flex flex-col gap-3">
            <div className="h-24 bg-white border border-slate-200 rounded-2xl w-full animate-pulse" />
            <div className="h-24 bg-white border border-slate-200 rounded-2xl w-full animate-pulse" />
            <div className="h-24 bg-white border border-slate-200 rounded-2xl w-full animate-pulse" />
          </div>
        </SectionContainer>
      </main>
    );
  }

  const tabs: { id: StatusTab; label: string; count: number }[] = [
    { id: 'ALL', label: 'Tất cả', count: stats.total },
    { id: 'COMPLETED', label: 'Đã có kết quả', count: stats.completed },
    { id: 'PROCESSING', label: 'Đang xử lý', count: stats.processing },
  ];

  return (
    <main className="min-h-screen bg-[#f0f9ff]">
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <SectionContainer className="max-w-4xl relative z-10">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-3">
            <Link to="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span className="text-white/40">/</span>
            <Link to="/records/history" className="hover:text-white transition-colors">
              Hồ sơ y tế
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white">Kết quả CLS</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  Kết Quả Xét Nghiệm & CLS
                </h1>
                <p className="text-white/90 text-sm drop-shadow-sm">
                  Xem kết quả chẩn đoán cận lâm sàng — tải PDF tại trang chi tiết bệnh án
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="w-full sm:w-72 shrink-0">
                <SearchInput
                  value={searchQuery}
                  onSearch={setSearchQuery}
                  placeholder="Tìm xét nghiệm, kết luận..."
                  className="h-11 shadow-md border-transparent bg-white text-slate-700 placeholder:text-slate-400 focus-within:ring-4 focus-within:ring-white/20"
                />
              </div>
              <DateFilter
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onClear={() => {
                  setFromDate('');
                  setToDate('');
                }}
              />
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-4xl py-8 flex flex-col gap-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shadow-sm inline-flex items-center gap-1 w-full sm:w-fit overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  statusTab === tab.id
                    ? 'bg-white text-primary-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-slate-200/50'
                    : 'bg-transparent text-slate-500 border border-transparent hover:text-slate-700'
                }`}
              >
                {tab.label}
                <span
                  className={`tabular-nums text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                    statusTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-slate-200/60 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div 
            className="w-full sm:w-56 shrink-0 relative z-50"
            onMouseEnter={handleServiceEnter}
            onMouseLeave={handleServiceLeave}
          >
            <button className={`w-full h-10 flex items-center justify-between px-4 rounded-xl bg-white border shadow-sm font-semibold text-[13px] text-slate-700 cursor-pointer transition-colors ${isServiceOpen ? 'border-primary-500 text-primary-600 ring-2 ring-primary-500/20' : 'border-slate-200'}`}>
              <span>
                {typeFilter === 'ALL' && 'Tất cả loại'}
                {typeFilter === 'CLS' && 'Chẩn đoán hình ảnh'}
                {typeFilter === 'XN' && 'Xét nghiệm'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isServiceOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div className={`absolute left-0 right-0 top-full pt-2 transition-all duration-200 ${isServiceOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <div className="rounded-xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-1.5 flex flex-col gap-0.5">
                {[
                  { value: 'ALL', label: 'Tất cả loại' },
                  { value: 'CLS', label: 'Chẩn đoán hình ảnh' },
                  { value: 'XN', label: 'Xét nghiệm' },
                ].map(item => (
                  <button
                    key={item.value}
                    onClick={() => { setTypeFilter(item.value as TypeFilter); setIsServiceOpen(false); }}
                    className={`w-full text-left cursor-pointer py-2 px-3 text-[13px] font-medium rounded-lg transition-all ${
                      typeFilter === item.value ? 'bg-primary-50 text-primary-600' : 'text-slate-700 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {filteredResults.length > 0 ? (
            filteredResults.map((result: any) => (
              <LabResultCard key={result.resultId} result={result} />
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center bg-white">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-3">
                <FlaskConical className="w-8 h-8 text-primary-400" />
              </div>
              <h2 className="text-[16px] font-black text-brand-dark mb-1">
                Chưa có kết quả xét nghiệm
              </h2>
              <p className="text-slate-500 text-[13px] font-medium max-w-md">
                Không có kết quả khớp với bộ lọc hiện tại.
              </p>
            </div>
          )}
        </div>
      </SectionContainer>
    </main>
  );
};

const LabResultCard: React.FC<{ result: any }> = ({ result }) => {
  const isCompleted = !!result.resultData;
  const isImaging = isImagingService((result.serviceName || '').toLowerCase());
  const isAbnormal =
    result.resultData?.toLowerCase().includes('bất thường') ||
    result.conclusion?.toLowerCase().includes('bất thường');

  const status = isCompleted
    ? isAbnormal
      ? {
          label: 'Bất thường',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: <CheckCircle2 className="w-3 h-3" />,
        }
      : {
          label: 'Đã có kết quả',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3 h-3" />,
        }
    : {
        label: 'Đang xử lý',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        icon: <Loader2 className="w-3 h-3 animate-spin" />,
      };

  return (
    <Dialog>
      <article className="bg-white rounded-2xl border border-slate-200 hover:border-primary-200 hover:shadow-sm transition-all p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-sm">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-[15px] text-slate-900 leading-snug truncate">
                {result.serviceName || 'Đang cập nhật'}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold shrink-0 ${status.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  {isImaging ? 'CĐHA' : 'XN'}
                </span>
                #{String(result.resultId).padStart(5, '0')}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {new Date(result.enteredAt).toLocaleDateString('vi-VN')}
              </span>
              <span className="inline-flex items-center gap-1">
                <UserRound className="w-3 h-3" />
                {formatDoctorName(result.doctorName)}
              </span>
              {(result.technicianName || result.enteredByName) && (
                <span className="inline-flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  KTV: {result.technicianName || result.enteredByName}
                </span>
              )}
            </div>
          </div>
        </div>

        {result.conclusion && (
          <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-[13px] text-slate-600 leading-relaxed line-clamp-2">
            {isAbnormal && <span className="font-bold text-amber-600 mr-1">⚠️</span>}
            <span className="font-bold text-slate-700">Kết luận:</span> {result.conclusion}
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-end pt-1">
          {result.recordId && (
            <Link
              to={`/records/detail/${result.recordId}`}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Bệnh án
            </Link>
          )}
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white bg-primary-500 border border-transparent px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
              Xem kết quả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </DialogTrigger>
        </div>
      </article>

      <LabResultModalContent result={result} />
    </Dialog>
  );
};
