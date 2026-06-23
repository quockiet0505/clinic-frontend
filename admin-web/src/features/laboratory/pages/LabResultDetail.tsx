import React from 'react';
import {
  Printer,
  Download,
  FlaskConical,
  User,
  Stethoscope,
  CheckCircle2,
  Calendar,
  ClipboardCheck,
  Beaker,
  Hash,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import DetailPageHeader, { ActionButton } from '@/components/common/DetailPageHeader';
import { ClinicPdfLayout } from '@/components/common/ClinicPdfLayout';
import { generatePdf, printPdfLayout } from '@/utils/generatePdf';
import { patientApi } from '../../patients/api/patientApi';
import { useState, useEffect } from 'react';

interface Props {
  result: any;
  onBack: () => void;
}

export default function LabResultDetail({ result, onBack }: Props) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [patientDetail, setPatientDetail] = useState<any>(null);

  useEffect(() => {
    if (result?.patientId) {
      patientApi.getById(result.patientId).then((p: any) => setPatientDetail(p)).catch(console.error);
    }
  }, [result?.patientId]);

  if (!result) return null;

  const doctorName = result.doctorName?.startsWith('BS.')
    ? result.doctorName
    : `BS. ${result.doctorName}`;

  const pdfId = `pdf-lab-${result.resultId}`;

  const handlePrint = () => {
    printPdfLayout(pdfId, 'Kết quả xét nghiệm');
  };

  const handleDownload = async () => {
    setPdfLoading(true);
    try {
      const filename = `RES-${String(result.resultId).padStart(5, '0')}.pdf`;
      await generatePdf(pdfId, filename);
    } finally {
      setPdfLoading(false);
    }
  };

  const resultCode = `RES-${String(result.resultId).padStart(5, '0')}`;
  const dateLabel = result.enteredAt
    ? new Date(result.enteredAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="min-h-[calc(100vh-6rem)] animate-in fade-in duration-300 pb-6">
      <div className="max-w-[1100px] mx-auto w-full space-y-5">
        <DetailPageHeader
          title="Chi tiết kết quả xét nghiệm"
          subtitle={result.serviceName ?? 'Báo cáo xét nghiệm / cận lâm sàng'}
          code={`#${resultCode}`}
          onBack={onBack}
          backLabel="Về danh sách kết quả"
          statusBadge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> Đã xác nhận
            </span>
          }
          actions={
            <>
              <ActionButton
                icon={<Printer size={14} />}
                label="In phiếu"
                onClick={handlePrint}
                tone="sky"
              />
              <ActionButton
                icon={pdfLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                label="Tải PDF"
                onClick={handleDownload}
                disabled={pdfLoading}
                tone="emerald"
              />
            </>
          }
        />

        <div className="grid lg:grid-cols-[minmax(0,280px)_1fr] gap-5 items-start">
          {/* Sidebar - meta info */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm mb-3 ring-4 ring-white/10">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <p className="text-[12px] text-white/70 mb-0.5">Dịch vụ</p>
                <p className="font-semibold text-[15px] leading-snug">
                  {result.serviceName ?? 'Xét nghiệm / Cận lâm sàng'}
                </p>
                <p className="text-[12px] text-white/80 mt-2">{resultCode}</p>
              </div>

              <div className="p-4 space-y-3">
                <SidebarRow
                  icon={<User className="w-3.5 h-3.5" />}
                  label="Bệnh nhân"
                  value={result.patientName}
                  highlight
                />
                <SidebarRow
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  label="Ngày ghi nhận"
                  value={dateLabel}
                />
                <SidebarRow
                  icon={<Stethoscope className="w-3.5 h-3.5" />}
                  label="BS chỉ định"
                  value={doctorName}
                />
                <SidebarRow
                  icon={<ClipboardCheck className="w-3.5 h-3.5" />}
                  label="KTV thực hiện"
                  value={result.enteredByName}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-[13.5px] font-semibold text-emerald-800">
                  Đã xác nhận hoàn tất
                </h3>
              </div>
              <p className="text-[12.5px] text-emerald-700/80 leading-relaxed">
                Kết quả đã được kỹ thuật viên xác nhận và ký số.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Dữ liệu được mã hóa và lưu trên hệ thống ClinicPro.
              </p>
            </div>
          </aside>

          {/* Main - chỉ nội dung kết quả */}
          <div className="flex flex-col gap-5 min-w-0">
            <Card>
              <CardHeader
                icon={<Beaker className="w-4 h-4 text-violet-500" />}
                title="Chỉ số kết quả"
              />
              <div className="p-5">
                <div className="rounded-xl border border-slate-200 border-l-[3px] border-l-violet-400 bg-violet-50/30 overflow-hidden">
                  <div className="px-4 py-2 bg-violet-50/60 border-b border-violet-100 flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-violet-500" />
                    <span className="text-[13px] text-violet-700">Số liệu chỉ định</span>
                  </div>
                  <p className="text-[13.5px] text-slate-700 whitespace-pre-wrap leading-relaxed px-4 py-4">
                    {result.resultData || 'Không có dữ liệu chỉ số.'}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                icon={<ClipboardCheck className="w-4 h-4 text-emerald-500" />}
                title="Kết luận lâm sàng"
              />
              <div className="p-5">
                <div className="rounded-xl border border-emerald-200/70 border-l-[3px] border-l-emerald-500 bg-gradient-to-r from-emerald-50/70 via-white to-white p-4">
                  <p className="text-[14.5px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {result.conclusion || (
                      <span className="text-slate-400 italic">
                        Chưa có kết luận cụ thể.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* HIDDEN PDF LAYOUT */}
      <ClinicPdfLayout
        id={pdfId}
        documentTitle="KẾT QUẢ XÉT NGHIỆM"
        documentCode={resultCode}
        issuedDate={dateLabel}
        patient={{
          name: result.patientName,
          dob: patientDetail?.dob,
          gender: patientDetail?.gender,
          phone: patientDetail?.phone,
          address: patientDetail?.address,
          bloodType: patientDetail?.bloodType,
          height: patientDetail?.height,
          weight: patientDetail?.weight,
          bloodPressure: patientDetail?.bloodPressure,
          pulse: patientDetail?.pulse,
          allergies: patientDetail?.allergies,
          medicalHistory: patientDetail?.medicalHistory,
        }}
        doctorName={doctorName}
        technicianName={result.enteredByName}
        extraSections={[
          {
            title: result.serviceName ?? 'Kết quả xét nghiệm',
            content: result.resultData,
            price: result.price,
          },
        ]}
        conclusion={result.conclusion}
        tableRows={[]}
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
