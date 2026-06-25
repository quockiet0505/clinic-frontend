import React from 'react';
import { Activity, ClipboardList, FileText } from 'lucide-react';

export interface ConsultationFormData {
  diagnosis: string;
  treatment: string;
  note: string;
}

interface Props {
  value: ConsultationFormData;
  onChange: (value: ConsultationFormData) => void;
  readOnly?: boolean;
}

export default function ConsultationForm({ value, onChange, readOnly = false }: Props) {
  const setField = (field: keyof ConsultationFormData, text: string) => {
    onChange({ ...value, [field]: text });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">Chẩn đoán lâm sàng</label>
        <div className="relative">
          <Activity size={16} className="absolute left-3 top-3 text-slate-400" />
          <textarea
            value={value.diagnosis}
            onChange={(e) => setField('diagnosis', e.target.value)}
            readOnly={readOnly}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 pl-9 font-medium outline-none resize-none h-24 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all placeholder:text-sm disabled:bg-slate-50"
            placeholder="Nhập chẩn đoán bệnh..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">Kế hoạch điều trị</label>
        <div className="relative">
          <ClipboardList size={16} className="absolute left-3 top-3 text-slate-400" />
          <textarea
            value={value.treatment}
            onChange={(e) => setField('treatment', e.target.value)}
            readOnly={readOnly}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 pl-9 font-medium outline-none resize-none h-24 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all placeholder:text-sm disabled:bg-slate-50"
            placeholder="Chi tiết các phương pháp điều trị..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">Ghi chú của bác sĩ</label>
        <div className="relative">
          <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
          <textarea
            value={value.note}
            onChange={(e) => setField('note', e.target.value)}
            readOnly={readOnly}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 pl-9 font-medium outline-none resize-none h-20 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all placeholder:text-sm disabled:bg-slate-50"
            placeholder="Ghi chú nội bộ thêm..."
          />
        </div>
      </div>
    </div>
  );
}
