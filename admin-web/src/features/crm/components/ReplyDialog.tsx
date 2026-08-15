import React from 'react';
import { MessageSquareReply } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { Feedback } from '../types/crm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  feedback: Feedback | null;
  onReply: (feedbackId: number, reply: string) => void;
}

export default function ReplyDialog({ isOpen, onClose, feedback, onReply }: Props) {
  const fields: FieldConfig[] = [
    {
      name: 'reply',
      label: 'Phản hồi',
      type: 'textarea',
      required: true,
      placeholder: 'Nhập phản hồi của bạn...',
      rows: 4,
      colSpan: 1,
    },
  ];

  const initialData = {
    reply: '',
  };

  return (
    <FormDialog
      key={feedback?.feedbackId || 0}
      open={isOpen}
      onClose={onClose}
      title="Phản hồi đánh giá"
      description={`Phản hồi đánh giá của ${feedback?.patientName}${feedback?.doctorName ? ` - BS. ${feedback.doctorName}` : ''}`}
      icon={<MessageSquareReply size={20} />}
      fields={fields}
      initialData={initialData}
      renderBeforeFields={() => (
        <div className="col-span-1 space-y-1.5 mb-2">
          <label className="block text-sm font-semibold text-slate-700">Nội dung đánh giá</label>
          <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 leading-relaxed shadow-sm">
            {feedback?.comment ? (
              <span className="italic">"{feedback.comment}"</span>
            ) : (
              <span className="italic text-slate-400">Không có nội dung đánh giá</span>
            )}
          </div>
        </div>
      )}
      onSubmit={(data) => {
        if (feedback && data.reply.trim()) {
          onReply(feedback.feedbackId, data.reply.trim());
          onClose();
        }
      }}
      submitLabel="Gửi phản hồi"
      cancelLabel="Hủy"
      compact={true}
      columns={1}
    />
  );
}