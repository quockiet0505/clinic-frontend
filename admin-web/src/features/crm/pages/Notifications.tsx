// features/crm/pages/Notifications.tsx
import React, { useState, useEffect } from 'react';
import { Bell, Mail, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { NotificationFilterBar } from '../components/NotificationFilterBar';
import NotificationTable from '../components/NotificationTable';
import CreateNotificationDialog from '../components/CreateNotificationDialog';
import GradientButton from '@/components/common/GradientButton';
import { AppNotification } from '../types/crm';
import { crmApi } from '../api/crmApi';

export default function Notifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await crmApi.getNotifications({
      search,
      type: type === 'ALL' ? undefined : type,
      fromDate,
      toDate,
    });
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [search, type, fromDate, toDate]);

  const total = notifications.length;
  const emails = notifications.filter(n => n.type === 'EMAIL').length;
  const systems = notifications.filter(n => n.type === 'SYSTEM').length;

  const handleCreate = async (data: { type: 'EMAIL' | 'SYSTEM'; content: string; accountId?: number }) => {
    await crmApi.createNotification(data);
    await fetchData();
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader
          title="Nhật ký thông báo"
          description="Xem lại lịch sử thông báo đã gửi đến bệnh nhân."
        />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<Bell size={16} />} label="Tổng thông báo" value={total} />
          <StatsCard
            icon={<Mail size={16} />}
            label="Email"
            value={emails}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatsCard
            icon={<Bell size={16} />}
            label="Hệ thống"
            value={systems}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <GradientButton onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" /> Tạo thông báo
          </GradientButton>
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

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải thông báo...</div>
      ) : (
        <NotificationTable data={notifications} />
      )}

      <CreateNotificationDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}