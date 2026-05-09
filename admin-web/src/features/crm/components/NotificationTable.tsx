import React from 'react';
import { Mail, SmartphoneNfc } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppNotification } from '../types/crm';

export default function NotificationTable({ data }: { data: AppNotification[] }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Sent At</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Type</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Recipient</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Message Content</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(notif => (
            <TableRow key={notif.notification_id} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="font-bold text-slate-900">{notif.sent_at.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">{notif.sent_at.split(' ')[1]}</p>
              </TableCell>
              <TableCell>
                {notif.type === 'EMAIL' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 font-black text-[10px] uppercase rounded-lg border border-amber-200"><Mail size={12}/> Email</span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase rounded-lg border border-indigo-200"><SmartphoneNfc size={12}/> System</span>
                )}
              </TableCell>
              <TableCell><span className="font-bold text-slate-800">{notif.account_name || 'Unknown'}</span></TableCell>
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