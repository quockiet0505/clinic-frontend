import React from 'react';
import { Microscope, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function LabResultDetailModal({ result, onClose }: any) {
  if (!result) return null;

  return (
    <Dialog open={!!result} onOpenChange={(open) => !open && onClose()}>
     
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        
        {/* HEADER: */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Microscope size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Laboratory Report</span>
          </div>
          <DialogTitle className="text-2xl font-black">{result.service_name}</DialogTitle>
          <DialogDescription className="text-blue-100 mt-1.5 font-medium text-sm flex items-center gap-2 flex-wrap">
            <span>Patient: <strong className="text-white">{result.patient_name}</strong></span>
            <span className="opacity-50">•</span>
            <span>Date: {result.entered_at.split('T')[0]}</span>
            <span className="opacity-50">•</span>
            <span>ID: RES-{result.result_id}</span>
          </DialogDescription>
        </div>
        
        {/* BODY */}
        <div className="p-6 bg-slate-50 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* Doctor & Status Info */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Requested By</p>
              <p className="font-bold text-slate-900 text-sm">Dr. {result.doctor_name}</p>
            </div>
            <div className="bg-emerald-100 text-emerald-700 text-xs font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 size={14}/> Verified
            </div>
          </div>

          {/* Raw Data */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">Measurements & Data</h3>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm min-h-[100px]">
              <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-loose font-mono">
                {result.result_data}
              </p>
            </div>
          </div>

          {/* Conclusion */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">Clinical Conclusion</h3>
            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5">
              <p className="text-sm font-bold text-slate-800 whitespace-pre-wrap leading-relaxed">
                {result.conclusion}
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="pt-2 text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Analyzed & Verified By</p>
            <p className="font-bold text-slate-800 text-base">{result.entered_name}</p>
          </div>

        </div>

        {/* FOOTER:  */}
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50">
              <Printer size={16} className="mr-2" /> Print
            </Button>
            <Button variant="outline" className="rounded-xl font-bold text-blue-600 border-blue-200 hover:bg-blue-50">
              <Download size={16} className="mr-2" /> PDF
            </Button>
          </div>
          <Button onClick={onClose} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 shadow-sm">
            Close Report
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}