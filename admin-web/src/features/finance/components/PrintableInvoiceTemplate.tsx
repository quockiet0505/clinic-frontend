import React from 'react';

export default function PrintableInvoiceTemplate({ data }: { data: any }) {
  return (
    <div className="bg-white p-10 sm:p-16 border border-slate-200 rounded-[32px] shadow-sm max-w-3xl mx-auto print:border-none print:shadow-none print:p-0">
      <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">INVOICE</h2>
          <p className="text-slate-500 font-bold mt-1">#BILL-{data.bill_id}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-800">Clinic Management System</p>
          <p className="text-sm text-slate-500 mt-1">123 Health Avenue<br/>Medical District, City</p>
        </div>
      </div>
      
      <div className="flex justify-between mb-10">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Billed To</p>
          <p className="font-bold text-slate-900">{data.patient_name}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
          <p className="font-bold text-slate-900">{data.payment_method || 'N/A'}</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="py-3 font-bold text-slate-600 text-sm">Description</th>
            <th className="py-3 font-bold text-slate-600 text-sm text-center">Qty</th>
            <th className="py-3 font-bold text-slate-600 text-sm text-right">Total</th>
          </tr>
        </thead>
        <tbody className="border-b border-slate-100">
          {data.items.map((item: any, i: number) => (
            <tr key={i} className="border-b border-slate-50 last:border-0">
              <td className="py-4 font-medium text-slate-800">{item.description}</td>
              <td className="py-4 font-medium text-slate-600 text-center">{item.qty}</td>
              <td className="py-4 font-bold text-slate-900 text-right">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-8">
        <div className="w-64">
          <div className="flex justify-between py-2 font-black text-lg text-blue-600 border-t-2 border-blue-100 pt-4 mt-2">
            <span>Grand Total</span>
            <span>${data.total_price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}