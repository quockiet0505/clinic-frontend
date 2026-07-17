export type StaffType = 'DOCTOR' | 'RECEPTIONIST' | 'NURSE' | 'LAB_TECH' | 'ADMIN';
export type LeaveType = 'ANNUAL' | 'SICK' | 'UNPAID' | 'OTHER';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Staff {
  staffId: number;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  staffType: StaffType;
  expertiseId?: number;
  expertiseName?: string;
  experience?: string;
  specialtyTreatment?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  featuredPriority?: number;
  rating?: number;
  isActive?: number | boolean;
  isDeleted?: number;
  accountId?: number;
}

export interface LeaveRequest {
  leaveId: number;
  staffId: number;
  fullName?: string;
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
