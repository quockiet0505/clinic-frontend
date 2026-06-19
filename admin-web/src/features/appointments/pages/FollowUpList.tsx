// features/appointments/pages/FollowUpList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { FollowUpFilterBar } from '../components/FollowUpFilterBar';
import FollowUpTable from '../components/FollowUpTable';
import FollowUpCallDialog from '../components/FollowUpCallDialog';
import NotificationDialog from '../components/NotificationDialog';
import { FollowUp } from '../types/appointment';
import { followUpApi } from '../api/followUpApi';
import PageHeader from '@/components/common/PageHeader';

export default function FollowUpList() {
  const [data, setData] = useState<FollowUp[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [selectedCall, setSelectedCall] = useState<FollowUp | null>(null);
  const [selectedNotify, setSelectedNotify] = useState<FollowUp | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await followUpApi.getAllPaged({
        search: search || undefined,
        status: activeTab || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'scheduledDatetime',
        sortDir: 'DESC',
      });
      setData(res.content);
      setTotalElements(res.totalElements);
    } catch {
      setData([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, activeTab, fromDate, toDate, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab, fromDate, toDate]);

  const pendingCount = data.filter((d) => d.status === 'PENDING').length;

  const handleLogCall = (newStatus: string, callResult: string) => {
    setData(
      data.map((d) =>
        d.followUpId === selectedCall?.followUpId
          ? { ...d, status: newStatus as FollowUp['status'], note: `${d.note} | Log: ${callResult}` }
          : d
      )
    );
    setSelectedCall(null);
  };

  const handleSendNotification = (type: string, content: string) => {
    setData(
      data.map((d) =>
        d.followUpId === selectedNotify?.followUpId
          ? { ...d, status: 'COMPLETED', note: `${d.note} | Log: Sent ${type} notification` }
          : d
      )
    );
    setSelectedNotify(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Nhắc nhở tái khám" description="Bệnh nhân cần tái khám hoặc chăm sóc sau điều trị." />
        <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center font-bold">
            <AlertCircle size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Cần xử lý (trang)</p>
            <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{pendingCount}</p>
          </div>
        </div>
      </div>

      <FollowUpFilterBar
        search={search}
        onSearchChange={setSearch}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <FollowUpTable
          data={data}
          onLogCall={setSelectedCall}
          onSendReminder={setSelectedNotify}
          loading={loading}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <FollowUpCallDialog patient={selectedCall} onClose={() => setSelectedCall(null)} onSubmit={handleLogCall} />
      <NotificationDialog patient={selectedNotify} onClose={() => setSelectedNotify(null)} onSend={handleSendNotification} />
    </div>
  );
}
