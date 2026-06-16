import React from 'react';
import { ChevronLeft, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  result: any;
  onBack: () => void;
}

export default function LabResultDetail({ result, onBack }: Props) {
  if (!result) return null;

  const doctorName = result.doctorName?.startsWith('BS.') ? result.doctorName : `BS. ${result.doctorName}`;
  const handlePrint = () => window.print();

  // Định dạng chung cho các tiêu đề mục lớn I, II, III, IV trùng khớp với trang Đơn thuốc
  const headingClass = "text-sm font-bold uppercase tracking-wide text-slate-800 border-b border-slate-200 pb-2 mt-6 mb-4 first:mt-0";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col print:block print:h-auto">

      {/* WEB NAVIGATION BAR (ẨN KHI IN) */}
      <div className="flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <ChevronLeft
            size={28}
            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            onClick={onBack}
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Chi tiết Kết quả Xét nghiệm
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Đang xem báo cáo dịch vụ 
              <span className="font-semibold text-slate-700"> #RES-{result.resultId}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="h-9 px-4 rounded-xl text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Printer size={14} className="mr-1.5" /> In phiếu
          </Button>
          <Button
            variant="outline"
            className="h-9 px-4 rounded-xl text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download size={14} className="mr-1.5" /> Tải PDF
          </Button>
        </div>
      </div>

      {/* TỜ PHIẾU KẾT QUẢ ĐỒNG NHẤT KHỐI NỘI DUNG VỚI ĐƠN THUỐC */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-y-auto custom-scrollbar print:border-0 print:shadow-none print:rounded-none">
        <div className="max-w-3xl mx-auto p-8 print:p-0 space-y-6">

          {/* TIÊU ĐỀ CHÍNH */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 uppercase">
              PHIẾU KẾT QUẢ XÉT NGHIỆM / CẬN LÂM SÀNG
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 font-medium print:text-black">
              Tên dịch vụ kỹ thuật: <span className="text-slate-800 font-bold">{result.serviceName}</span>
            </p>
          </div>

          {/* MẠCH NỘI DUNG LIỀN MẠCH TRÊN MỘT MẶT PHẲNG NỀN TRẮNG */}
          <div className="text-sm space-y-6 text-slate-700">

            {/* MỤC I: THÔNG TIN HÀNH CHÍNH BỆNH NHÂN */}
            <div>
              <h3 className={headingClass}>I. Thông tin bệnh nhân</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 pl-2">
                <div>
                  <span className="text-slate-400 font-medium">Họ và tên bệnh nhân:</span>
                  <span className="ml-2 font-bold text-slate-900">{result.patientName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Mã phiếu lưu trữ:</span>
                  <span className="ml-2 font-semibold text-slate-800">RES-{result.resultId}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium">Ngày thực hiện ghi nhận:</span>
                  <span className="ml-2 font-semibold text-slate-800">{result.enteredAt?.split('T')[0] || '—'}</span>
                </div>
              </div>
            </div>

            {/* MỤC II: CHỈ ĐỊNH Y KHOA & NHÂN SỰ THỰC HIỆN */}
            <div>
              <h3 className={headingClass}>II. Thông tin chỉ định & Nhân sự thực hiện</h3>
              {/* Thay đổi thành flex-col để bắt buộc mỗi mục nằm trên 1 hàng riêng biệt */}
              <div className="flex flex-col gap-3 pl-2">
                <div>
                  <span className="text-slate-400 font-medium">Bác sĩ chỉ định lâm sàng:</span>
                  <span className="ml-2 font-bold text-slate-800">{doctorName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Kỹ thuật viên thực hiện:</span>
                  <span className="ml-2 font-bold text-slate-800">{result.performerName || result.enteredName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Trạng thái hồ sơ:</span>
                  <span className="ml-2 font-semibold text-emerald-600">Đã xác nhận hoàn tất và ký số kết quả</span>
                </div>
              </div>
            </div>

            {/* MỤC III: CHỈ SỐ XÉT NGHIỆM CHI TIẾT */}
            <div>
              <h3 className={headingClass}>III. Chỉ số kết quả xét nghiệm</h3>
              <div className="pl-2 pr-4 py-2 text-slate-700 whitespace-pre-wrap leading-relaxed font-mono bg-slate-50/50 p-3 rounded-lg print:bg-white print:p-0 print:font-sans">
                {result.resultData || 'Không có dữ liệu chỉ số chỉ định.'}
              </div>
            </div>

            {/* MỤC IV: KẾT LUẬN CHUYÊN MÔN LÂM SÀNG */}
            <div>
              <h3 className={headingClass}>IV. Kết luận lâm sàng</h3>
              <div className="pl-2 text-slate-900 font-bold whitespace-pre-wrap leading-relaxed">
                {result.conclusion || 'Chưa có kết luận cụ thể.'}
              </div>
            </div>

          </div>

          {/* CHỮ KÝ XÁC NHẬN PHÒNG XÉT NGHIỆM */}
          <div className="pt-12 flex justify-between items-start">
            <div className="text-xs text-slate-400 italic font-medium print:text-black">
              * Người nhập liệu: {result.enteredName || '—'}
            </div>
            <div className="text-center text-sm print:text-xs">
              <p className="text-slate-500 italic mb-1 print:text-black">
                Ngày ..... tháng ..... năm 20...
              </p>
              <p className="font-bold text-slate-700 uppercase tracking-wide text-xs">
                Kỹ thuật viên xét nghiệm
              </p>
              <div className="h-24" />
              <p className="font-black text-slate-800">
                {result.performerName || result.enteredName || '—'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}