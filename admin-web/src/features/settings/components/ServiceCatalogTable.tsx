import React from 'react';
import { Edit, Trash2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { Service } from '../types/settings';

export default function ServiceCatalogTable({ data, onEdit, onDelete }: any) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            {/* Ẩn cột ID theo yêu cầu của sếp */}
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Service Name</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Category</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Base Price</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: Service) => (
            <TableRow key={item.service_id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
              <TableCell className="px-8 py-5">
                <div className="flex items-center gap-3 font-bold text-slate-900">
                  <Activity size={18} className="text-blue-500" />
                  {item.service_name}
                </div>
              </TableCell>
              <TableCell><StatusBadge status={item.service_type} /></TableCell>
              <TableCell className="font-black text-blue-600">${item.price.toFixed(2)}</TableCell>
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-2">
                  <Button onClick={() => onEdit(item)} variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl text-blue-600 border-slate-200">
                    <Edit size={16} />
                  </Button>
                  <Button onClick={() => onDelete(item)} variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl text-rose-600 border-slate-200">
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