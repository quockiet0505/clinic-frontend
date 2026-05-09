import React from 'react';
import { Edit, Trash2, UserCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DoctorPricing } from '../types/settings';

export default function PricingTable({ doctors, onEdit, onDelete }: any) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Doctor Member</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Specialty</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Current Price</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doc: DoctorPricing) => (
            <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
              <TableCell className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <UserCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{doc.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: STF-{doc.staff_id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-slate-600">{doc.specialty}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center font-black text-emerald-600 text-lg">
                  <DollarSign size={16} />
                  {doc.fee.toFixed(2)}
                </div>
              </TableCell>
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={() => onEdit(doc)} 
                    variant="outline" 
                    size="sm" 
                    className="h-9 w-9 p-0 rounded-xl text-blue-600 border-slate-200 hover:bg-blue-50"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    onClick={() => onDelete(doc)} 
                    variant="outline" 
                    size="sm" 
                    className="h-9 w-9 p-0 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50"
                  >
                    <Trash2 size={16} />
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