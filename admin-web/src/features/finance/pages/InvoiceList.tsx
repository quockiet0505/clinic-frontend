import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, DollarSign, Filter, Printer, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import PaymentCheckoutDialog from '../components/PaymentCheckoutDialog';
import { BillInvoice } from '../types/finance';

const TODAY = new Date().toISOString().split('T')[0];

const INITIAL_INVOICES: BillInvoice[] = [
  { bill_id: 9001, record_id: 101, patient_name: 'Liam Anderson', created_at: TODAY, total_price: 125.50, status: 'UNPAID' },
  { bill_id: 9002, record_id: 102, patient_name: 'Emma Watson', created_at: TODAY, total_price: 85.00, status: 'PAID', payment_method: 'TRANSFER' },
  { bill_id: 9003, record_id: 103, patient_name: 'William Garcia', created_at: '2026-04-07', total_price: 210.00, status: 'PAID', payment_method: 'CASH' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'UNPAID': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'PAID': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'REFUNDED': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'CANCELLED': return 'bg-slate-100 text-slate-500 border-slate-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<BillInvoice[]>(INITIAL_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<BillInvoice | null>(null);
  
  const navigate = useNavigate();

  const handleProcessPayment = (billId: number, paymentMethod: 'CASH' | 'TRANSFER') => {
    setInvoices(invoices.map(inv => inv.bill_id === billId ? { ...inv, status: 'PAID', payment_method: paymentMethod } : inv));
    setSelectedInvoice(null);
  };

  const handleActionClick = (inv: BillInvoice) => {
    if (inv.status === 'PAID') navigate(`/finance/invoices/${inv.bill_id}`);
    else if (inv.status === 'UNPAID') setSelectedInvoice(inv);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || inv.bill_id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todaysRevenue = invoices.filter(inv => inv.status === 'PAID' && inv.created_at === TODAY).reduce((sum, inv) => sum + inv.total_price, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Billing & Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Manage patient payments and generate receipts.</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><DollarSign size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Revenue</p>
            <p className="text-xl font-black text-slate-900">${todaysRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 shadow-sm shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input placeholder="Search by Patient Name or Bill ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50 font-medium" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400 ml-2" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600 focus:outline-none cursor-pointer">
            <option value="ALL">All Statuses</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="h-14">
              <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Invoice</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Patient</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Total Amount</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Status</TableHead>
              <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((inv) => (
              <TableRow key={inv.bill_id} className="hover:bg-slate-50/50">
                <TableCell className="px-8 py-4">
                  <p className="font-bold text-slate-900">BILL-{inv.bill_id}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{inv.created_at}</p>
                </TableCell>
                <TableCell><span className="font-bold text-slate-700">{inv.patient_name}</span></TableCell>
                <TableCell><span className="font-black text-slate-900">${inv.total_price.toFixed(2)}</span></TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={`font-bold border px-2.5 py-1 rounded-lg ${getStatusBadge(inv.status)}`}>
                    {inv.status === 'UNPAID' && <Clock size={12} className="mr-1.5 inline" />}
                    {inv.status === 'PAID' && <CheckCircle2 size={12} className="mr-1.5 inline" />}
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex items-center justify-end gap-2">
                    <Button onClick={() => handleActionClick(inv)} variant={inv.status === 'PAID' ? 'outline' : 'default'} size="sm" className={`h-9 font-bold rounded-xl px-4 ${inv.status === 'UNPAID' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {inv.status === 'PAID' ? 'View Details' : 'Collect Payment'}
                    </Button>
                    {inv.status === 'PAID' && (
                      <Button onClick={() => navigate(`/finance/invoices/${inv.bill_id}`)} variant="outline" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-700 rounded-xl border-slate-200">
                        <Printer size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaymentCheckoutDialog isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} onProcessPayment={handleProcessPayment} invoice={selectedInvoice} />
    </div>
  );
}