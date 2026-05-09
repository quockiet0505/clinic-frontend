import React from 'react';
import { Pill, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import { PrescriptionUI } from '../types/pharmacy';

export default function PrescriptionTable({ data, onDispense }: { data: PrescriptionUI[], onDispense: (rx: PrescriptionUI) => void }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Prescription ID</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Patient & Provider</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Status</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(rx => (
            <TableRow key={rx.prescription_id} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="font-bold text-slate-900">{rx.created_at.split('T')[0]}</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5">RX-{rx.prescription_id}</p>
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-900">{rx.patient_name}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Dr. {rx.doctor_name}</p>
              </TableCell>
              <TableCell className="text-center"><StatusBadge status={rx.status} /></TableCell>
              <TableCell className="text-right pr-8">
                {rx.status === 'PENDING' ? (
                  <Button onClick={() => onDispense(rx)} variant="outline" size="sm" className="h-9 font-bold rounded-xl px-4 text-blue-600 border-blue-200 hover:bg-blue-50">
                    <Pill size={14} className="mr-1.5"/> Dispense Items
                  </Button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1"><CheckCircle2 size={14}/> Completed</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}