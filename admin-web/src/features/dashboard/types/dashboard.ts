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
  avatarUrl?: string;
}

export interface MonthlyStat {
  name: string;
  completed: number;
  cancelled: number;
}

export interface DoctorStat {
  doctorId: number;
  doctorName: string;
  totalAppointments: number;
  completedAppointments: number;
  completionRate: number;
  revenue: number;
  avgRating: number;
  imageUrl?: string; 
}

export interface ServiceStat {
  serviceId: number;
  serviceName: string;
  totalOrders: number;
  completedOrders: number;
  completionRate: number;
  revenue: number;
  imageUrl?: string; 
}

export interface PatientStat {
  patientId: number;
  patientName: string;
  visitCount: number;
  lastVisit: string;
  totalSpent: number;
  avatarUrl?: string; 
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

export interface RevenueMonthlyTrend {
  name: string;
  revenue: number;
}

export interface RevenueStatsSummary {
  totalRevenue: number;
  consultationRevenue?: number;
  serviceRevenue?: number;
  monthlyTrend: RevenueMonthlyTrend[];
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