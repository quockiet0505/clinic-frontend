import React from 'react';
import { Eye, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ServiceResult } from '../types/laboratory';

export default function LabResultsTable({ data, onViewResult }: { data: ServiceResult[], onViewResult: (r: ServiceResult) => void }) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14">
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Result ID</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Patient</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Test & Conclusion</TableHead>
            <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(res => (
            <TableRow key={res.result_id} className="hover:bg-slate-50/50">
              <TableCell className="px-8 py-4">
                <p className="font-bold text-slate-900">{res.entered_at.split('T')[0]}</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5">RES-{res.result_id}</p>
              </TableCell>
              <TableCell>
                <p className="font-bold text-slate-900">{res.patient_name}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Req: Dr. {res.doctor_name}</p>
              </TableCell>
              <TableCell>
                <p className="font-bold text-blue-600 flex items-center gap-1.5"><FileSignature size={14}/> {res.service_name}</p>
                <p className="text-xs font-medium text-slate-600 mt-1 truncate max-w-[250px]">{res.conclusion}</p>
              </TableCell>
              <TableCell className="text-right pr-8">
                <Button onClick={() => onViewResult(res)} variant="outline" size="sm" className="h-9 font-bold rounded-xl px-4 text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Eye size={14} className="mr-1.5"/> View Report
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}