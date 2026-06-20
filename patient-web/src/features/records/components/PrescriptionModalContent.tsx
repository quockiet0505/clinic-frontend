/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pill, CalendarDays, UserRound, FileSignature, X, Printer, Download, Stethoscope } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { generatePdf, formatDoctorName } from '@/utils/generatePdf';
import { toast } from 'sonner';

export const PrescriptionModalContent = ({ prescription }: { prescription: any }) => {
  const pdfId = `pdf-pres-${prescription.prescriptionId}`;

  const handleDownloadPdf = () =>
    generatePdf(pdfId, `DonThuoc_${String(prescription.prescriptionId).padStart(5, '0')}.pdf`);

  return (
    <DialogContent showCloseButton={false} className="w-[95vw] sm:max-w-5xl max-w-5xl rounded-3xl bg-white border-0 p-0 shadow-2xl overflow-hidden">
      <div className="flex flex-col" style={{ maxHeight: '85vh' }}>
        <DialogHeader className="bg-white px-6 md:px-8 py-5 border-b border-slate-200 shrink-0 relative">
          <DialogTitle className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-start pr-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-inner">
                  <Pill className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col mt-1">
                  <h2 className="text-xl font-black text-slate-800 leading-tight">
                    Đơn thuốc #{String(prescription.prescriptionId).padStart(5, '0')}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-[13px] text-slate-500 font-medium flex-wrap">
                    <span className="flex items-center gap-1.5"><UserRound className="w-3.5 h-3.5" /> {formatDoctorName(prescription.doctorName)}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {new Date(prescription.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>
              <DialogClose asChild>
                <button className="p-2 rounded-full hover:bg-slate-100 transition-colors absolute right-4 top-4 cursor-pointer">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </DialogClose>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-slate-400" /> Chẩn đoán bệnh
                </h3>
                <p className="font-bold text-slate-800 text-[16px]">{prescription.diagnosis}</p>
              </div>
              <div className="w-full h-px bg-slate-200" />
              <div>
                <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-amber-500" /> Lời dặn của bác sĩ
                </h3>
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                  <p className="font-bold text-slate-700 text-[15px] whitespace-pre-wrap leading-relaxed">
                    {prescription.treatment || 'Uống thuốc đúng liều lượng. Tái khám nếu có dấu hiệu bất thường.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-500" /> Danh sách thuốc ({prescription.items?.length || 0})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14.5px]">
                  <thead className="text-[12px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="pb-3 w-[45%]">Tên thuốc</th>
                      <th className="pb-3 w-[35%]">Liều dùng</th>
                      <th className="pb-3 w-[20%] text-right">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {prescription.items?.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-4 align-top pr-4">
                          <p className="font-bold text-slate-800 text-[15px]">{item.medicineName}</p>
                        </td>
                        <td className="py-4 align-top pr-4">
                          <p className="text-slate-600 font-medium leading-relaxed">{item.dosage}</p>
                        </td>
                        <td className="py-4 align-top text-right">
                          <span className="inline-flex items-center justify-center font-bold text-emerald-600 text-[15px]">
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!prescription.items || prescription.items.length === 0) && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500 font-medium">
                          Không có thuốc nào trong đơn này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-slate-200 p-4 px-6 md:px-8 flex gap-3 justify-end shrink-0">
          <button
            onClick={() => { toast.success('Đang chuẩn bị in đơn thuốc...'); window.print(); }}
            className="cursor-pointer px-5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 text-[14px] shadow-sm"
          >
            <Printer className="w-4 h-4" /> In đơn
          </button>
          <button
            onClick={() => { toast.success('Đang chuẩn bị tải PDF...'); handleDownloadPdf(); }}
            className="cursor-pointer px-5 py-2.5 rounded-xl font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 transition-colors flex items-center gap-2 text-[14px] shadow-sm"
          >
            <Download className="w-4 h-4" /> Tải PDF
          </button>
        </div>
      </div>
    </DialogContent>
  );
};
