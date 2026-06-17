import React from 'react';
import { Mail, SmartphoneNfc, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppNotification } from '../types/crm';
import { formatDateTime } from '@/utils/formatters';

export default function NotificationTable({ data }: { data: AppNotification[] }) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-medium text-sm">Không có thông báo nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-auto custom-scrollbar">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100/80 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[20%] text-sm">Ngày gửi</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%] text-sm">Loại</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%] text-sm">Người nhận</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[40%] text-sm">Nội dung thông báo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((notif) => (
            <TableRow key={notif.notificationId} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
              <TableCell className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" /> {formatDateTime(notif.sentAt)}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">#NOTIF-{notif.notificationId}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                {notif.type === 'EMAIL' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 font-semibold text-xs uppercase rounded-lg border border-amber-200">
                    <Mail size={12} /> Email
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 font-semibold text-xs uppercase rounded-lg border border-indigo-200">
                    <SmartphoneNfc size={12} /> Hệ thống
                  </span>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="font-semibold text-slate-800 text-sm">{notif.accountName || 'Unknown'}</span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="text-sm font-medium text-slate-600 max-w-[400px] truncate block">{notif.content}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}