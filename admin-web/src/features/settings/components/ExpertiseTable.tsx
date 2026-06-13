import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Expertise } from '../types/settings';

interface Props {
  data: Expertise[];
  onDelete: (id: number) => void;
  onEdit: (item: Expertise) => void;
}

export default function ExpertiseTable({ data, onDelete, onEdit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-6 h-12">Specialty Name</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Mô tả</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Assigned Staff</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-6">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.expertiseId} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="px-6 py-4">
                  <p className="font-bold text-slate-900">{item.expertiseName}</p>
                  <p className="text-xs text-slate-500 font-medium">EXP-{item.expertiseId}</p>
                </TableCell>
                <TableCell><span className="text-sm text-slate-600">{item.description}</span></TableCell>
                <TableCell className="text-center"><span className="font-bold text-slate-900">{item.doctorCount} Doctors</span></TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`font-bold border px-2.5 py-1 rounded-lg ${
                    item.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => onEdit(item)} variant="outline" size="sm" className="w-8 h-8 p-0 text-blue-600 hover:bg-blue-50 border-slate-200">
                      <Edit size={14} />
                    </Button>
                    <Button 
                      onClick={() => onDelete(item.expertiseId)} 
                      disabled={item.doctorCount > 0}
                      variant="outline" size="sm" className="w-8 h-8 p-0 text-rose-600 hover:bg-blue-50 border-slate-200 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-slate-500 font-medium">No specialties found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}