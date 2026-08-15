import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Phone, Mail, CheckCircle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import ContactMessageTable from '../components/ContactMessageTable';
import { ContactMessage } from '../types/crm';
import { crmApi } from '../api/crmApi';

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [status, setStatus] = useState('ALL');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = {
      status: status === 'ALL' ? undefined : status,
      page: currentPage - 1,
      size: pageSize,
      sortBy: 'createdAt',
      sortDir: 'DESC' as const,
    };

    try {
      const res = await crmApi.getContactMessagesPaged(params);
      setMessages(res.content);
      setTotalElements(res.totalElements);
    } catch {
      setMessages([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [status, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  const handleUpdateStatus = async (message: ContactMessage, newStatus: string) => {
    try {
      await crmApi.updateContactMessageStatus(message.messageId, newStatus);
      await fetchData();
    } catch {
      // toast is handled by interceptor
    }
  };

  const pendingCount = messages.filter((m) => m.status === 'PENDING').length;
  const resolvedCount = messages.filter((m) => m.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Tin nhắn liên hệ" description="Quản lý tin nhắn liên hệ từ bệnh nhân." />
        <div className="flex flex-wrap items-center gap-3">
          <StatsCard icon={<MessageSquare size={16} />} label="Tổng tin nhắn" value={totalElements} compact />
          <StatsCard icon={<Mail size={16} />} label="Đang chờ" value={pendingCount} bgColor="bg-amber-50" iconColor="text-amber-600" compact />
          <StatsCard icon={<CheckCircle size={16} />} label="Đã xử lý" value={resolvedCount} bgColor="bg-emerald-50" iconColor="text-emerald-600" compact />
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-600">Trạng thái:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Tất cả</option>
            <option value="PENDING">Đang chờ</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="RESOLVED">Đã giải quyết</option>
            <option value="REJECTED">Từ chối</option>
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ContactMessageTable
          data={messages}
          onUpdateStatus={handleUpdateStatus}
          loading={loading}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>
    </div>
  );
}
