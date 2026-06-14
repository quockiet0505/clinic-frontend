import React from 'react';
import { Phone, History, BellRing, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { FollowUp } from '../types/appointment';

interface Props {
  data: FollowUp[];
  onLogCall: (fu: FollowUp) => void;
  onSendReminder: (fu: FollowUp) => void;
}

export default function FollowUpTable({ data, onLogCall, onSendReminder }: Props) {
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có lịch tái khám nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%]">Thông tin bệnh nhân</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[35%]">Chi tiết nhắc nhở</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[15%]">Trạng thái</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.followUpId} className="hover:bg-slate-50 border-b border-slate-100">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm uppercase">
                    {item.patientName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.patientName}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <Phone size={12} className='text-blue-500' />
                      <span>{item.phone}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="text-sm font-medium text-slate-700">{item.note.split('|')[0]}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
                  <History size={12} />
                  <span>Đến hạn: {item.scheduledDatetime}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <StatusBadge status={item.status} />
                {item.note.includes('| Log:') && (
                  <p className="text-xs text-slate-500 mt-1 truncate max-w-[180px]" title={item.note.split('| Log:')[1]}>
                    {item.note.split('| Log:')[1]}
                  </p>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                {item.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onSendReminder(item)}
                      variant="outline"
                      className="h-8 px-3 rounded-lg text-xs font-medium border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-all"
                    >
                      <BellRing size={14} className="mr-1.5" /> 
                    </Button>
                    <Button
                      onClick={() => onLogCall(item)}
                      className="h-8 px-3 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                    >
                      <Phone size={14} className="mr-1.5" /> Ghi nhận cuộc gọi
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}