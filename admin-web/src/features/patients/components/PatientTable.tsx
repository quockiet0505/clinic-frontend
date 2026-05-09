import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
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
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Patient Identity</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Contact Details</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Date of Birth</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((patient) => (
            <TableRow key={patient.patient_id} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                    {patient.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{patient.full_name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                      PAT-{patient.patient_id} • {patient.gender}
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
                <div className="flex justify-end gap-2">
                  <Button onClick={() => onViewDetails(patient.patient_id)} variant="outline" size="sm" className="w-9 h-9 p-0 rounded-xl text-emerald-600 border-slate-200 hover:bg-emerald-50"><Eye size={16}/></Button>
                  <Button onClick={() => onEdit(patient)} variant="outline" size="sm" className="w-9 h-9 p-0 rounded-xl text-blue-600 border-slate-200 hover:bg-blue-50"><Edit size={16}/></Button>
                  <Button onClick={() => onDelete(patient)} variant="outline" size="sm" className="w-9 h-9 p-0 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50"><Trash2 size={16}/></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}