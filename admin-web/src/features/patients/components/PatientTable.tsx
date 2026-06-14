import React from 'react';
import { Eye, Edit2, Trash2, Phone, MapPin } from 'lucide-react';
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
  if (!data.length) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Không có bệnh nhân nào.</p>
      </div>
    );
  }

  const formatGender = (gender?: string) => {
    if (gender === 'MALE') return 'Nam';
    if (gender === 'FEMALE') return 'Nữ';
    return 'Khác';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[25%]">Bệnh nhân</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[35%]">Thông tin liên hệ</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[10%]">Ngày sinh</TableHead>
            <TableHead className="px-6 py-4 text-left font-semibold text-slate-700 w-[30%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((patient) => (
            <TableRow key={patient.patientId} className="hover:bg-slate-50 border-b border-slate-100">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {patient.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{patient.fullName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      #{patient.patientId} • {formatGender(patient.gender)}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Phone size={14} className="text-blue-500 shrink-0" />
                    <span>{patient.phone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <MapPin size={14} className="text-rose-500 shrink-0" />
                    <span className="truncate max-w-[260px]" title={patient.address}>
                      {patient.address || '—'}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-sm text-slate-600">
                {patient.dateOfBirth || '—'}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => onViewDetails(patient.patientId)}
                    variant="outline"
                    className="h-8 px-3 rounded-lg text-xs font-medium border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all"
                  >
                    <Eye size={14} className="mr-1.5" /> Chi tiết
                  </Button>
                  <Button
                    onClick={() => onEdit(patient)}
                    variant="outline"
                    className="h-8 px-3 rounded-lg text-xs font-medium border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all"
                  >
                    <Edit2 size={14} className="mr-1.5" /> Sửa
                  </Button>
                  <Button
                    onClick={() => onDelete(patient)}
                    variant="outline"
                    className="h-8 px-3 rounded-lg text-xs font-medium border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all"
                  >
                    <Trash2 size={14} className="mr-1.5" /> Xóa
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