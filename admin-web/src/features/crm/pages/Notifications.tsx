import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Mail } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { NotificationFilterBar } from '../components/NotificationFilterBar';
import NotificationTable from '../components/NotificationTable';
import { AppNotification } from '../types/crm';
import { crmApi } from '../api/crmApi';

export default function Notifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await crmApi.getNotificationsPaged({
      search: search || undefined,
      type: type === 'ALL' ? undefined : type,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page: currentPage - 1,
      size: pageSize,
      sortBy: 'sentAt',
      sortDir: 'DESC',
    });
    setNotifications(res.content);
    setTotalElements(res.totalElements);
    setLoading(false);
  }, [search, type, fromDate, toDate, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, type, fromDate, toDate]);

  const emails = notifications.filter((n) => n.type === 'EMAIL').length;
  const systems = notifications.filter((n) => n.type === 'SYSTEM').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader
          title="Nhật ký thông báo"
          description="Xem lịch sử thông báo đã gửi. Gửi nhắc tái khám qua Nhắc nhở tái khám (nút chuông)."
        />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<Bell size={16} />} label="Tổng thông báo" value={totalElements} />
          <StatsCard icon={<Mail size={16} />} label="Email (trang)" value={emails} bgColor="bg-amber-50" iconColor="text-amber-600" />
          <StatsCard icon={<Bell size={16} />} label="Hệ thống (trang)" value={systems} bgColor="bg-indigo-50" iconColor="text-indigo-600" />
        </div>
      </div>

      <NotificationFilterBar
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <NotificationTable
          data={notifications}
          loading={loading}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>
    </div>
  );
}
