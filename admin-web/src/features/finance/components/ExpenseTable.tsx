import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClinicExpense } from '../types/finance';

export default function ExpenseTable({ data, onRowClick }: { data: ClinicExpense[], onRowClick: (e: ClinicExpense) => void }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 text-[11px] uppercase px-8">ID & Date</TableHead>
            <TableHead className="font-bold text-slate-600 text-[11px] uppercase">Category</TableHead>
            <TableHead className="font-bold text-slate-600 text-[11px] uppercase">Mô tả</TableHead>
            <TableHead className="font-bold text-slate-600 text-[11px] uppercase text-center">Method</TableHead>
            <TableHead className="font-bold text-slate-600 text-[11px] uppercase text-right pr-8">Số tiền</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((exp) => (
            <TableRow key={exp.expenseId} className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => onRowClick(exp)}>
              <TableCell className="px-8 py-4">
                <p className="font-bold text-slate-900">EXP-{exp.expenseId}</p>
                <p className="text-xs text-slate-500 font-medium">{exp.expenseDate}</p>
              </TableCell>
              <TableCell><span className="font-bold text-slate-700">{exp.categoryName}</span></TableCell>
              <TableCell><span className="text-sm font-medium text-slate-600 max-w-[300px] truncate block">{exp.description}</span></TableCell>
              <TableCell className="text-center">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 border border-slate-200">
                  {exp.paymentMethod}
                </span>
              </TableCell>
              <TableCell className="text-right pr-8">
                <span className="text-lg font-black text-rose-600">-${Number(exp.amount).toFixed(2)}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}