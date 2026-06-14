import React from 'react';
import { Mail, SmartphoneNfc, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppNotification } from '../types/crm';
import { formatDateTime } from '@/utils/formatters';

export default function NotificationTable({ data }: { data: AppNotification[] }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14 border-b border-slate-200 hover:bg-transparent">
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] px-8 w-[20%]">Ngày gửi</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[15%]">Loại</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[25%]">Người nhận</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[40%]">Nội dung thông báo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(notif => (
            <TableRow key={notif.notificationId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5"><Calendar size={13} className="text-slate-400" /> {formatDateTime(notif.sentAt)}</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-widest mt-0.5">#NOTIF-{notif.notificationId}</p>
              </TableCell>
              <TableCell>
                {notif.type === 'EMAIL' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 font-black text-[10px] uppercase rounded-lg border border-amber-200"><Mail size={12} /> Email</span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase rounded-lg border border-indigo-200"><SmartphoneNfc size={12} /> System</span>
                )}
              </TableCell>
              <TableCell><span className="font-bold text-slate-900 text-[14px]">{notif.accountName || 'Unknown'}</span></TableCell>
              <TableCell>
                <span className="text-sm font-medium text-slate-600 max-w-[400px] truncate block">{notif.content}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}