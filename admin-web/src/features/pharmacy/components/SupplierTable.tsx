import React from 'react';
import { Building2, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Supplier } from '../types/pharmacy';

export default function SupplierTable({ data, onEdit, onDelete }: { data: Supplier[], onEdit: (s: Supplier) => void, onDelete: (s: Supplier) => void }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Supplier Info</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Contact Person</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(sup => (
            <TableRow key={sup.supplierId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Building2 size={18} /></div>
                  <div>
                    <p className="font-bold text-slate-900">{sup.supplierName}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-[200px] truncate">{sup.address}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-800">{sup.contactName}</p>
                <div className="text-xs text-slate-500 font-medium mt-1 space-y-0.5">
                  <p className="flex items-center gap-1"><Phone size={10} /> {sup.phone}</p>
                  <p className="flex items-center gap-1"><Mail size={10} /> {sup.email}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={`font-bold border-0 px-2.5 py-1 ${sup.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {sup.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-2">
                  <Button onClick={() => onEdit(sup)} variant="outline" size="sm" className="w-9 h-9 p-0 rounded-xl text-blue-600 border-slate-200 hover:bg-blue-50"><Edit size={16} /></Button>
                  <Button onClick={() => onDelete(sup)} variant="outline" size="sm" className="w-9 h-9 p-0 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50"><Trash2 size={16} /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}