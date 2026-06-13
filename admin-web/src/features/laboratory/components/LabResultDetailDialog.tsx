import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Microscope, Printer, Download, CheckCircle2 } from 'lucide-react';

export default function LabResultDetailModal({ result, onClose }: any) {
  if (!result) return null;

  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 rounded-[24px] shadow-2xl">
        {/* HEADER đồng bộ */}
        <div className="bg-primary-50 p-6 border-b border-primary-100 rounded-t-[24px]">
          <div className="flex items-center gap-2 mb-2 text-primary-600">
            <Microscope size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Báo cáo xét nghiệm</span>
          </div>
          <DialogTitle className="text-2xl font-semibold">{result.serviceName}</DialogTitle>
          <DialogDescription className="text-sm text-primary-600/80 font-medium mt-1 flex items-center gap-2 flex-wrap">
            <span>Bệnh nhân: <strong className="text-primary-800">{result.patientName}</strong></span>
            <span className="opacity-50">•</span>
            <span>Ngày: {result.enteredAt?.split('T')[0]}</span>
            <span className="opacity-50">•</span>
            <span>Mã: RES-{result.resultId}</span>
          </DialogDescription>
        </div>

        {/* BODY giữ nguyên */}
        <div className="p-6 bg-white space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bác sĩ chỉ định</p>
              <p className="font-bold text-slate-900 text-sm">BS. {result.doctorName}</p>
            </div>
            <div className="bg-emerald-100 text-emerald-700 text-xs font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 size={14}/> Đã xác nhận
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Chỉ số xét nghiệm</h3>
            <div className="bg-slate-50 rounded-[16px] border border-slate-100 p-5 min-h-[100px]">
              <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-loose font-mono">{result.resultData}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest">Kết luận lâm sàng</h3>
            <div className="bg-primary-50/50 rounded-[16px] border border-primary-100 p-5">
              <p className="text-sm font-bold text-slate-800 whitespace-pre-wrap leading-relaxed">{result.conclusion}</p>
            </div>
          </div>
          <div className="pt-2 text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Người nhập kết quả</p>
            <p className="font-bold text-slate-800 text-base">{result.enteredName}</p>
          </div>
        </div>

        {/* FOOTER đồng bộ */}
        <DialogFooter className="p-6 pb-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-[24px]">
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-[14px] font-bold border-slate-300 text-slate-700 hover:bg-slate-100">
              <Printer size={16} className="mr-2" /> In
            </Button>
            <Button variant="outline" className="h-11 px-4 rounded-[14px] font-bold border-primary-200 text-primary hover:bg-primary-50">
              <Download size={16} className="mr-2" /> Tải PDF
            </Button>
          </div>
          <Button onClick={onClose} className="h-11 px-6 rounded-[14px] bg-slate-800 hover:bg-slate-900 shadow-sm text-white font-bold">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}