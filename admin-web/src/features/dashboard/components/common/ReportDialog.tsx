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
  onGenerate: (filter: ReportFilter) => void;
  onPreview: (filter: ReportFilter) => Promise<string>;
  loading?: boolean;
}

export default function ReportDialog({
  isOpen,
  onClose,
  onGenerate,
  onPreview,
  loading = false,
}: Props) {
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
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
        name: 'period',
        label: 'Kỳ báo cáo',
        type: 'select',
        options: [
          { value: 'month', label: 'Tháng' },
          { value: 'quarter', label: 'Quý' },
        ],
        required: true,
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

  const initialData = {
    reportType: '',
    period: '',
    periodValue: '',
    year: '',
    format: '',
  };

  const handleFormSubmit = (data: Record<string, any>, isEdit: boolean) => {
    // Kiểm tra dữ liệu có đầy đủ không
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
    onGenerate(filter);
  };

  const handlePreviewWrapper = async (data: Record<string, any>) => {
    if (!data.reportType || !data.period || !data.periodValue || !data.year || !data.format) {
      alert('Vui lòng chọn đầy đủ thông tin để xem trước');
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
    setIsPreviewLoading(true);
    try {
      const content = await onPreview(filter);
      setPreviewContent(content);
    } catch (error) {
      console.error('Preview error:', error);
      alert('Không thể tải preview');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Custom footer
  const renderFooter = (formData: Record<string, any>) => {
    // Đồng bộ period với formData.period
    useEffect(() => {
      if (formData.period && formData.period !== period) {
        setPeriod(formData.period);
      }
    }, [formData.period]);

    const isFormValid = formData.reportType && formData.period && formData.periodValue && formData.year && formData.format;

    return (
      <div className="flex flex-col gap-3 p-4 pb-6 bg-slate-50 border-t border-slate-100 rounded-b-[24px]">
        {previewContent && (
          <div className="bg-white rounded-xl border border-slate-200 p-3 max-h-40 overflow-y-auto custom-scrollbar mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Xem trước báo cáo</span>
              <button
                onClick={() => setPreviewContent(null)}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Ẩn
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">
              {previewContent}
            </pre>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <CancelButton
            onClick={onClose}
            label="Hủy"
            className="h-9 px-4 rounded-xl text-xs font-bold"
          />
          <Button
            onClick={() => handlePreviewWrapper(formData)}
            disabled={isPreviewLoading || !isFormValid}
            variant="outline"
            className="h-9 px-4 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
          >
            <Eye size={14} className="mr-1.5" />
            {isPreviewLoading ? 'Đang tải...' : 'Xem trước'}
          </Button>
          <Button
            onClick={() => handleFormSubmit(formData, false)}
            disabled={loading || !isFormValid}
            className="h-9 px-4 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <Printer size={14} className="mr-1.5" />
            {loading ? 'Đang xuất...' : 'Xuất'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <FormDialog
      key={period}
      open={isOpen}
      onClose={onClose}
      title="Xuất báo cáo"
      description="Chọn thông tin để tạo báo cáo chi tiết"
      icon={<FileText size={20} />}
      fields={fields}
      initialData={initialData}
      onSubmit={handleFormSubmit}
      submitLabel="Xuất"
      cancelLabel="Hủy"
      compact={true}
      columns={2}
      renderFooter={renderFooter}
    />
  );
}