import React from 'react';
import { CalendarDays, UserRound, X, Download, FlaskConical, AlertCircle, Activity, FileText } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

const getStatusProps = (result: any) => {
  const data = result.resultData?.toLowerCase() || '';
  const conclusion = result.conclusion?.toLowerCase() || '';
  
  if (data.includes('bất thường') || conclusion.includes('bất thường') || data.includes('cao') || data.includes('thấp')) {
    return { label: 'Bất thường', color: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500' };
  }
  if (!result.resultData && !result.conclusion) {
    return { label: 'Đang xử lý', color: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500' };
  }
  return { label: 'Đã có kết quả', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' };
};

export const LabResultModalContent = ({ result }: { result: any }) => {
  const status = getStatusProps(result);
  return (
    <DialogContent showCloseButton={false} className="w-[95vw] sm:max-w-5xl max-w-5xl rounded-3xl bg-white border-0 p-0 shadow-2xl overflow-hidden">
      <div className="flex flex-col" style={{ maxHeight: '85vh' }}>
        <DialogHeader className="bg-white px-6 md:px-8 py-5 border-b border-slate-200 shrink-0 relative">
          <DialogTitle className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-start pr-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shrink-0 shadow-inner">
                  <FlaskConical className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col mt-1">
                  <h2 className="text-xl font-black text-slate-800 leading-tight">
                    {result.serviceName || 'Xét nghiệm cận lâm sàng'}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-[13px] text-slate-500 font-medium flex-wrap">
                    <span>Mã XN: <strong className="text-slate-700">#{String(result.resultId || '00000').padStart(5, '0')}</strong></span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>{new Date(result.enteredAt || new Date()).toLocaleString('vi-VN')}</span>
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
            <div className="flex flex-col gap-6">
              {status.label === 'Bất thường' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-800 text-[14.5px]">Phát hiện chỉ số bất thường</h4>
                    <p className="text-[13.5px] text-amber-700 font-medium mt-0.5">Vui lòng xem chi tiết ở bảng kết quả và đọc kết luận của bác sĩ.</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bác sĩ chỉ định</p>
                  <p className="font-bold text-slate-700 text-[15px]">{result.doctorName || 'Đang cập nhật'}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kỹ thuật viên</p>
                  <p className="font-bold text-slate-700 text-[15px]">{result.enteredBy || 'Đang cập nhật'}</p>
                </div>
              </div>
              <div className="w-full h-px bg-slate-200"></div>
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[13px] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Kết luận của bác sĩ
                </h3>
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <p className="font-bold text-slate-700 text-[15px] whitespace-pre-wrap leading-relaxed">
                    {result.conclusion || 'Đang chờ bác sĩ kết luận.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[13px] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-500" /> Kết quả đo lường
                </h3>
                <div className={`px-2.5 py-1 rounded-full border text-[11.5px] font-bold flex items-center gap-1.5 ${status.color}`}>
                  {status.label}
                </div>
              </div>
              <div className="flex-1 bg-slate-50/50 rounded-xl border border-slate-100 p-4 overflow-y-auto">
                <div className="font-medium text-[15px] whitespace-pre-wrap leading-relaxed text-slate-800">
                  {result.resultData || 'Chưa có dữ liệu.'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-t border-slate-200 p-4 px-6 md:px-8 flex gap-3 justify-end shrink-0">
          <button className="cursor-pointer px-5 py-2.5 rounded-xl border border-transparent bg-emerald-500 font-bold text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 text-[14px] shadow-sm shadow-emerald-200">
            <Download className="w-4 h-4" /> Tải PDF
          </button>
        </div>
      </div>
    </DialogContent>
  );
};
