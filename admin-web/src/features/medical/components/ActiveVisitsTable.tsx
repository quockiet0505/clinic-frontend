import React from 'react';
import { Activity, Stethoscope, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { MedicalRecord } from '../types/medical';

interface Props {
  data: MedicalRecord[];
  onConsult: (id: number) => void;
}

export default function ActiveVisitsTable({ data, onConsult }: Props) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8 w-24">Queue</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Patient</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Provider</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Vitals</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Status</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(visit => (
            <TableRow key={visit.record_id} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">
                  {visit.queue_number?.toString().padStart(2, '0') || '--'}
                </div>
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-900">{visit.patient_name}</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5">IN: {visit.checkin_time}</p>
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-800 flex items-center gap-1.5"><Stethoscope size={14} className="text-blue-500"/> {visit.doctor_name}</p>
              </TableCell>
              <TableCell className="text-center">
                {visit.vitals_taken ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 shadow-none px-2 py-0.5"><Activity size={12} className="mr-1"/> Recorded</Badge>
                ) : (
                  <Badge className="bg-rose-100 text-rose-700 border-0 shadow-none px-2 py-0.5 animate-pulse">Pending Vitals</Badge>
                )}
              </TableCell>
              <TableCell className="text-center"><StatusBadge status={visit.status} /></TableCell>
              <TableCell className="text-right pr-8">
                <Button onClick={() => onConsult(visit.record_id)} size="sm" className="h-9 font-bold rounded-xl px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  Consult <ArrowRight size={14} className="ml-1.5"/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}