import React from 'react';
import { FlaskConical, CheckCircle2, Hourglass, XCircle } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import type { ServiceOrder } from '../types/medical';

interface Props {
  orders: ServiceOrder[];
}

const statusIcon = (status: string) => {
  if (status === 'DONE') return <CheckCircle2 size={14} className="text-emerald-600" />;
  if (status === 'ORDERED') return <Hourglass size={14} className="text-amber-600" />;
  if (status === 'CANCELLED' || status === 'REJECTED') return <XCircle size={14} className="text-rose-600" />;
  return <FlaskConical size={14} className="text-slate-500" />;
};

export default function ConsultationOrdersPanel({ orders }: Props) {
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
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold border-t border-slate-100 pt-3 select-none">
                <span>Nhập bởi: {order.result.enteredBy}</span>
                <span>Thời gian: {order.result.enteredAt}</span>
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
