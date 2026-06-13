import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import FeedbackTable from '../components/FeedbackTable';
import { Feedback } from '../types/crm';

const TODAY = new Date().toISOString().split('T')[0];

export default function Feedbacks() {
  const [feedbacks] = useState<Feedback[]>([
    { feedbackId: 1, recordId: 101, patientName: 'Liam Anderson', doctorName: 'Sarah Smith', rating: 5, comment: 'Excellent service and very friendly doctor.', createdAt: TODAY },
    { feedbackId: 2, recordId: 102, patientName: 'Emma Watson', doctorName: 'Robert Davis', rating: 3, comment: 'Wait time was a bit long, but treatment was good.', createdAt: '2026-04-10' },
  ]);
  
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState(TODAY);

  const filtered = feedbacks.filter(fb => 
    (ratingFilter === 'ALL' || fb.rating.toString() === ratingFilter) &&
    (fb.patientName.toLowerCase().includes(search.toLowerCase()) || fb.doctorName.toLowerCase().includes(search.toLowerCase())) &&
    (fb.createdAt >= fromDate && fb.createdAt <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Patient Feedback" description="Monitor clinic reviews and patient satisfaction." />
      
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold text-slate-600 outline-none w-full sm:w-32 cursor-pointer">
            <option value="ALL">All Ratings</option><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
          </select>
          <div className="w-full sm:w-64"><SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm patient or doctor..." /></div>
        </div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>

      <FeedbackTable data={filtered} />
    </div>
  );
}