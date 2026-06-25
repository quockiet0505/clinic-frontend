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
      <div className="text-center p-10 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl">
        Chưa có chỉ định cận lâm sàng. Bấm 「Tạo chỉ định」 để thêm xét nghiệm / CĐHA.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.orderId} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              {statusIcon(order.status)}
              <span className="font-semibold text-slate-800">{order.serviceName}</span>
              <span className="text-xs text-slate-500">#{order.orderId}</span>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {order.result ? (
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Kết quả</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{order.result.resultData || '—'}</p>
              </div>
              {order.result.conclusion && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                  <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Kết luận</p>
                  <p className="text-sm text-emerald-900">{order.result.conclusion}</p>
                </div>
              )}
              <p className="text-xs text-slate-400">
                Nhập bởi {order.result.enteredBy} · {order.result.enteredAt}
              </p>
            </div>
          ) : (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Chờ phòng cận lâm sàng nhập kết quả.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
