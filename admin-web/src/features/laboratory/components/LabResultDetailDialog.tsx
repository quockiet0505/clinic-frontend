import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Microscope, Printer, Download, CheckCircle2 } from 'lucide-react';

export default function LabResultDetailModal({ result, onClose }: any) {
  if (!result) return null;

  const doctorName = result.doctorName?.startsWith('BS.') ? result.doctorName : `BS. ${result.doctorName}`;

  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        {/* Header giữ nguyên */}
        <div className="bg-primary-50 p-5 border-b border-primary-100">
          <div className="flex items-center gap-2 mb-2 text-primary-600">
            <Microscope size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Báo cáo xét nghiệm</span>
          </div>
          <DialogTitle className="text-xl font-bold text-slate-800">{result.serviceName}</DialogTitle>
          <DialogDescription className="text-sm text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
            <span>Bệnh nhân: <span className="font-medium text-slate-800">{result.patientName}</span></span>
            <span className="opacity-40">•</span>
            <span>Ngày: {result.enteredAt?.split('T')[0]}</span>
            <span className="opacity-40">•</span>
            <span>Mã: RES-{result.resultId}</span>
          </DialogDescription>
        </div>

        {/* Body - đồng bộ style cho tất cả các section */}
        <div className="p-5 bg-white space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Bác sĩ chỉ định - cũng có khung đồng bộ */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-slate-700">Bác sĩ chỉ định</p>
                <p className="text-sm text-slate-800 mt-1">{doctorName}</p>
              </div>
              <div className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Đã xác nhận
              </div>
            </div>
          </div>

          {/* Chỉ số xét nghiệm */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Chỉ số xét nghiệm</h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{result.resultData}</p>
          </div>

          {/* Kết luận lâm sàng */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Kết luận lâm sàng</h3>
            <p className="text-sm font-medium text-slate-800 whitespace-pre-wrap">{result.conclusion}</p>
          </div>

          {/* Người nhập kết quả - không khung, chỉ text */}
          <div className="text-right pt-2">
            <p className="text-xs font-semibold text-slate-500">Người nhập kết quả</p>
            <p className="text-sm font-medium text-slate-800">{result.enteredName}</p>
          </div>
        </div>

        {/* Footer - nút bấm đồng bộ, không màu đỏ */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
          <div className="flex gap-3">
            <Button
              
              className="h-9 px-4 rounded-lg font-medium border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
            >
              <Printer size={15} className="mr-1.5" /> In
            </Button>
            <Button
             
              className="h-9 px-4 rounded-lg font-medium border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
            >
              <Download size={15} className="mr-1.5" /> Tải PDF
            </Button>
          </div>
          <Button
            onClick={onClose}
            className="h-9 px-5 rounded-lg bg-primary text-white font-medium hover:bg-primary-600 transition-all"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}