import React from 'react';
import { FlaskConical, CheckCircle2, Hourglass, XCircle } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import type { ServiceOrder, MedicalRecordDetail } from '../types/medical';
import { Download, Loader2 } from 'lucide-react';
import { ClinicPdfLayout } from '@/components/common/ClinicPdfLayout';
import { generatePdf } from '@/utils/generatePdf';
import { useState } from 'react';

interface Props {
  orders: ServiceOrder[];
  patient?: any;
  record?: MedicalRecordDetail | null;
}

const statusIcon = (status: string) => {
  if (status === 'DONE') return <CheckCircle2 size={14} className="text-emerald-600" />;
  if (status === 'ORDERED') return <Hourglass size={14} className="text-amber-600" />;
  if (status === 'CANCELLED' || status === 'REJECTED') return <XCircle size={14} className="text-rose-600" />;
  return <FlaskConical size={14} className="text-slate-500" />;
};

export default function ConsultationOrdersPanel({ orders, patient, record }: Props) {
  const [pdfLoadingMap, setPdfLoadingMap] = useState<Record<number, boolean>>({});

  const handleDownloadPdf = async (order: ServiceOrder) => {
    if (!order.result) return;
    setPdfLoadingMap((prev) => ({ ...prev, [order.orderId]: true }));
    try {
      const pdfId = `pdf-result-${order.orderId}`;
      const filename = `RES-${String(order.result.resultId).padStart(5, '0')}.pdf`;
      await generatePdf(pdfId, filename);
    } catch (error) {
      console.error('Lỗi khi tải PDF:', error);
    } finally {
      setPdfLoadingMap((prev) => ({ ...prev, [order.orderId]: false }));
    }
  };
  if (!orders.length) {
    return (
      <div className="text-center p-10 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl select-none">
        Chưa có chỉ định cận lâm sàng. Bấm 「Tạo chỉ định」 để thêm xét nghiệm / CĐHA.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.orderId} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4 select-none">
            <div className="flex items-center gap-2.5">
              <span className="shrink-0">{statusIcon(order.status)}</span>
              <span className="font-bold text-slate-800 text-[14px]">{order.serviceName}</span>
              <span className="text-[11px] font-mono text-slate-400 font-bold">#ORD-{String(order.orderId).padStart(5, '0')}</span>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Result Content */}
          {order.result ? (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 select-none">Kết quả xét nghiệm</p>
                <p className="text-sm text-slate-700 font-medium whitespace-pre-wrap leading-relaxed bg-slate-50/50 rounded-xl p-3.5 border border-slate-100">{order.result.resultData || '—'}</p>
              </div>
              {order.result.conclusion && (
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 select-none">Kết luận</p>
                  <p className="text-sm text-emerald-900 font-semibold bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3.5 leading-relaxed">
                    {order.result.conclusion}
                  </p>
                </div>
              )}
              {(() => {
                let urls: string[] = [];
                if (order.result.attachmentUrls) {
                  try {
                    urls = JSON.parse(order.result.attachmentUrls);
                  } catch {
                    urls = [order.result.attachmentUrls];
                  }
                } else if (order.result.attachmentUrl) {
                  urls = [order.result.attachmentUrl];
                }
                if (urls.length === 0) return null;
                return (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 select-none">Tài liệu / Ảnh đính kèm</p>
                    <div className="flex flex-wrap gap-3">
                      {urls.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-slate-50 w-24 h-24 sm:w-32 sm:h-32 transition-all hover:ring-2 hover:ring-blue-500 hover:border-transparent"
                        >
                          <img
                            src={url}
                            alt={`Đính kèm ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-semibold bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm transition-opacity">Phóng to</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold border-t border-slate-100 pt-3 select-none">
                <div className="flex items-center gap-4">
                  <span>Nhập bởi: {order.result.enteredByName || order.result.enteredBy || 'N/A'}</span>
                  <span>Thời gian: {order.result.enteredAt}</span>
                </div>
                <button
                  onClick={() => handleDownloadPdf(order)}
                  disabled={pdfLoadingMap[order.orderId]}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {pdfLoadingMap[order.orderId] ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Tải Phiếu KQ
                </button>
              </div>

              {/* Hidden PDF Layout */}
              <div id={`pdf-result-${order.orderId}`} className="hidden">
                <ClinicPdfLayout
                  type="LAB_RESULT"
                  patientInfo={{
                    name: patient?.fullName ?? record?.patientName ?? 'N/A',
                    age: patient?.age ?? 'N/A',
                    gender: patient?.gender === 'MALE' ? 'Nam' : 'Nữ',
                    phone: patient?.phone,
                    address: patient?.address,
                    code: patient?.patientId ? `PAT-${patient?.patientId}` : '',
                  }}
                  doctorName={record?.mainDoctorName ?? 'N/A'}
                  technicianName={order.result.enteredByName || order.result.enteredBy || 'N/A'}
                  resultData={{
                    title: order.serviceName ?? 'Kết quả xét nghiệm',
                    result: order.result.resultData,
                    conclusion: order.result.conclusion,
                    attachmentUrls: (() => {
                      if (order.result?.attachmentUrls) {
                        try {
                          return JSON.parse(order.result.attachmentUrls);
                        } catch {
                          return [order.result.attachmentUrls];
                        }
                      }
                      if (order.result?.attachmentUrl) return [order.result.attachmentUrl];
                      return [];
                    })(),
                  }}
                  date={new Date(order.result.enteredAt)}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs font-semibold text-amber-700 bg-amber-50/50 border border-amber-100/60 rounded-xl px-4 py-3 select-none">
              Đang chờ phòng cận lâm sàng thực hiện và nhập kết quả xét nghiệm...
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
