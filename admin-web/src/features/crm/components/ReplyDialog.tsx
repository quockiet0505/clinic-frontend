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
      name: 'comment',
      label: 'Đánh giá',
      type: 'textarea',
      required: false,
      rows: 2,
      colSpan: 2,
    },
    {
      name: 'reply',
      label: 'Phản hồi',
      type: 'textarea',
      required: true,
      placeholder: 'Nhập phản hồi của bạn...',
      rows: 3,
      colSpan: 2,
    },
  ];

  const initialData = {
    comment: feedback?.comment || '',
    reply: '',
  };

  return (
    <FormDialog
      key={feedback?.feedbackId || 0}
      open={isOpen}
      onClose={onClose}
      title="Phản hồi đánh giá"
      description={`Phản hồi của ${feedback?.patientName}${feedback?.doctorName ? ` - BS. ${feedback.doctorName}` : ''}`}
      icon={<MessageSquareReply size={20} />}
      fields={fields}
      initialData={initialData}
      onSubmit={(data) => {
        if (feedback && data.reply.trim()) {
          onReply(feedback.feedbackId, data.reply.trim());
          onClose();
        }
      }}
      submitLabel="Gửi phản hồi"
      cancelLabel="Hủy"
      compact={true}
      columns={2}
    />
  );
}