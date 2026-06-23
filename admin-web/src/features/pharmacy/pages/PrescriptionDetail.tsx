import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  Pill,
  Stethoscope,
  CalendarDays,
  Phone,
  FlaskConical,
  CheckCircle2,
  ShieldCheck,
  ScrollText,
  Loader2,
} from 'lucide-react';
import DetailPageHeader, { ActionButton } from '@/components/common/DetailPageHeader';
import { ClinicPdfLayout, PdfTableRow } from '@/components/common/ClinicPdfLayout';
import { pharmacyApi } from '../api/pharmacyApi';
import { patientApi } from '../../patients/api/patientApi';
import { generatePdf, printPdfLayout } from '@/utils/generatePdf';

interface Props {
  prescriptionId: number;
  onBack: () => void;
}

export default function PrescriptionDetail({ prescriptionId, onBack }: Props) {
  const [prescription, setPrescription] = useState<any>(null);
  const [patientDetail, setPatientDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!prescriptionId) return;
    setLoading(true);
    pharmacyApi
      .getPrescriptionById(prescriptionId)
      .then((data) => {
        setPrescription(data);
        if (data.patientId) {
          patientApi.getById(data.patientId).then((p: any) => setPatientDetail(p)).catch(console.error);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [prescriptionId]);

  if (loading) {
    return (
      <div className="p-8 text-slate-500 text-center bg-white rounded-2xl border border-slate-200">
        Đang tải chi tiết đơn thuốc...
      </div>
    );
  }
  if (!prescription) {
    return (
      <div className="p-8 text-rose-500 text-center bg-white rounded-2xl border border-rose-200">
        Không tìm thấy đơn thuốc.
      </div>
    );
  }

  const items: any[] = prescription.items ?? [];
  const orders: any[] = prescription.serviceOrders ?? [];
  const prescriptionCode = `RX-${String(prescription.prescriptionId).padStart(5, '0')}`;
  const pdfId = `pdf-rx-${prescription.prescriptionId}`;

  const handleDownload = async () => {
    setPdfLoading(true);
    try {
      await generatePdf(pdfId, `${prescriptionCode}.pdf`);
    } finally {
      setPdfLoading(false);
    }
  };

  const pdfPatient = {
    name: prescription.patientName,
    dob: patientDetail?.dob || prescription.dateOfBirth,
    gender: patientDetail?.gender,
    phone: patientDetail?.phone || prescription.phone,
    address: patientDetail?.address,
    bloodType: patientDetail?.bloodType,
    height: patientDetail?.height,
    weight: patientDetail?.weight,
    bloodPressure: patientDetail?.bloodPressure,
    pulse: patientDetail?.pulse,
    allergies: patientDetail?.allergies,
    medicalHistory: patientDetail?.medicalHistory,
  };

  const tableRows: PdfTableRow[] = items.map((item, idx) => ({
    index: idx + 1,
    name: item.medicineName || item.name,
    detail: item.dosage || 'Theo hướng dẫn bác sĩ',
    quantity: `${item.quantity || item.qty} ${item.unit || 'viên'}`,
  }));

  return (
    <div className="min-h-[calc(100vh-6rem)] animate-in fade-in duration-300 pb-6">
      <div className="max-w-[1100px] mx-auto w-full space-y-5">
        <DetailPageHeader
          title="Chi tiết đơn thuốc"
          subtitle={`Bệnh nhân: ${prescription.patientName ?? '—'} • Bác sĩ: ${
            prescription.doctorName ?? '—'
          }`}
          code={`#${prescriptionCode}`}
          onBack={onBack}
          backLabel="Về danh sách đơn thuốc"
          statusBadge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> Đã kê
            </span>
          }
          actions={
            <>
              <ActionButton
                icon={<Printer size={15} />}
                label="In đơn"
                onClick={() => printPdfLayout(pdfId, 'Chi tiết đơn thuốc')}
                tone="sky"
              />
              <ActionButton
                icon={pdfLoading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                label="Tải PDF"
                onClick={handleDownload}
                disabled={pdfLoading}
                tone="emerald"
              />
            </>
          }
        />

        <div className="grid lg:grid-cols-[minmax(0,280px)_1fr] gap-5 items-start">
          {/* Sidebar */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm mb-3 ring-4 ring-white/10">
                  <Pill className="w-6 h-6" />
                </div>
                <p className="text-[12px] text-white/70 mb-0.5">Bệnh nhân</p>
                <p className="font-semibold text-[15px] leading-snug">
                  {prescription.patientName ?? '—'}
                </p>
                <p className="text-[12px] text-white/80 mt-2">{prescriptionCode}</p>
              </div>

              <div className="p-4 space-y-3">
                <SidebarRow
                  icon={<Stethoscope className="w-3.5 h-3.5" />}
                  label="Bác sĩ chỉ định"
                  value={prescription.doctorName}
                  highlight
                />
                <SidebarRow
                  icon={<CalendarDays className="w-3.5 h-3.5" />}
                  label="Ngày sinh BN"
                  value={prescription.dateOfBirth}
                />
                <SidebarRow
                  icon={<Phone className="w-3.5 h-3.5" />}
                  label="Số điện thoại"
                  value={prescription.phone}
                />
                <SidebarRow
                  icon={<Pill className="w-3.5 h-3.5" />}
                  label="Số loại thuốc"
                  value={`${items.length} loại`}
                />
              </div>
            </div>

            {/* Trust */}
            <div className="rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Đơn thuốc điện tử được ký số và lưu trên hệ thống ClinicPro.
              </p>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex flex-col gap-5 min-w-0">
            {/* Diagnosis */}
            <Card>
              <CardHeader
                icon={<Stethoscope className="w-4 h-4 text-violet-500" />}
                title="Chẩn đoán điều trị"
              />
              <div className="p-5">
                <div className="rounded-xl border border-violet-200/70 border-l-[3px] border-l-violet-500 bg-violet-50/40 p-4">
                  <p className="text-[14.5px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {prescription.diagnosis || (
                      <span className="text-slate-400 italic">
                        Chưa cập nhật chẩn đoán
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Card>

            {/* Lab orders */}
            {orders.length > 0 && (
              <Card>
                <CardHeader
                  icon={<FlaskConical className="w-4 h-4 text-sky-500" />}
                  title="Chỉ định cận lâm sàng & kết quả"
                />
                <div className="p-5 space-y-2.5">
                  {orders.map((order, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center text-[12px] shrink-0 border border-sky-200">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-[13.5px] text-slate-800 leading-tight">
                              {order.serviceName}
                            </p>
                            <p className="text-[12px] text-slate-500 mt-0.5">
                              {order.price != null
                                ? `${order.price.toLocaleString('vi-VN')} ₫`
                                : 'Miễn phí'}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[11.5px] px-2 py-0.5 rounded-full border shrink-0 inline-flex items-center gap-1 ${
                            order.status === 'DONE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.status === 'DONE' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {order.status === 'DONE' ? 'Đã có kết quả' : 'Chờ thực hiện'}
                        </span>
                      </div>
                      {order.status === 'DONE' && (
                        <div className="mt-2 ml-8 pl-3 border-l-2 border-sky-100 space-y-1 text-[13px]">
                          {order.resultData && (
                            <p className="text-slate-600">
                              <span className="font-semibold text-slate-700">Số liệu:</span>{' '}
                              {order.resultData}
                            </p>
                          )}
                          {order.conclusion && (
                            <p className="text-slate-800">
                              <span className="font-semibold text-slate-700">Kết luận:</span>{' '}
                              {order.conclusion}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Medicines */}
            <Card>
              <CardHeader
                icon={<ScrollText className="w-4 h-4 text-emerald-500" />}
                title="Toa thuốc chỉ định"
              />
              <div className="p-5">
                {items.length > 0 ? (
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-[13.5px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-3 py-2.5 font-semibold text-slate-600 w-10">
                            #
                          </th>
                          <th className="text-left px-3 py-2.5 font-semibold text-slate-600">
                            Tên thuốc & cách dùng
                          </th>
                          <th className="text-right px-3 py-2.5 font-semibold text-slate-600 w-32">
                            Số lượng
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-3 text-slate-500 align-top">
                              {idx + 1}
                            </td>
                            <td className="px-3 py-3 align-top">
                              <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                  <Pill className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900">
                                    {item.medicineName || item.name}
                                  </p>
                                  <p className="text-[12.5px] text-slate-500 mt-0.5">
                                    Cách dùng: {item.dosage || 'Theo hướng dẫn bác sĩ'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-right align-top">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[12.5px] text-emerald-700">
                                {item.quantity || item.qty} {item.unit || 'viên'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[13px] text-slate-400 italic">
                    Không có chỉ định sử dụng thuốc trong đơn này.
                  </p>
                )}
              </div>
            </Card>

          </div>
        </div>
      </div>

      <ClinicPdfLayout
        id={pdfId}
        documentTitle="CHI TIẾT ĐƠN THUỐC"
        documentCode={prescriptionCode}
        issuedDate={new Date(prescription.createdAt || new Date()).toLocaleDateString('vi-VN')}
        patient={pdfPatient}
        doctorName={prescription.doctorName}
        diagnosis={prescription.diagnosis}
        tableRows={tableRows}
        notes={prescription.notes}
      />
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {children}
    </section>
  );
}

function CardHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
}) {
  return (
    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/40">
      {icon}
      <h2 className="font-semibold text-slate-800 text-[14px]">{title}</h2>
    </div>
  );
}

function SidebarRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[12px] text-slate-500">{label}</p>
        <p
          className={`text-[13.5px] mt-0.5 break-words ${
            highlight ? 'font-semibold text-slate-900' : 'text-slate-800'
          }`}
        >
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

