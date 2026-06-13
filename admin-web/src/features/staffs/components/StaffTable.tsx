import React from 'react';
import { Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Staff } from '../types/staff';
import { getRoleIcon } from './StaffFilterBar';

interface Props {
  data: Staff[];
  onEdit: (s: Staff) => void;
  onDelete: (s: Staff) => void;
}

export default function StaffTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-6 h-12">Employee</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Contact</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Role & Specialty</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Status</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? data.map((staff) => (
            <TableRow key={staff.staff_id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${
                    staff.staff_type === 'DOCTOR' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {staff.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{staff.full_name}</p>
                    <p className="text-xs text-slate-500 font-medium">STF-{staff.staff_id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Mail size={14} className="inline text-slate-400 mr-2"/>{staff.email}<br/>
                <Phone size={14} className="inline text-slate-400 mr-2 mt-1"/>{staff.phone}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-bold rounded-lg bg-slate-100 text-slate-700 border-0 uppercase tracking-wider text-[10px]">
                  {getRoleIcon(staff.staff_type)}
                  {staff.staff_type.replace('_', ' ')}
                </Badge>
                {staff.staff_type === 'DOCTOR' && (
                  <p className="text-xs text-slate-500 font-semibold mt-2 ml-1">Spec: {staff.expertise_name}</p>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={`font-bold border-0 px-2.5 py-1 ${staff.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {staff.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-1.5">
                  <Button onClick={() => onEdit(staff)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-xl text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-50">
                    <Edit2 size={14} /><span>Sửa</span>
                  </Button>
                  <Button onClick={() => onDelete(staff)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-xl text-rose-600 border-rose-100 bg-rose-50/50 hover:bg-rose-50">
                    <Trash2 size={14} /><span>Xoá</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-slate-500 font-medium">No staff found matching your criteria.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}