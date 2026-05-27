import React from 'react';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ServiceOrder } from '../types/record';

interface LabResultViewerModalProps {
  serviceOrders: ServiceOrder[];
}

export const LabResultViewerModal: React.FC<LabResultViewerModalProps> = ({ serviceOrders }) => {
  const ordersWithResult = serviceOrders.filter((order) => order.result);

  if (ordersWithResult.length === 0) {
    return (
      <Button
        variant="outline"
        disabled
        className="rounded-xl border-slate-200 text-slate-400 font-bold h-10 px-4"
      >
        <Activity className="w-4 h-4 mr-2" /> Chưa có kết quả
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl border-primary-500 text-primary-500 hover:bg-primary-50 font-bold h-10 px-4 transition-all"
        >
          <Activity className="w-4 h-4 mr-2" /> Kết quả cận lâm sàng ({ordersWithResult.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-6xl rounded-3xl bg-white border-0 p-0 overflow-hidden shadow-xl">
        <DialogHeader className="bg-primary-50 px-8 py-5 border-b border-border-default">
          <DialogTitle className="text-xl font-black text-brand-dark flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" /> Kết quả Xét nghiệm & Chẩn đoán
          </DialogTitle>
        </DialogHeader>
        <div className="p-0 overflow-y-auto max-h-[70vh]">
          <table className="w-full text-left text-[14.5px] text-slate-600">
            <thead className="bg-background-light text-slate-500 font-bold border-b border-border-default sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-8 py-5 w-[30%]">Xét nghiệm</th>
                <th className="px-8 py-5 w-[25%]">Kết quả</th>
                <th className="px-8 py-5 w-[30%]">Kết luận</th>
                <th className="px-8 py-5 w-[15%]">Đánh giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {ordersWithResult.map((order) => {
                const isNormal = order.result?.conclusion?.toLowerCase().includes('bình thường') ?? false;
                return (
                  <tr key={order.orderId} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-brand-dark">{order.serviceName}</td>
                    <td className="px-8 py-5 font-black text-[15px] text-primary-600">{order.result?.resultData}</td>
                    <td className="px-8 py-5 font-medium">{order.result?.conclusion}</td>
                    <td className="px-8 py-5">
                      {isNormal ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-bold text-[13px] border border-green-100">
                          <CheckCircle2 className="w-4 h-4" /> Bình thường
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold text-[13px] border border-red-100">
                          <AlertCircle className="w-4 h-4" /> Bất thường
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};