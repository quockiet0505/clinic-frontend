import React from 'react';
import { Clock, CheckCircle2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BillInvoice } from '../types/finance';

export default function InvoiceTable({ data, onActionClick, onPrintClick }: { data: BillInvoice[], onActionClick: (inv: BillInvoice) => void, onPrintClick: (id: number) => void }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNPAID': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PAID': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REFUNDED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CANCELLED': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Invoice</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Bệnh nhân</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Total Amount</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-left">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-left w-[15%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((inv) => (
            <TableRow key={inv.billId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="font-bold text-slate-900">BILL-{inv.billId}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{inv.createdAt}</p>
              </TableCell>
              <TableCell><span className="font-bold text-slate-700">{inv.patientName}</span></TableCell>
              <TableCell><span className="font-black text-slate-900">${inv.totalPrice.toFixed(2)}</span></TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={`font-bold border px-2.5 py-1 rounded-lg ${getStatusBadge(inv.status)}`}>
                  {inv.status === 'UNPAID' && <Clock size={12} className="mr-1.5 inline" />}
                  {inv.status === 'PAID' && <CheckCircle2 size={12} className="mr-1.5 inline" />}
                  {inv.status}
                </Badge>
              </TableCell>
              <TableCell className="">
                <div className="flex items-center justify-center gap-2">
                  <Button onClick={() => onActionClick(inv)} variant={inv.status === 'PAID' ? 'outline' : 'default'} size="sm" className={`h-9 font-bold rounded-xl px-4 ${inv.status === 'UNPAID' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {inv.status === 'PAID' ? 'View Details' : 'Collect Payment'}
                  </Button>
                  {inv.status === 'PAID' && (
                    <Button onClick={() => onPrintClick(inv.billId)} variant="outline" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-700 rounded-xl border-slate-200">
                      <Printer size={16} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}