import React from 'react';
import { ArrowDownRight, ArrowUpRight, ShieldAlert, PackageMinus, Settings2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InventoryTransaction } from '../types/pharmacy';

export default function InventoryLogTable({ data }: { data: InventoryTransaction[] }) {
  const getTransactionUI = (type: string) => {
    switch(type) {
      case 'IMPORT': return { icon: <ArrowDownRight size={14} className="mr-1.5"/>, color: 'text-blue-600 bg-blue-50' };
      case 'DISPENSE': return { icon: <ArrowUpRight size={14} className="mr-1.5"/>, color: 'text-emerald-600 bg-emerald-50' };
      case 'EXPIRED': return { icon: <ShieldAlert size={14} className="mr-1.5"/>, color: 'text-amber-600 bg-amber-50' };
      case 'LOST': return { icon: <PackageMinus size={14} className="mr-1.5"/>, color: 'text-rose-600 bg-rose-50' };
      case 'ADJUSTMENT': return { icon: <Settings2 size={14} className="mr-1.5"/>, color: 'text-slate-600 bg-slate-100' };
      default: return { icon: null, color: 'text-slate-600 bg-slate-100' };
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Date & Reference</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Medicine</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Transaction Type</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Quantity Diff</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(log => {
            const ui = getTransactionUI(log.transaction_type);
            const isPositive = log.quantity > 0;
            return (
              <TableRow key={log.transaction_id} className="hover:bg-slate-50/50">
                <TableCell className="px-8 py-4">
                  <p className="font-bold text-slate-900">{log.created_at.replace('T', ' ')}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">REF: {log.reference_id || 'N/A'}</p>
                </TableCell>
                <TableCell>
                  <p className="font-bold text-slate-800">{log.medicine_name}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">Staff: {log.handled_by_name}</p>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${ui.color}`}>
                    {ui.icon} {log.transaction_type}
                  </span>
                  {log.note && <p className="text-xs text-slate-400 font-medium mt-1.5 truncate max-w-[250px]">{log.note}</p>}
                </TableCell>
                <TableCell className="text-right pr-8">
                  <span className={`text-lg font-black ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isPositive ? '+' : ''}{log.quantity}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}