import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import FollowUpFilterBar from '../components/FollowUpFilterBar';
import FollowUpTable from '../components/FollowUpTable';
import FollowUpCallDialog from '../components/FollowUpCallDialog';
import NotificationDialog from '../components/NotificationDialog';
import { FollowUp } from '../types/appointment';

const TODAY = new Date().toISOString().split('T')[0];

export default function FollowUpList() {
  const [data, setData] = useState<FollowUp[]>([
    { follow_up_id: 1, record_id: 99, patient_id: 101, patient_name: 'Olivia Davis', phone: '+1 555-4444', doctor_id: 1, doctor_name: 'Dr. Sarah', scheduled_datetime: `${TODAY} 09:00:00`, note: 'Post-Surgery Checkup', status: 'PENDING' },
  ]);
  
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING');
  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);
  
  const [selectedCall, setSelectedCall] = useState<FollowUp | null>(null);
  const [selectedNotify, setSelectedNotify] = useState<FollowUp | null>(null);

  const handleLogCall = (newStatus: any, callResult: string) => {
    setData(data.map(d => d.follow_up_id === selectedCall?.follow_up_id ? { ...d, status: newStatus, note: `${d.note} | Log: ${callResult}` } : d));
    setSelectedCall(null);
  };

  const handleSendNotification = (type: string, content: string) => {
    console.log(`Sending ${type} notification to ${selectedNotify?.patient_name}: ${content}`);
    // Giả lập lưu vào bảng notification thành công, tự động đổi status follow up
    setData(data.map(d => d.follow_up_id === selectedNotify?.follow_up_id ? { ...d, status: 'COMPLETED', note: `${d.note} | Log: Sent ${type} notification` } : d));
    setSelectedNotify(null);
  };

  const filtered = data.filter(item => item.patient_name.toLowerCase().includes(search.toLowerCase()) && item.status === activeTab && item.scheduled_datetime >= fromDate);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Follow-up Reminders" description="Patients due for re-examination or post-treatment care." />
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
           <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center font-bold"><AlertCircle size={16}/></div>
           <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Pending Calls</p><p className="text-sm font-black text-slate-900 leading-none mt-0.5">{data.filter(d => d.status === 'PENDING').length} Due</p></div>
        </div>
      </div>

      <FollowUpFilterBar tab={activeTab} setTab={setActiveTab} fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} search={search} setSearch={setSearch} />

      <FollowUpTable data={filtered} onLogCall={setSelectedCall} onSendReminder={setSelectedNotify} />

      {/* DIALOG GHI NHẬN CUỘC GỌI */}
      <FollowUpCallDialog patient={selectedCall} onClose={() => setSelectedCall(null)} onSubmit={handleLogCall} />
      
      {/* DIALOG GỬI THÔNG BÁO MỚI */}
      <NotificationDialog patient={selectedNotify} onClose={() => setSelectedNotify(null)} onSend={handleSendNotification} />
    </div>
  );
}