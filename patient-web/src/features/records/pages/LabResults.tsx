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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        <Card className="rounded-3xl border-0 shadow-sm bg-white overflow-hidden">
          <div className="p-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[13px] text-slate-500 uppercase bg-slate-50 rounded-t-2xl border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 font-bold rounded-tl-2xl w-[120px]">Mã Phiếu</th>
                  <th className="px-6 py-5 font-bold w-[250px]">Tên Dịch vụ</th>
                  <th className="px-6 py-5 font-bold w-[200px]">Phân loại</th>
                  <th className="px-6 py-5 font-bold w-[160px]">Trạng thái</th>
                  <th className="px-6 py-5 font-bold rounded-tr-2xl text-right pr-6 w-[180px]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result: any) => (
                    <LabResultTableRow key={result.resultId} result={result} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-slate-500 font-medium bg-white">
                      <div className="flex flex-col items-center gap-2">
                        <FlaskConical className="w-8 h-8 text-primary-300" />
                        <p>Không có kết quả khớp với bộ lọc hiện tại.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </SectionContainer>
    </main>
  );
};

const LabResultTableRow: React.FC<{ result: any }> = ({ result }) => {
  const isCompleted = !!result.resultData;
  const serviceName = result.serviceName || 'Xét nghiệm cận lâm sàng';
  const isImaging = isImagingService(serviceName.toLowerCase());
  const isAbnormal =
    result.resultData?.toLowerCase().includes('bất thường') ||
    result.conclusion?.toLowerCase().includes('bất thường');

  const enteredDate = new Date(result.enteredAt).toLocaleDateString('vi-VN');

  return (
    <Dialog>
      <tr className="border-b border-slate-200 last:border-0 even:bg-slate-100/60 hover:bg-primary-50/40 transition-colors group">
        <td className="px-6 py-5 align-top">
          <div className="font-bold text-slate-700">#{String(result.resultId).padStart(5, '0')}</div>
          <div className="text-slate-400 text-[13px] mt-0.5">{enteredDate}</div>
        </td>
        <td className="px-6 py-5 align-top max-w-[220px]">
          <div className="font-bold text-slate-800 truncate" title={serviceName}>
            {serviceName}
          </div>
          <div className="text-[12px] text-slate-500 mt-1 flex items-center gap-1.5 truncate" title={result.doctorName}>
            <UserRound className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{formatDoctorName(result.doctorName)}</span>
          </div>
        </td>
        <td className="px-6 py-5 align-top">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[13px] ${isImaging ? 'bg-violet-50 text-violet-700' : 'bg-primary-50 text-primary-700'}`}>
            {isImaging ? <ScanLine className="w-4 h-4" /> : <FlaskConical className="w-4 h-4" />}
            {isImaging ? 'Chẩn đoán hình ảnh' : 'Xét nghiệm'}
          </span>
        </td>
        <td className="px-6 py-5 align-top">
          {isCompleted ? (
            isAbnormal ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                <AlertTriangle className="w-3.5 h-3.5" /> Bất thường
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" /> Có kết quả
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang xử lý
            </span>
          )}
        </td>
        <td className="px-6 py-5 text-right pr-6 align-top">
          <div className="flex flex-col items-end gap-2">
            <DialogTrigger asChild>
              <button type="button" className="w-[140px] h-9 inline-flex items-center justify-center gap-1.5 text-[13px] font-bold text-white bg-primary-500 border border-transparent px-3 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-primary-500/20">
                Xem chi tiết
                <ChevronRight className="w-4 h-4" />
              </button>
            </DialogTrigger>
            {result.recordId && (
              <button
                type="button"
                className="w-[140px] h-9 inline-flex items-center justify-center gap-1.5 text-[13px] font-bold text-primary-700 bg-white border border-primary-200 px-3 rounded-xl hover:bg-primary-50 active:scale-[0.98] transition-all cursor-pointer"
                onClick={() => window.location.href = `/records/detail/${result.recordId}`}
              >
                <FileText className="w-3.5 h-3.5" />
                Mở bệnh án
              </button>
            )}
          </div>
          {/* Render Modal component via portal */}
          <LabResultModalContent result={result} />
        </td>
      </tr>
    </Dialog>
  );
};
