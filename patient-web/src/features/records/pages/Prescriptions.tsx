/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  FileSignature,
  ChevronRight,
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
          .catch(() => {});
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

        {/* List */}
        <div className="flex flex-col gap-3">
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
  const isActive = isRecentPrescription(prescription.createdAt);
  const status = isActive
    ? {
        label: 'Đang điều trị',
        color: 'bg-primary-50 text-primary-700 border-primary-200',
        dot: 'bg-primary-500',
        icon: <Activity className="w-3 h-3" />,
      }
    : {
        label: 'Đã hoàn thành',
        color: 'bg-slate-50 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
        icon: <CheckCircle2 className="w-3 h-3" />,
      };

  const medicines = prescription.items || [];
  const topMedicines = medicines.slice(0, 3);
  const remainingCount = medicines.length - topMedicines.length;

  return (
    <Dialog>
      <article className="bg-white rounded-2xl border border-slate-200 hover:border-primary-200 hover:shadow-sm transition-all p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-sm">
            <Pill className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-[15px] text-slate-900 leading-snug">
                {prescription.diagnosis || 'Đang cập nhật chẩn đoán'}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold shrink-0 ${status.color}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isActive ? 'animate-pulse' : ''} ${status.dot}`}
                />
                {status.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  Đơn
                </span>
                #{String(prescription.prescriptionId).padStart(5, '0')}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {new Date(prescription.createdAt).toLocaleDateString('vi-VN')}
              </span>
              <span className="inline-flex items-center gap-1">
                <UserRound className="w-3 h-3" />
                {formatDoctorName(prescription.doctorName)}
              </span>
            </div>
          </div>
        </div>

        {medicines.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topMedicines.map((item: any, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[12px] font-semibold text-slate-700"
              >
                {item.medicineName}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="px-2.5 py-1 bg-primary-50 border border-primary-100 rounded-md text-[12px] font-semibold text-primary-600">
                +{remainingCount} loại khác
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-end pt-1">
          {prescription.recordId && (
            <Link
              to={`/records/detail/${prescription.recordId}`}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Bệnh án
            </Link>
          )}
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white bg-primary-500 border border-transparent px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
              Chi tiết <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </DialogTrigger>
        </div>
      </article>

      <PrescriptionModalContent prescription={prescription} />
    </Dialog>
  );
};
