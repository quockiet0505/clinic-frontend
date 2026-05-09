export type StaffType = 'DOCTOR' | 'STAFF' | 'LAB_TECH' | 'ADMIN';
export type LeaveType = 'ANNUAL' | 'SICK' | 'UNPAID' | 'OTHER';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Staff {
  staff_id: number;
  full_name: string;
  email: string; // Joined from account table
  phone: string;
  staff_type: StaffType;
  expertise_name?: string; // Joined from expertise table
  is_active: boolean;
}

export interface LeaveRequest {
  leave_id: number;
  staff_id: number;
  full_name?: string; // Joined for Admin view
  staff_type?: StaffType;
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  reason: string;
  status: LeaveStatus;
  applied_at: string;
  approved_by?: string;
  rejection_reason?: string;
}