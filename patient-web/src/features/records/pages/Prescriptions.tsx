/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { Pill, CalendarDays, UserRound, FileSignature, ChevronRight, X, Printer, Download, Stethoscope } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { SectionContainer } from '@/components/common';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PrescriptionModalContent } from '../components/PrescriptionModalContent';

export const Prescriptions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { recordApi } = await import('../api/recordApi');
        const [presData, recordsData] = await Promise.all([
          recordApi.getPrescriptions(),
          recordApi.getMedicalHistory().catch(() => [])
        ]);
        
        const recordsMap = new Map(recordsData.map((r: any) => [r.recordId, r]));
        const enriched = presData.map((p: any) => ({
          ...p,
          diagnosis: recordsMap.get(p.recordId)?.diagnosis || 'Chưa cập nhật chẩn đoán',
          treatment: recordsMap.get(p.recordId)?.treatment || 'Chưa có ghi chú điều trị',
          doctorName: recordsMap.get(p.recordId)?.mainDoctorName || 'Bác sĩ chuyên khoa'
        }));
        setPrescriptions(enriched);
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter((p: any) =>
    p.items?.some((item: any) => item.medicineName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.doctorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-10">
        <SectionContainer className="max-w-4xl space-y-6">
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
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
                <span className="text-primary-600">Đơn thuốc của tôi</span>
              </div>
              <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-primary-600" />
                Đơn Thuốc Của Tôi
              </h1>
            </div>
            <div className="w-full md:w-72">
              <SearchInput value={searchQuery} onSearch={setSearchQuery} placeholder="Tìm thuốc, chẩn đoán, bác sĩ..." className="h-10" />
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-4xl py-8">
        <div className="flex flex-col gap-4">
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((prescription: any) => (
              <PrescriptionCard key={prescription.prescriptionId} prescription={prescription} />
            ))
          ) : (
            <div className="rounded-2xl border border-slate-100 shadow-sm p-14 text-center flex flex-col items-center justify-center bg-white mt-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <Pill className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Chưa có đơn thuốc nào</h2>
              <p className="text-slate-500 text-[14px] font-medium max-w-md">
                Hiện tại bạn chưa có đơn thuốc nào hoặc không có đơn thuốc khớp với từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </div>
      </SectionContainer>
    </main>
  );
};

const PrescriptionCard: React.FC<{ prescription: any }> = ({ prescription }) => {
  // eslint-disable-next-line react-hooks/purity
  const isRecent = new Date(prescription.createdAt).getTime() > Date.now() - 14 * 24 * 60 * 60 * 1000;
  const statusLabel = isRecent ? 'Đang điều trị' : 'Đã hoàn thành';
  const statusColors = isRecent 
    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
    : 'bg-slate-100 text-slate-500 border-slate-200';
  const dotColor = isRecent ? 'bg-emerald-500' : 'bg-slate-400';
  
  const medicines = prescription.items || [];
  const topMedicines = medicines.slice(0, 2);
  const remainingCount = medicines.length - topMedicines.length;

  return (
    <Dialog>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-start">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-inner">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-black text-slate-800 text-[18px] leading-tight group-hover:text-emerald-600 transition-colors">
                Chẩn đoán: {prescription.diagnosis || 'Đang cập nhật'}
              </h3>
              <p className="text-slate-500 text-[13.5px] font-medium mt-1">
                Đơn thuốc #{String(prescription.prescriptionId).padStart(5, '0')} • {new Date(prescription.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full border text-[12px] font-bold flex items-center gap-1.5 shrink-0 ${statusColors}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isRecent ? 'animate-pulse' : ''} ${dotColor}`} />
            {statusLabel}
          </div>
        </div>

        {medicines.length > 0 && (
          <div className="pl-[72px]">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Thuốc được kê ({medicines.length} loại)</p>
            <div className="flex flex-wrap gap-2">
              {topMedicines.map((item: any, idx: number) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[13.5px] font-medium text-slate-700">
                  {item.medicineName}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[13.5px] font-medium text-slate-500">
                  + {remainingCount} loại khác
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-between items-center pt-5 mt-2 border-t border-slate-100 pl-0 md:pl-[72px]">
          <div className="flex items-center gap-2 text-[14px] text-slate-600">
            <UserRound className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-bold">BS. {prescription.doctorName || 'Đang cập nhật'}</span>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none justify-center flex items-center gap-2 text-[13px] font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
              <Download className="w-4 h-4" /> Tải PDF
             </button>
             <DialogTrigger asChild>
               <button className="flex-1 md:flex-none justify-center flex items-center gap-2 text-[13px] font-bold text-white bg-emerald-500 border border-transparent px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer shadow-sm shadow-emerald-200">
                 Xem chi tiết <ChevronRight className="w-4 h-4" />
               </button>
             </DialogTrigger>
          </div>
        </div>
      </div>

      <PrescriptionModalContent prescription={prescription} />
    </Dialog>
  );
};
