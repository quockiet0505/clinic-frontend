export type StaffType = 'DOCTOR' | 'STAFF' | 'LAB_TECH' | 'ADMIN';
export type LeaveType = 'ANNUAL' | 'SICK' | 'UNPAID' | 'OTHER';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Staff {
  staffId: number;
  fullName: string;
  email: string;
  phone: string;
  staffType: StaffType;
  expertiseName?: string;
  imageUrl?: string;
  rating?: number;
  isActive: boolean;
}

export interface LeaveRequest {
  leaveId: number;
  staffId: number;
  fullName?: string; // Joined for Admin view
  staffType?: StaffType;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  approvedBy?: string;
  rejectionReason?: string;
}