import React, { useMemo } from 'react';
import { CalendarClock } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

const fields: FieldConfig[] = [
  {
    name: 'scheduledDate',
    label: 'Ngày tái khám',
    type: 'date',
    required: true,
    colSpan: 1,
  },
  {
    name: 'scheduledTime',
    label: 'Giờ gợi ý',
    type: 'time',
    required: false,
    colSpan: 1,
  },
  {
    name: 'note',
    label: 'Ghi chú',
    type: 'textarea',
    placeholder: 'VD: Tái khám sau 7 ngày, theo dõi đáp ứng điều trị...',
    rows: 3,
    colSpan: 2,
  },
];

export interface FollowUpFormData {
  scheduledDate: string;
  scheduledTime?: string;
  note?: string;
}

interface Props {
  open: boolean;
  patientName?: string;
  defaultDate?: string;
  onClose: () => void;
  onSubmit: (data: FollowUpFormData) => void;
  onSkip: () => void;
  loading?: boolean;
}

export default function FollowUpFormDialog({
  open,
  patientName,
  defaultDate,
  onClose,
  onSubmit,
  onSkip,
  loading = false,
}: Props) {
  if (!open) return null;

  const submitFromForm = (data: Record<string, string>) => {
    if (data.scheduledDate) {
      const scheduledDate = new Date(data.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (scheduledDate < today) {
        toast.error('Ngày tái khám không được trong quá khứ');
        return;
      }
    }
    onSubmit({
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime || '09:00',
      note: data.note,
    });
  };

  const initialData = useMemo(() => ({ scheduledDate: defaultDate, scheduledTime: '09:00', note: '' }), [defaultDate]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Hẹn tái khám"
      description={
        patientName
          ? `Tạo lịch tái khám cho ${patientName}. Hệ thống gửi thông báo qua app/web.`
          : 'Tạo lịch tái khám. Hệ thống gửi thông báo qua app/web.'
      }
      icon={<CalendarClock size={16} />}
      fields={fields}
      initialData={initialData}
      onSubmit={submitFromForm}
      compact
      columns={2}
      renderFooter={(formData) => (
        <DialogFooter className="p-5 pb-7 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end rounded-b-[24px]">
          <Button
            variant="outline"
            onClick={onSkip}
            disabled={loading}
            className="h-9 px-5 rounded-xl text-sm font-bold border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 cursor-pointer"
          >
            Không tái khám
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="h-9 px-5 rounded-xl text-sm font-bold border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={() => submitFromForm(formData as Record<string, string>)}
            disabled={loading || !formData.scheduledDate}
            className="h-9 px-6 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {loading ? 'Đang lưu...' : 'Lưu & gửi thông báo'}
          </Button>
        </DialogFooter>
      )}
    />
  );
}
