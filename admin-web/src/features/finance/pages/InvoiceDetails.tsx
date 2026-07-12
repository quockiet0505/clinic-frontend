import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ChevronLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailPageHeader, { IconAction } from '@/components/common/DetailPageHeader';
import PrintableInvoiceTemplate from '../components/PrintableInvoiceTemplate';
import { ClinicPdfLayout, PdfTableRow } from '@/components/common/ClinicPdfLayout';
import { printPdfLayout, generatePdf, formatVND } from '@/utils/generatePdf';
import { financeApi } from '../api/financeApi';
import { BillInvoice } from '../types/finance';

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<BillInvoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await financeApi.getInvoiceById(Number(id));
        setInvoice(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-500 text-sm font-medium">Đang tải chi tiết hóa đơn...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-rose-500 font-bold">Không tìm thấy hóa đơn này.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] animate-in fade-in duration-300 pb-6">
      <div className="mx-auto max-w-[1200px] w-full space-y-5">
        <DetailPageHeader
          title="Chi tiết hóa đơn"
          subtitle="Xem chi tiết dịch vụ khám và thanh toán cho bệnh nhân."
          code={`#BILL-${id}`}
          onBack={() => navigate('/billing/invoices')}
          backLabel="Về danh sách hóa đơn"
          statusBadge={
            invoice.status === 'PAID' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Đã thanh toán
              </span>
            ) : invoice.status === 'UNPAID' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Chưa thanh toán
              </span>
            ) : invoice.status === 'PENDING_VERIFY' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-500" />
                </span>
                Chờ đối soát
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                {invoice.status}
              </span>
            )
          }
          actions={
            <>
              <IconAction
                icon={<Download size={15} />}
                label="Tải PDF"
                onClick={() => generatePdf('invoice-pdf-layout', `HoaDon_BILL_${id}.pdf`)}
                tone="emerald"
              />
              <IconAction
                icon={<Printer size={15} />}
                label="In hóa đơn"
                onClick={() => printPdfLayout('invoice-pdf-layout', `In_HoaDon_BILL_${id}`)}
                tone="sky"
              />
            </>
          }
        />
        <div className="mt-4 print:hidden">
          <PrintableInvoiceTemplate data={invoice} />
        </div>
        
        {/* Hidden Layout for standardized PDF/Print */}
        <ClinicPdfLayout
          id="invoice-pdf-layout"
          documentTitle="HÓA ĐƠN THANH TOÁN"
          documentCode={`BILL-${invoice.invoiceId}`}
          issuedDate={new Date().toLocaleDateString('vi-VN')}
          patient={{
            name: invoice.patientName,
            phone: invoice.patientPhone
          }}
          tableHeaders={['Mô tả dịch vụ', 'Số lượng', 'Thành tiền']}
          tableRows={invoice.items?.map((item, index) => ({
            index: index + 1,
            name: item.description,
            detail: '1',
            quantity: formatVND(item.priceAtTime)
          })) || []}
          totalAmount={invoice.totalPrice}
          paymentMethod={invoice.paymentMethod === 'CASH' ? 'Tiền mặt' : invoice.paymentMethod === 'TRANSFER' ? 'Chuyển khoản ngân hàng' : null}
          footerNote="Hóa đơn này chỉ có giá trị nội bộ phòng khám."
          hideSignatures={true}
        />
      </div>
    </div>
  );
}