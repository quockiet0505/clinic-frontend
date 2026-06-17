// features/dashboard/types/dashboard.ts
export interface DashboardStats {
  totalPatients: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  pendingAppointments: number;
  totalAppointments: number;
  totalStaff: number;
  totalDoctors: number;
  totalFeedbacks: number;
  avgRating: number;
  monthlyRevenue: number;
}

export interface RecentAppointment {
  id: string;
  patientName: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

export interface MonthlyStat {
  name: string;
  completed: number;
  cancelled: number;
  rescheduled: number;
}

export interface DoctorStat {
  doctorId: number;
  doctorName: string;
  totalAppointments: number;
  completedAppointments: number;
  completionRate: number;
  revenue: number;
  avgRating: number;
}

export interface ServiceStat {
  serviceId: number;
  serviceName: string;
  totalOrders: number;
  completedOrders: number;
  completionRate: number;
  revenue: number;
}

export interface PatientStat {
  patientId: number;
  patientName: string;
  visitCount: number;
  lastVisit: string;
  totalSpent: number;
}

export interface PatientStatsSummary {
  newPatients: number;
  returningPatients: number;
  topPatients: PatientStat[];
}

export interface RevenueStat {
  serviceName: string;
  revenue: number;
  percentage: number;
}

export interface RevenueStatsSummary {
  totalRevenue: number;
  monthlyTrend: MonthlyStat[];
  byService: RevenueStat[];
}

export interface ReportFilter {
  type: 'overview' | 'doctors' | 'services' | 'patients' | 'revenue' | 'all';
  period: 'month' | 'quarter';
  month?: number;
  year?: number;
  quarter?: number;
  format: 'pdf' | 'excel';
}