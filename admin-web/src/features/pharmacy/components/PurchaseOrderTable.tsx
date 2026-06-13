import React from 'react';
import { PackageOpen, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { PurchaseOrder } from '../types/pharmacy';

export default function PurchaseOrderTable({ data, onMarkReceived, onCancel }: any) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Order Detail</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Supplier</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((po: PurchaseOrder) => (
            <TableRow key={po.poId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="font-black text-slate-900">${po.totalAmount.toFixed(2)}</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5">PO-{po.poId} • {po.orderDate.split('T')[0]}</p>
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-900">{po.supplierName}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">By {po.created_by_name}</p>
              </TableCell>
              <TableCell className="text-center"><StatusBadge status={po.status} /></TableCell>
              <TableCell className="text-right pr-8">
                {po.status === 'PENDING' ? (
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => onMarkReceived(po.poId)} variant="outline" size="sm" className="h-9 font-bold rounded-xl text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                      <PackageOpen size={16} className="mr-1.5"/> Mark Received
                    </Button>
                    <Button onClick={() => onCancel(po)} variant="outline" size="icon" className="h-9 w-9 rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50">
                      <XCircle size={16}/>
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="h-9 font-bold text-slate-400 cursor-pointer">
                    <FileText size={16} className="mr-1.5"/> View PO
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}