import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import LeaveRequestsFilterBar from '../components/LeaveRequestsFilterBar';
import LeaveRequestsTable from '../components/LeaveRequestsTable';
import { LeaveRequest } from '../types/staff';

const TODAY = new Date().toISOString().split('T')[0];

const MOCK_LEAVES: LeaveRequest[] = [
  { leaveId: 1, staffId: 101, fullName: 'Dr. Sarah Smith', staffType: 'DOCTOR', leaveType: 'ANNUAL', fromDate: TODAY, toDate: TODAY, reason: 'Conference', status: 'APPROVED', appliedAt: '2026-04-05', approvedBy: 'Admin Michael' },
  { leaveId: 2, staffId: 102, fullName: 'Nurse John Doe', staffType: 'STAFF', leaveType: 'SICK', fromDate: '2026-04-15', toDate: '2026-04-16', reason: 'Surgery', status: 'PENDING', appliedAt: '2026-04-09' },
];

export default function LeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('TODAY');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [filterDate, setFilterDate] = useState(TODAY); 
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const handleProcessLeave = (action: string, reason: string) => {
    setRequests(requests.map(req => req.leaveId === selectedRequest?.leaveId ? { ...req, status: action as any, approvedBy: 'System Admin', rejectionReason: reason } : req));
    setSelectedRequest(null);
  };

  const filteredData = requests.filter(req => {
    const matchSearch = req.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'ALL' || req.staffType === roleFilter;
    let matchView = false;
    let matchDate = true;

    if (activeView === 'TODAY') matchView = req.status === 'APPROVED' && req.fromDate <= TODAY && req.toDate >= TODAY;
    else if (activeView === 'PENDING') { matchView = req.status === 'PENDING'; if (filterDate) matchDate = req.toDate >= filterDate; }
    else if (activeView === 'PROCESSED') { matchView = req.status !== 'PENDING'; if (filterDate) matchDate = req.toDate >= filterDate; }

    return matchSearch && matchRole && matchView && matchDate;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Leave & Attendance" description="Manage staff time-off requests." />
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-10 w-full sm:w-40 rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-600">
            <option value="ALL">All Roles</option><option value="DOCTOR">Doctors</option><option value="STAFF">Nhân viên</option><option value="LAB_TECH">Lab Techs</option>
          </select>
          {activeView !== 'TODAY' && (
            <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 h-10 shadow-sm">
              <CalendarDays size={16} className="text-slate-400" /><span className="text-sm font-bold text-slate-500">From:</span>
              <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="h-8 border-0 bg-transparent p-0 font-medium text-slate-700" />
            </div>
          )}
        </div>
      </div>

      <LeaveRequestsFilterBar activeView={activeView} setActiveView={setActiveView} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <LeaveRequestsTable data={filteredData} onAction={setSelectedRequest} />

      <ActionReasonDialog 
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
        onConfirm={handleProcessLeave}
        title="Review Leave Request"
        description={`Review request from ${selectedRequest?.fullName}.`}
        actorLabel="Decision"
        actorOptions={[{ label: 'Approve Request', value: 'APPROVED' }, { label: 'Reject Request', value: 'REJECTED' }]}
        reasonLabel="Admin Note (Required for Rejection)"
        confirmColor="blue"
        confirmText="Submit Decision"
      />
    </div>
  );
}