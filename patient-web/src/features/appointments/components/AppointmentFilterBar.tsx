import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AppointmentStatus } from '../types/appointment';

interface AppointmentFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: AppointmentStatus | 'ALL';
  onStatusChange: (value: AppointmentStatus | 'ALL') => void;
}

export const AppointmentFilterBar: React.FC<AppointmentFilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by doctor, specialty..."
          className="pl-10 rounded-xl h-11 bg-white border-border-default"
        />
      </div>
      <div className="w-full sm:w-48">
        <Select value={status} onValueChange={(val) => onStatusChange(val as AppointmentStatus | 'ALL')}>
          <SelectTrigger className="rounded-xl h-11 bg-white border-border-default">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CHECKED_IN">Checked In</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="WAITING_RESULT">Waiting Result</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};