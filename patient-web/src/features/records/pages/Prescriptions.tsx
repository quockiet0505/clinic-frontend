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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 mb-2">
          <div className="flex w-full sm:w-fit overflow-x-auto hide-scrollbar gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`relative pb-3 text-[14px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 border-b-2 ${
                  statusTab === tab.id
                    ? 'text-primary-600 border-primary-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`tabular-nums text-[11px] font-black px-2 py-0.5 rounded-full transition-colors ${
                    statusTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <Card className="rounded-3xl border-0 shadow-sm bg-white overflow-hidden">
          <div className="p-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[13px] text-slate-500 uppercase bg-slate-50 rounded-t-2xl border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 font-bold rounded-tl-2xl w-[150px]">Mã Đơn thuốc</th>
                  <th className="px-6 py-5 font-bold w-[250px]">Chẩn đoán</th>
                  <th className="px-6 py-5 font-bold">Số lượng thuốc</th>
                  <th className="px-6 py-5 font-bold">Trạng thái</th>
                  <th className="px-6 py-5 font-bold rounded-tr-2xl text-right pr-6 w-[180px]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((prescription: any) => (
                    <PrescriptionTableRow key={prescription.prescriptionId} prescription={prescription} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-slate-500 font-medium bg-white">
                      <div className="flex flex-col items-center gap-2">
                        <Pill className="w-8 h-8 text-primary-300" />
                        <p>Không có đơn thuốc nào khớp với bộ lọc.</p>
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

const PrescriptionTableRow: React.FC<{ prescription: any }> = ({ prescription }) => {
  const isActive = isRecentPrescription(prescription.createdAt);
  const prescriptionCode = `#${String(prescription.prescriptionId).padStart(5, '0')}`;
  const issuedDate = new Date(prescription.createdAt).toLocaleDateString('vi-VN');
  
  return (
    <Dialog>
      <tr className="border-b border-slate-200 last:border-0 even:bg-slate-100/60 hover:bg-primary-50/40 transition-colors group">
        <td className="px-6 py-5 align-top">
          <div className="font-bold text-slate-700">{prescriptionCode}</div>
          <div className="text-slate-400 text-[13px] mt-0.5">{issuedDate}</div>
        </td>
        <td className="px-6 py-5 align-top max-w-[220px]">
          <div className="font-bold text-slate-800 truncate" title={prescription.diagnosis || 'Đang cập nhật chẩn đoán'}>
            {prescription.diagnosis || 'Đang cập nhật chẩn đoán'}
          </div>
          <div className="text-[12px] text-slate-500 mt-1 flex items-center gap-1.5 truncate" title={prescription.doctorName}>
            <UserRound className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{formatDoctorName(prescription.doctorName)}</span>
          </div>
        </td>
        <td className="px-6 py-5 align-top">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-xl font-bold text-[13px]">
            <Pill className="w-4 h-4 text-teal-500" />
            {prescription.items?.length || 0} loại thuốc
          </span>
        </td>
        <td className="px-6 py-5 align-top">
          {isActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold bg-primary-50 text-primary-700 border border-primary-100">
              <Activity className="w-3.5 h-3.5" /> Đang điều trị
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
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
            {prescription.recordId && (
              <button
                type="button"
                className="w-[140px] h-9 inline-flex items-center justify-center gap-1.5 text-[13px] font-bold text-primary-700 bg-white border border-primary-200 px-3 rounded-xl hover:bg-primary-50 active:scale-[0.98] transition-all cursor-pointer"
                onClick={() => window.location.href = `/records/detail/${prescription.recordId}`}
              >
                <FileText className="w-3.5 h-3.5" />
                Mở bệnh án
              </button>
            )}
          </div>
          {/* Render Modal component via portal */}
          <PrescriptionModalContent prescription={prescription} />
        </td>
      </tr>
    </Dialog>
  );
};
