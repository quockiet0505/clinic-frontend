import React from 'react';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export const AppointmentFilterBar: React.FC<Props> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-5">

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
          className="h-12 pl-12 rounded-xl border-slate-200"
        />
      </div>

      <Tabs value={status} onValueChange={onStatusChange}>
        <TabsList className="bg-slate-100 rounded-xl h-auto p-1 flex flex-wrap">
          <TabsTrigger value="ALL" className="rounded-lg">
            Tất cả
          </TabsTrigger>

          <TabsTrigger value="PENDING" className="rounded-lg">
            Chờ xác nhận
          </TabsTrigger>

          <TabsTrigger value="CONFIRMED" className="rounded-lg">
            Đã xác nhận
          </TabsTrigger>

          <TabsTrigger value="COMPLETED" className="rounded-lg">
            Hoàn tất
          </TabsTrigger>

          <TabsTrigger value="CANCELLED" className="rounded-lg">
            Đã hủy
          </TabsTrigger>
        </TabsList>
      </Tabs>

    </div>
  );
};