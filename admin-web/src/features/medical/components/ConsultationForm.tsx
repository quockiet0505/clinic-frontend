import React, { useState } from 'react';
import { Activity, ClipboardList, FileText } from 'lucide-react';

export default function ConsultationForm({ initialData }: { initialData?: any }) {
  const [form, setForm] = useState(initialData || { diagnosis: '', treatment: '', note: '' });

  return (
    <div className="space-y-6">
      {/* Chẩn đoán lâm sàng */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">Chẩn đoán lâm sàng</label>
        <div className="relative">
          <Activity size={16} className="absolute left-3 top-3 text-slate-400" />
          <textarea
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 pl-9 font-medium outline-none resize-none h-24 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all placeholder:text-sm"
            placeholder="Nhập chẩn đoán bệnh..."
          />
        </div>
      </div>

      {/* Kế hoạch điều trị */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">Kế hoạch điều trị</label>
        <div className="relative">
          <ClipboardList size={16} className="absolute left-3 top-3 text-slate-400" />
          <textarea
            value={form.treatment}
            onChange={(e) => setForm({ ...form, treatment: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 pl-9 font-medium outline-none resize-none h-24 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all placeholder:text-sm"
            placeholder="Chi tiết các phương pháp điều trị..."
          />
        </div>
      </div>

      {/* Ghi chú của bác sĩ */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">Ghi chú của bác sĩ</label>
        <div className="relative">
          <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 pl-9 font-medium outline-none resize-none h-20 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all placeholder:text-sm"
            placeholder="Ghi chú nội bộ thêm..."
          />
        </div>
      </div>
    </div>
  );
}