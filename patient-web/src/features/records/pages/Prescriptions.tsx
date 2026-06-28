/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  FileSignature,
  ChevronRight,
  ChevronDown,
  FileText,
  UserRound,
  CalendarDays,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { SectionContainer, DateFilter } from '@/components/common';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PrescriptionModalContent } from '../components/PrescriptionModalContent';
import { RecordCardMeta, RecordStatusBadge } from '../components/RecordCardMeta';
import { formatDoctorName } from '@/utils/generatePdf';

type StatusTab = 'ALL' | 'ACTIVE' | 'DONE';

const isRecentPrescription = (createdAt: string) =>
  new Date(createdAt).getTime() > new Date().getTime() - 14 * 24 * 60 * 60 * 1000;

export const Prescriptions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<StatusTab>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { recordApi } = await import('../api/recordApi');
        const presData = await recordApi.getPrescriptions();

        const initialEnriched = presData.map((p: any) => ({
          ...p,
          diagnosis: 'Chưa cập nhật chẩn đoán',
          treatment: 'Chưa có ghi chú điều trị',
          doctorName: 'Bác sĩ chuyên khoa',
        }));

        setPrescriptions(initialEnriched);
        setLoading(false);

        recordApi
          .getMedicalHistory()
          .then((recordsData) => {
            const recordsMap = new Map<any, any>(
              recordsData.map((r: any) => [r.recordId, r] as [any, any]),
            );
            setPrescriptions((prev) =>
              prev.map((p) => ({
                ...p,
                diagnosis: recordsMap.get(p.recordId)?.diagnosis || p.diagnosis,
                treatment: recordsMap.get(p.recordId)?.treatment || p.treatment,
                doctorName: recordsMap.get(p.recordId)?.mainDoctorName || p.doctorName,
              })),
            );
          })
          .catch(() => { });
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const stats = useMemo(() => {
    let active = 0;
    let done = 0;
    prescriptions.forEach((p) => {
      if (isRecentPrescription(p.createdAt)) active++;
      else done++;
    });
    return { total: prescriptions.length, active, done };
  }, [prescriptions]);

  const filteredPrescriptions = prescriptions.filter((p: any) => {
    const matchSearch =
      p.items?.some((item: any) =>
        item.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      p.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctorName?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchDate = true;
    if (fromDate) matchDate = matchDate && new Date(p.createdAt) >= new Date(fromDate);
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      matchDate = matchDate && new Date(p.createdAt) <= end;
    }
    if (!matchSearch || !matchDate) return false;

    const recent = isRecentPrescription(p.createdAt);
    if (statusTab === 'ACTIVE' && !recent) return false;
    if (statusTab === 'DONE' && recent) return false;

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
            <div className="h-[240px] bg-white border border-slate-200 rounded-3xl w-full animate-pulse" />
            <div className="h-[240px] bg-white border border-slate-200 rounded-3xl w-full animate-pulse" />
          </div>
        </SectionContainer>
      </main>
    );
  }

  const tabs: { id: StatusTab; label: string; count: number }[] = [
    { id: 'ALL', label: 'Tất cả', count: stats.total },
    { id: 'ACTIVE', label: 'Đang điều trị', count: stats.active },
    { id: 'DONE', label: 'Đã hoàn thành', count: stats.done },
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
            <span className="text-white">Đơn thuốc</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                <FileSignature className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  Đơn Thuốc Của Tôi
                </h1>
                <p className="text-white/90 text-sm drop-shadow-sm">
                  Theo dõi lịch sử đơn thuốc — tải PDF tại trang chi tiết bệnh án
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="w-full sm:w-72 shrink-0">
                <SearchInput
                  value={searchQuery}
                  onSearch={setSearchQuery}
                  placeholder="Tìm thuốc, chẩn đoán, bác sĩ..."
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
        {/* Tabs */}
        <div className="inline-flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-inner w-full sm:w-fit overflow-x-auto hide-scrollbar gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`relative px-5 py-2 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 ${statusTab === tab.id
                  ? 'text-primary-700 bg-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-slate-200/50'
                  : 'text-slate-500 bg-transparent border border-transparent hover:bg-slate-200/50 hover:text-slate-700'
                }`}
            >
              <span className="relative z-10">{tab.label}</span>
              <span
                className={`relative z-10 tabular-nums text-[12px] font-bold px-2 py-0.5 rounded-lg transition-colors ${statusTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-slate-200/70 text-slate-500'
                  }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((prescription: any) => (
              <PrescriptionCard key={prescription.prescriptionId} prescription={prescription} />
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center bg-white">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-3">
                <Pill className="w-8 h-8 text-primary-400" />
              </div>
              <h2 className="text-[16px] font-black text-brand-dark mb-1">Chưa có đơn thuốc nào</h2>
              <p className="text-slate-500 text-[13px] font-medium max-w-md">
                Không có đơn thuốc nào khớp với bộ lọc hiện tại.
              </p>
            </div>
          )}
        </div>
      </SectionContainer>
    </main>
  );
};

const PrescriptionCard: React.FC<{ prescription: any }> = ({ prescription }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = isRecentPrescription(prescription.createdAt);
  const status = isActive
    ? {
      label: 'Đang điều trị',
      color: 'bg-primary-50 text-primary-700 border-primary-200',
      icon: <Activity className="w-3.5 h-3.5" />,
      hint: 'Đơn thuốc còn hiệu lực trong 14 ngày gần đây. Uống đúng liều và tái khám nếu có dấu hiệu bất thường.',
    }
    : {
      label: 'Đã hoàn thành',
      color: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      hint: 'Đơn thuốc đã kết thúc liệu trình. Bạn vẫn có thể xem lại chi tiết hoặc mở bệnh án.',
    };

  const medicines = prescription.items || [];
  const visibleMedicines = medicines.slice(0, 4);
  const remainingCount = medicines.length - visibleMedicines.length;
  const prescriptionCode = `#${String(prescription.prescriptionId).padStart(5, '0')}`;
  const issuedDate = new Date(prescription.createdAt).toLocaleDateString('vi-VN');

  return (
    <Dialog>
      <article className={`group bg-white rounded-3xl border shadow-sm transition-all overflow-hidden ${isExpanded ? 'border-primary-200 shadow-md' : 'border-slate-200/80 hover:border-primary-200/60 hover:shadow-md'}`}>
        
        {/* Accordion Header (Always Visible) */}
        <div 
          className="p-5 md:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Pill className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>Đơn thuốc · {prescriptionCode}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{issuedDate}</span>
              </div>
              <h3 className="font-black text-[16px] sm:text-[18px] text-slate-900 leading-snug truncate group-hover:text-primary-600 transition-colors">
                {prescription.diagnosis || 'Đang cập nhật chẩn đoán'}
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
                {/* The Header was moved up, we only show Meta tags now */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 mt-2 sm:mt-5">
              <RecordCardMeta icon={CalendarDays} label="Ngày kê đơn" value={issuedDate} />
              <RecordCardMeta
                icon={UserRound}
                label="Bác sĩ kê đơn"
                value={formatDoctorName(prescription.doctorName)}
              />
              <RecordCardMeta
                icon={Pill}
                label="Số loại thuốc"
                value={`${medicines.length} loại`}
              />
            </div>

            {medicines.length > 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-white/70">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Thuốc được kê
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[520px]">
                    <div className="grid grid-cols-[1.3fr_1.6fr_0.8fr] gap-3 px-4 py-2.5 bg-slate-100/70 border-b border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Tên thuốc
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Cách dùng
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Số lượng
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {visibleMedicines.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[1.3fr_1.6fr_0.8fr] gap-3 px-4 py-3.5 bg-white/40 items-start"
                        >
                          <p className="text-[13px] font-bold text-slate-800 leading-snug">
                            {item.medicineName}
                          </p>
                          <p className="text-[13px] text-slate-600 leading-relaxed">
                            {item.dosage || 'Theo chỉ định bác sĩ'}
                          </p>
                          <p className="text-[13px] font-semibold text-slate-700 leading-relaxed">
                            {item.quantity
                              ? `${item.quantity}${item.unit ? ` ${item.unit}` : ''}`
                              : 'Chưa ghi'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {remainingCount > 0 ? (
                  <div className="px-4 py-3 text-[12px] font-bold text-primary-600 bg-primary-50/50 border-t border-slate-100">
                    +{remainingCount} loại thuốc khác trong đơn
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-[13px] text-slate-500 font-medium">
                Chưa có danh sách thuốc chi tiết cho đơn này.
              </div>
            )}

            {prescription.treatment && prescription.treatment !== 'Chưa có ghi chú điều trị' ? (
              <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Hướng dẫn điều trị
                </p>
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">
                  {prescription.treatment}
                </p>
              </div>
            ) : null}
          </div>

          <div className="lg:w-[272px] shrink-0 bg-slate-50/90 border-t lg:border-t-0 lg:border-l border-slate-100 p-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{status.hint}</p>
              <div className="rounded-xl bg-white border border-slate-100 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Tóm tắt
                </p>
                <p className="text-[22px] font-black text-slate-800 leading-none">{medicines.length}</p>
                <p className="text-[12px] font-medium text-slate-500 mt-1">loại thuốc trong đơn</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 text-[13px] font-bold text-white bg-primary-500 border border-transparent px-4 py-2.5 rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-primary-500/20"
                >
                  Xem chi tiết
                  <ChevronRight className="w-4 h-4" />
                </button>
              </DialogTrigger>
              {prescription.recordId ? (
                <Link
                  to={`/records/detail/${prescription.recordId}`}
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

      <PrescriptionModalContent prescription={prescription} />
    </Dialog>
  );
};
