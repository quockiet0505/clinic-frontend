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
  ScanLine,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { SectionContainer, DateFilter } from '@/components/common';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { LabResultModalContent } from '../components/LabResultModalContent';
import { RecordCardMeta, RecordStatusBadge } from '../components/RecordCardMeta';
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
          .catch(() => { });
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
          <div className="flex flex-col gap-4">
            <div className="h-[220px] bg-white border border-slate-200 rounded-3xl w-full animate-pulse" />
            <div className="h-[220px] bg-white border border-slate-200 rounded-3xl w-full animate-pulse" />
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 mb-2">
          <div className="flex w-full sm:w-fit overflow-x-auto hide-scrollbar gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`relative pb-3 text-[14px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 border-b-2 ${statusTab === tab.id
                  ? 'text-primary-600 border-primary-600'
                  : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`tabular-nums text-[11px] font-black px-2 py-0.5 rounded-full transition-colors ${statusTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'bg-slate-100 text-slate-500'
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div
            className="w-full sm:w-56 shrink-0 relative z-50 mb-3 sm:mb-0"
            onMouseEnter={handleServiceEnter}
            onMouseLeave={handleServiceLeave}
          >
            <button
              type="button"
              className={`w-full h-10 flex items-center justify-between px-4 rounded-xl bg-white border shadow-sm font-semibold text-[13px] text-slate-700 cursor-pointer transition-all ${isServiceOpen
                ? 'border-primary-300 text-primary-600 shadow-primary-500/10'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              <span>
                {typeFilter === 'ALL' && 'Tất cả loại'}
                {typeFilter === 'CLS' && 'Chẩn đoán hình ảnh'}
                {typeFilter === 'XN' && 'Xét nghiệm'}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isServiceOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className={`absolute left-0 right-0 top-full pt-2 transition-all duration-200 ${isServiceOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                }`}
            >
              <div className="rounded-xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-1.5 flex flex-col gap-0.5">
                {[
                  { value: 'ALL', label: 'Tất cả loại' },
                  { value: 'CLS', label: 'Chẩn đoán hình ảnh' },
                  { value: 'XN', label: 'Xét nghiệm' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setTypeFilter(item.value as TypeFilter);
                      setIsServiceOpen(false);
                    }}
                    className={`w-full text-left cursor-pointer py-2 px-3 text-[13px] font-medium rounded-lg transition-all ${typeFilter === item.value
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-700 hover:bg-primary-50 hover:text-primary-600'
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
        <div className="flex flex-col gap-4">
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
  const [isExpanded, setIsExpanded] = useState(false);

  const isCompleted = !!result.resultData;
  const serviceName = result.serviceName || 'Xét nghiệm cận lâm sàng';
  const isImaging = isImagingService(serviceName.toLowerCase());
  const isAbnormal =
    result.resultData?.toLowerCase().includes('bất thường') ||
    result.conclusion?.toLowerCase().includes('bất thường');

  const status = isCompleted
    ? isAbnormal
      ? {
        label: 'Bất thường',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        hint: 'Có chỉ số cần theo dõi thêm. Vui lòng xem chi tiết và tái khám nếu bác sĩ yêu cầu.',
        previewClass: 'bg-amber-50/80 border-amber-100',
        previewTitleClass: 'text-amber-800',
      }
      : {
        label: 'Đã có kết quả',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        hint: 'Kết quả đã sẵn sàng. Bạn có thể xem chi tiết hoặc mở bệnh án liên quan.',
        previewClass: 'bg-emerald-50/60 border-emerald-100',
        previewTitleClass: 'text-emerald-800',
      }
    : {
      label: 'Đang xử lý',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
      hint: 'Phòng xét nghiệm đang xử lý. Kết quả sẽ được cập nhật khi hoàn tất.',
      previewClass: 'bg-blue-50/60 border-blue-100',
      previewTitleClass: 'text-blue-800',
    };

  const enteredDate = new Date(result.enteredAt).toLocaleDateString('vi-VN');
  const technicianName = result.technicianName || result.enteredByName;

  return (
    <Dialog>
      <article className={`group bg-white rounded-3xl border shadow-sm transition-all overflow-hidden ${isExpanded ? 'border-primary-200 shadow-md' : 'border-slate-200/80 hover:border-primary-200/60 hover:shadow-md'}`}>

        {/* Accordion Header (Always Visible) */}
        <div
          className="p-5 md:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isImaging
                ? 'bg-violet-50 text-violet-600'
                : 'bg-primary-50 text-primary-600'
                }`}
            >
              {isImaging ? <ScanLine className="w-6 h-6" /> : <FlaskConical className="w-6 h-6" />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 text-[12px] font-semibold tracking-wide text-slate-500 mb-1">
                <span className={isImaging ? "text-violet-600 font-bold" : "text-primary-600 font-bold"}>
                  {isImaging ? 'Chẩn đoán hình ảnh' : 'Xét nghiệm'}
                </span>
                <span>•</span>
                <span>#{String(result.resultId).padStart(5, '0')}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{enteredDate}</span>
              </div>
              <h3 className="font-bold text-[16px] sm:text-[17px] text-slate-900 leading-snug truncate group-hover:text-primary-600 transition-colors">
                {serviceName}
              </h3>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
            <RecordStatusBadge
              label={status.label}
              className={`${status.color}`}
              icon={status.icon}
            />
            <div className={`hidden sm:flex w-9 h-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-primary-50 text-primary-600' : 'group-hover:bg-slate-100'}`}>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Accordion Body */}
        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-5 md:p-6 pt-0 md:pt-0 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-4 mt-2 sm:mt-5">
                  <RecordCardMeta icon={CalendarDays} label="Ngày trả KQ" value={enteredDate} />
                  <RecordCardMeta
                    icon={UserRound}
                    label="Bác sĩ chỉ định"
                    value={formatDoctorName(result.doctorName)}
                  />
                  {technicianName ? (
                    <RecordCardMeta
                      icon={Stethoscope}
                      label="Kỹ thuật viên"
                      value={technicianName}
                      className="sm:col-span-2 xl:col-span-1"
                    />
                  ) : null}
                </div>

                <div className={`rounded-2xl border p-4 ${status.previewClass}`}>
                  <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${status.previewTitleClass}`}>
                    {isCompleted ? 'Kết luận' : 'Trạng thái xử lý'}
                  </p>
                  {result.conclusion ? (
                    <p className="text-[14px] text-slate-700 leading-relaxed line-clamp-3">
                      {result.conclusion}
                    </p>
                  ) : isCompleted && result.resultData ? (
                    <p className="text-[14px] text-slate-700 leading-relaxed line-clamp-3">
                      {result.resultData}
                    </p>
                  ) : (
                    <p className="text-[14px] text-slate-500 leading-relaxed">
                      Mẫu đang được phân tích. Vui lòng quay lại sau hoặc theo dõi thông báo từ phòng khám.
                    </p>
                  )}
                </div>
              </div>

              <div className="lg:w-[272px] shrink-0 bg-slate-50/90 border-t lg:border-t-0 lg:border-l border-slate-100 p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{status.hint}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 text-[13px] font-bold text-white bg-primary-500 border border-transparent px-4 py-2.5 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-primary-500/20"
                    >
                      Xem kết quả
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </DialogTrigger>
                  {result.recordId ? (
                    <Link
                      to={`/records/detail/${result.recordId}`}
                      className="w-full inline-flex items-center justify-center gap-2 text-[13px] font-bold text-primary-700 bg-white border border-primary-200 px-4 py-2.5 rounded-xl hover:bg-primary-50 active:scale-[0.98] transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      Mở bệnh án
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <LabResultModalContent result={result} />
    </Dialog>
  );
};
