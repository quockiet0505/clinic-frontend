import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ChevronLeft, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrintableInvoiceTemplate from '../components/PrintableInvoiceTemplate';

const MOCK_INVOICE_DATA = {
  billId: '9002',
  createdAt: '2026-04-08',
  patientName: 'Emma Watson',
  paymentMethod: 'TRANSFER',
  items: [
    { description: 'General Medical Consultation', qty: 1, unitPrice: 50.00, total: 50.00 },
    { description: 'Amoxicillin 500mg', qty: 1, unitPrice: 35.00, total: 35.00 },
  ],
  totalPrice: 85.00
};

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-white bg-slate-50">
            <ChevronLeft size={24} />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Invoice BILL-{id || MOCK_INVOICE_DATA.billId}</h1>
            <p className="text-sm text-slate-500 font-medium">Review and generate official receipt.</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none rounded-xl font-bold border-slate-200 cursor-pointer"><Download size={18} className="mr-2" /> PDF</Button>
          <Button onClick={() => window.print()} className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold shadow-sm">
            <Printer size={18} className="mr-2" /> Print Invoice
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <PrintableInvoiceTemplate data={MOCK_INVOICE_DATA} />
      </div>
    </div>
  );
}