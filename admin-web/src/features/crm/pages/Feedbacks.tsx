import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import FeedbackTable from '../components/FeedbackTable';
import { Feedback } from '../types/crm';

const TODAY = new Date().toISOString().split('T')[0];

export default function Feedbacks() {
  const [feedbacks] = useState<Feedback[]>([
    { feedback_id: 1, record_id: 101, patient_name: 'Liam Anderson', doctor_name: 'Sarah Smith', rating: 5, comment: 'Excellent service and very friendly doctor.', created_at: TODAY },
    { feedback_id: 2, record_id: 102, patient_name: 'Emma Watson', doctor_name: 'Robert Davis', rating: 3, comment: 'Wait time was a bit long, but treatment was good.', created_at: '2026-04-10' },
  ]);
  
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState(TODAY);

  const filtered = feedbacks.filter(fb => 
    (ratingFilter === 'ALL' || fb.rating.toString() === ratingFilter) &&
    (fb.patient_name.toLowerCase().includes(search.toLowerCase()) || fb.doctor_name.toLowerCase().includes(search.toLowerCase())) &&
    (fb.created_at >= fromDate && fb.created_at <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Patient Feedback" description="Monitor clinic reviews and patient satisfaction." />
      
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold text-slate-600 outline-none w-full sm:w-32 cursor-pointer">
            <option value="ALL">All Ratings</option><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
          </select>
          <div className="w-full sm:w-64"><SearchInput value={search} onChange={setSearch} placeholder="Search patient or doctor..." /></div>
        </div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>

      <FeedbackTable data={filtered} />
    </div>
  );
}