import React, { useState } from 'react';

export default function ConsultationForm({ initialData }: { initialData?: any }) {
  const [form, setForm] = useState(initialData || { diagnosis: '', treatment: '', note: '' });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Clinical Diagnosis</label>
        <textarea 
          value={form.diagnosis} onChange={(e) => setForm({...form, diagnosis: e.target.value})}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-medium outline-none resize-none h-24 shadow-sm" 
          placeholder="Enter formal diagnosis here..." 
        />
      </div>
      <div className="space-y-2">
        <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Treatment Plan</label>
        <textarea 
          value={form.treatment} onChange={(e) => setForm({...form, treatment: e.target.value})}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-medium outline-none resize-none h-24 shadow-sm" 
          placeholder="Detail the treatment procedures..." 
        />
      </div>
      <div className="space-y-2">
        <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Physician Notes</label>
        <textarea 
          value={form.note} onChange={(e) => setForm({...form, note: e.target.value})}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-medium outline-none resize-none h-20 shadow-sm" 
          placeholder="Any additional internal notes..." 
        />
      </div>
    </div>
  );
}