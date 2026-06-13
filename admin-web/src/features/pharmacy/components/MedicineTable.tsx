import React from 'react';
import { Edit2, Trash2, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Medicine } from '../types/pharmacy';

interface Props {
  data: Medicine[];
  onEdit: (med: Medicine) => void;
  onDelete: (med: Medicine) => void;
}

export default function MedicineTable({ data, onEdit, onDelete }: Props) {
  const getStockStatus = (qty: number, min: number) => {
    if (qty <= 0) return <Badge className="bg-rose-100 text-rose-700 border-0 shadow-none px-2 py-0.5 uppercase text-[10px] font-black">Out of Stock</Badge>;
    if (qty <= min) return <Badge className="bg-amber-100 text-amber-700 border-0 shadow-none px-2 py-0.5 uppercase text-[10px] font-black">Low Stock</Badge>;
    return <Badge className="bg-emerald-100 text-emerald-700 border-0 shadow-none px-2 py-0.5 uppercase text-[10px] font-black">In Stock</Badge>;
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Medicine Info</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Stock & Price</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(med => (
            <TableRow key={med.medicineId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Pill size={18}/></div>
                  <div>
                    <p className="font-bold text-slate-900">{med.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{med.activeElement} • {med.productionUnit}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-black text-blue-600">${med.sellPrice.toFixed(2)} <span className="text-xs font-medium text-slate-400">/ {med.unit}</span></p>
                <p className="text-xs font-bold text-slate-600 mt-1">Qty: {med.quantity} (Min: {med.min_stock_level})</p>
              </TableCell>
              <TableCell className="text-center">{getStockStatus(med.quantity, med.min_stock_level)}</TableCell>
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-1.5">
                  <Button onClick={() => onEdit(med)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-xl text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-50">
                    <Edit2 size={14}/><span>Sửa</span>
                  </Button>
                  <Button onClick={() => onDelete(med)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-xl text-rose-600 border-rose-100 bg-rose-50/50 hover:bg-rose-50">
                    <Trash2 size={14}/><span>Xoá</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}