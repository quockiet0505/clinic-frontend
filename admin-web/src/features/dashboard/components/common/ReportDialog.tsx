// features/dashboard/components/common/ReportDialog.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Eye, Printer, Loader2 } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { Button } from '@/components/ui/button';
import { CancelButton } from '@/components/common/ActionButtons';
import { ReportFilter } from '../../types/dashboard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onExportPdf: (filter: ReportFilter) => void;
  onExportExcel: (filter: ReportFilter) => void;
  onPrint: (filter: ReportFilter) => void;
  loading?: boolean;
}

export default function ReportDialog({
  isOpen,
  onClose,
  onExportPdf,
  onExportExcel,
  onPrint,
  loading = false,
}: Props) {
  const [period, setPeriod] = useState<'month' | 'quarter'>('month');

  const currentYear = new Date().getFullYear();

  // Fields config - rebuild khi period thay đổi
  const fields: FieldConfig[] = useMemo(() => {
    const monthOptions = [
      { value: '1', label: 'Tháng 1' },
      { value: '2', label: 'Tháng 2' },
      { value: '3', label: 'Tháng 3' },
      { value: '4', label: 'Tháng 4' },
      { value: '5', label: 'Tháng 5' },
      { value: '6', label: 'Tháng 6' },
      { value: '7', label: 'Tháng 7' },
      { value: '8', label: 'Tháng 8' },
      { value: '9', label: 'Tháng 9' },
      { value: '10', label: 'Tháng 10' },
      { value: '11', label: 'Tháng 11' },
      { value: '12', label: 'Tháng 12' },
    ];

    const quarterOptions = [
      { value: '1', label: 'Quý 1 (T1-T3)' },
      { value: '2', label: 'Quý 2 (T4-T6)' },
      { value: '3', label: 'Quý 3 (T7-T9)' },
      { value: '4', label: 'Quý 4 (T10-T12)' },
    ];

    return [
      {
        name: 'reportType',
        label: 'Loại báo cáo',
        type: 'select',
        options: [
          { value: 'all', label: 'Tổng hợp tất cả' },
          { value: 'overview', label: 'Tổng quan' },
          { value: 'doctors', label: 'Bác sĩ' },
          { value: 'services', label: 'Dịch vụ' },
          { value: 'patients', label: 'Bệnh nhân' },
          { value: 'revenue', label: 'Doanh thu' },
        ],
        required: true,
        colSpan: 2,
      },

      {
        name: 'periodValue',
        label: period === 'month' ? 'Tháng' : 'Quý',
        type: 'select',
        options: period === 'month' ? monthOptions : quarterOptions,
        required: true,
        placeholder: period === 'month' ? 'Chọn tháng' : 'Chọn quý',
      },
      {
        name: 'year',
        label: 'Năm',
        type: 'select',
        options: Array.from({ length: 5 }, (_, i) => ({
          value: String(currentYear - i),
          label: String(currentYear - i),
        })),
        required: true,
        placeholder: 'Chọn năm',
      },
      {
        name: 'format',
        label: 'Định dạng',
        type: 'select',
        options: [
          { value: 'pdf', label: 'PDF' },
          { value: 'excel', label: 'Excel' },
        ],
        required: true,
        placeholder: 'Chọn định dạng',
      },
    ];
  }, [period, currentYear]);

  const currentMonth = new Date().getMonth() + 1;
  const currentQuarter = Math.floor((currentMonth - 1) / 3) + 1;

  const initialData = useMemo(() => ({
    reportType: 'all',
    period: 'month',
    periodValue: String(currentMonth),
    year: String(currentYear),
    format: 'pdf',
  }), [currentYear, currentMonth]);

  const handleAction = (data: Record<string, any>, actionType: 'download' | 'print') => {
    if (!data.reportType || !data.period || !data.periodValue || !data.year || !data.format) {
      alert('Vui lòng chọn đầy đủ thông tin');
      return;
    }

    const filter: ReportFilter = {
      type: data.reportType,
      period: data.period,
      month: data.period === 'month' ? parseInt(data.periodValue) : undefined,
      quarter: data.period === 'quarter' ? parseInt(data.periodValue) : undefined,
      year: parseInt(data.year),
      format: data.format,
    };
    
    if (actionType === 'download') {
      if (data.format === 'pdf') onExportPdf(filter);
      else if (data.format === 'excel') onExportExcel(filter);
    } else {
      onPrint(filter);
    }
  };

  // Custom footer
  const renderFooter = (formData: Record<string, any>) => {
    const isFormValid = formData.reportType && formData.periodValue && formData.year && formData.format;

    return (
      <div className="flex flex-col gap-3 p-4 pb-6 bg-slate-50 border-t border-slate-100 rounded-b-[24px]">
        <div className="flex justify-end gap-2">
          <CancelButton
            onClick={onClose}
            label="Hủy"
            className="h-9 px-4 rounded-xl text-xs font-bold"
          />
          <Button
            onClick={() => handleAction(formData, 'download')}
            disabled={loading || !isFormValid}
            variant="outline"
            className="h-9 px-4 rounded-xl text-xs font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-all cursor-pointer"
          >
            <FileText size={14} className="mr-1.5" />
            Tải về
          </Button>
          <button
            onClick={() => handleAction(formData, 'print')}
            disabled={loading || !isFormValid}
            className="group inline-flex items-center justify-center gap-1.5 h-9 px-5 rounded-xl text-xs font-bold bg-white text-primary-600 ring-1 ring-primary-500/30 hover:ring-0 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-400 hover:text-white hover:shadow-[0_8px_16px_-6px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:ring-slate-200 disabled:text-slate-400"
          >
            <Printer size={14} className="text-primary-500 group-hover:text-white transition-colors" />
            {loading ? 'Đang xử lý...' : 'In báo cáo'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Xuất báo cáo"
      description="Chọn thông tin để tạo báo cáo chi tiết"
      icon={<FileText size={20} />}
      fields={fields}
      initialData={initialData}
      onSubmit={() => {}}
      submitLabel="Xuất"
      cancelLabel="Hủy"
      compact={true}
      columns={2}
      renderBeforeFields={(ctx) => (
        <div className="col-span-2 flex justify-center mb-2">
          <div className="relative grid grid-cols-2 bg-slate-100/80 p-1 rounded-[14px] w-full">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 ease-out pointer-events-none ${
                period === 'month' ? 'left-1' : 'left-[calc(50%+2px)]'
              }`}
            />
            <button
              type="button"
              onClick={() => {
                setPeriod('month');
                ctx.onChange('period', 'month');
                ctx.onChange('periodValue', String(currentMonth), false); 
              }}
              className={`relative z-10 flex items-center justify-center px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors duration-200 cursor-pointer ${
                period === 'month' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              Theo tháng
            </button>
            <button
              type="button"
              onClick={() => {
                setPeriod('quarter');
                ctx.onChange('period', 'quarter');
                ctx.onChange('periodValue', String(currentQuarter), false); 
              }}
              className={`relative z-10 flex items-center justify-center px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors duration-200 cursor-pointer ${
                period === 'quarter' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              Theo quý
            </button>
          </div>
        </div>
      )}
      renderFooter={renderFooter}
    />
  );
}