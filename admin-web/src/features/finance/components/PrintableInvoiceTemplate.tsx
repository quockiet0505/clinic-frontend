import React from 'react';
import { Building2, MapPin, Phone, Mail, Receipt } from 'lucide-react';

export default function PrintableInvoiceTemplate({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl max-w-3xl mx-auto print:border-none print:shadow-none print:rounded-none">
      <div className="p-8 print:p-0">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 shrink-0 print:border-none print:bg-none">
              <Building2 size={20} className="stroke-[1.5]" />
            </div>
            <div>
              <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">TrustCare Clinic</h1>
              <p className="text-[12px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                <MapPin size={12} className="text-slate-400" /> Khu Phố 6, Phường Linh Trung, Thủ Đức
              </p>
              <div className="flex items-center gap-3 mt-0.5 text-[12px] text-slate-500 font-medium">
                <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> 1900 2115</span>
                <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> contact@trustcare.vn</span>
              </div>
            </div>
          </div>
          
          <div className="text-left sm:text-right">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Hóa Đơn Dịch Vụ</h2>
            <div className="text-[16px] font-bold text-slate-900 tracking-tight">#BILL-{data.invoiceId}</div>
            <div className="mt-1 flex items-center justify-start sm:justify-end gap-1.5 text-[12px] font-medium text-slate-500">
              <Receipt size={12} className="text-slate-400" /> 
              {new Date(data.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
        
        {/* INFO SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Thông Tin Khách Hàng</p>
            <div>
              <p className="font-bold text-slate-900 text-[14px]">{data.patientName}</p>
              <p className="text-[13px] text-slate-500 mt-0.5">
                {data.patientPhone || '—'}
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phương Thức Thanh Toán</p>
            <div>
              <p className="font-bold text-slate-900 text-[14px]">
                {data.paymentMethod === 'CASH' ? 'Tiền mặt' : data.paymentMethod === 'TRANSFER' ? 'Chuyển khoản ngân hàng' : 'Chưa thanh toán'}
              </p>
              <p className="text-[13px] mt-0.5">
                Trạng thái: <span className={data.status === 'PAID' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                  {data.status === 'PAID' ? 'Đã thu tiền' : data.status === 'UNPAID' ? 'Chưa thu tiền' : 'Đang chờ duyệt'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 print:border-slate-800">
                <th className="py-2.5 font-bold text-slate-600 text-[12px] uppercase w-[60%]">Mô tả dịch vụ</th>
                <th className="py-2.5 font-bold text-slate-600 text-[12px] uppercase text-center">Số lượng</th>
                <th className="py-2.5 font-bold text-slate-600 text-[12px] uppercase text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.items && data.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="py-3 font-medium text-slate-800 text-[13px]">{item.description}</td>
                  <td className="py-3 font-medium text-slate-600 text-[13px] text-center">1</td>
                  <td className="py-3 font-bold text-slate-900 text-[13px] text-right">
                    {item.priceAtTime ? item.priceAtTime.toLocaleString('vi-VN') : '0'} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-end mt-4">
            <div className="w-full sm:w-64">
              <div className="flex justify-between items-center py-2.5 mt-2 border-t border-slate-100 print:border-slate-800">
                <span className="font-bold text-slate-900 text-[14px]">Tổng cộng</span>
                <span className="font-bold text-slate-900 text-[15px]">
                  {data.totalPrice ? data.totalPrice.toLocaleString('vi-VN') : '0'} đ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER MESSAGE */}
        <div className="mt-8 text-center border-t border-slate-100 pt-4 print:border-slate-800">
          <p className="text-[12px] text-slate-500 italic">Cảm ơn bạn đã tin tưởng TrustCare Clinic!</p>
        </div>
      </div>
    </div>
  );
}