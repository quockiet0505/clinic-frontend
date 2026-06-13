import React, { useState } from 'react';

export default function ConsultationForm({ initialData }: { initialData?: any }) {
  const [form, setForm] = useState(initialData || { diagnosis: '', treatment: '', note: '' });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Chẩn đoán lâm sàng</label>
        <textarea 
          value={form.diagnosis} onChange={(e) => setForm({...form, diagnosis: e.target.value})}
          className="w-full rounded-[16px] border border-slate-200 bg-white p-4 font-medium outline-none resize-none h-24 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all" 
          placeholder="Nhập chẩn đoán bệnh..." 
        />
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Kế hoạch điều trị</label>
        <textarea 
          value={form.treatment} onChange={(e) => setForm({...form, treatment: e.target.value})}
          className="w-full rounded-[16px] border border-slate-200 bg-white p-4 font-medium outline-none resize-none h-24 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all" 
          placeholder="Chi tiết các phương pháp điều trị..." 
        />
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Ghi chú của bác sĩ</label>
        <textarea 
          value={form.note} onChange={(e) => setForm({...form, note: e.target.value})}
          className="w-full rounded-[16px] border border-slate-200 bg-white p-4 font-medium outline-none resize-none h-20 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all" 
          placeholder="Ghi chú nội bộ thêm..." 
        />
      </div>
    </div>
  );
}