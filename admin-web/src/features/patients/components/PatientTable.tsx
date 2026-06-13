import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Patient } from '../types/patient';

interface Props {
  data: Patient[];
  onViewDetails: (id: number) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export default function PatientTable({ data, onViewDetails, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Bệnh nhân</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Thông tin liên hệ</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Ngày sinh</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((patient) => (
            <TableRow key={patient.patientId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                    {patient.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{patient.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                      PAT-{patient.patientId} • {patient.gender === 'MALE' ? 'Nam' : patient.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm font-bold text-slate-700">{patient.phone}</p>
                <p className="text-xs font-medium text-slate-500 max-w-[200px] truncate">{patient.address}</p>
              </TableCell>
              <TableCell className="text-sm font-medium text-slate-600">{patient.date_of_birth}</TableCell>
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-1.5">
                  <Button onClick={() => onViewDetails(patient.patientId)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer">
                    <Eye size={14} /><span>Chi tiết</span>
                  </Button>
                  <Button onClick={() => onEdit(patient)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all cursor-pointer">
                    <Edit2 size={14} /><span>Sửa</span>
                  </Button>
                  <Button onClick={() => onDelete(patient)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all cursor-pointer">
                    <Trash2 size={14} /><span>Xoá</span>
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