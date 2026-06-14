import React from 'react';
import { Eye, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { MedicalRecord } from '../types/medical';

export default function MedicalRecordTable({ data, onViewDetail }: { data: MedicalRecord[], onViewDetail: (id: number) => void }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Date & Record ID</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Bệnh nhân</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Diagnosis & Provider</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-left w-[15%]">Trạng thái</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-left w-[15%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(rec => (
            <TableRow key={rec.recordId} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="font-bold text-slate-900">{rec.createdAt}</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5">REC-{rec.recordId}</p>
              </TableCell>
              <TableCell><p className="font-bold text-slate-900">{rec.patientName}</p></TableCell>
              <TableCell>
                <p className="font-bold text-slate-800">{rec.diagnosis}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1"><Stethoscope size={12}/> {rec.doctorName}</p>
              </TableCell>
              <TableCell className="text-left"><StatusBadge status={rec.status} /></TableCell>
              <TableCell className="text-left align-middle">
                <div className="flex justify-start items-center">
                  <Button onClick={() => onViewDetail(rec.recordId)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-xl text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-50">
                    <Eye size={14}/><span>Chi tiết</span>
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