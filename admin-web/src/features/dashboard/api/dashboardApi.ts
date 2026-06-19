// features/dashboard/api/dashboardApi.ts
import axiosInstance from '@/config/axios';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import {
  DashboardStats,
  RecentAppointment,
  MonthlyStat,
  DoctorStat,
  ServiceStat,
  PatientStat,
  PatientStatsSummary,
  RevenueStatsSummary,
  ReportFilter,
} from '../types/dashboard';

export interface DashboardQueryParams extends BaseFilterParams {
  month?: number;
  year?: number;
  sortBy?: string;
  sortDir?: string;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const res = await axiosInstance.get('/dashboard/stats');
      return res.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalPatients: 0,
        appointmentsToday: 0,
        appointmentsThisWeek: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        noShowAppointments: 0,
        pendingAppointments: 0,
        totalAppointments: 0,
        totalStaff: 0,
        totalDoctors: 0,
        totalFeedbacks: 0,
        avgRating: 0,
        monthlyRevenue: 0,
      };
    }
  },

  previewReport: async (filter: ReportFilter): Promise<string> => {
    try {
      const res = await axiosInstance.post('/dashboard/report-preview', filter);
      return res.data.data || '';
    } catch (error) {
      console.error('Preview error:', error);
      return '';
    }
  },

  getDoctorStatsPaged: async (params: DashboardQueryParams) => {
    try {
      const res = await axiosInstance.get('/dashboard/doctor-stats', { params });
      const d = res.data?.data ?? {};
      const page = parsePagedResponse<DoctorStat>({ data: d.page ?? d });
      return {
        totalDoctors: d.totalDoctors ?? 0,
        totalRevenue: d.totalRevenue ?? 0,
        avgCompletionRate: d.avgCompletionRate ?? 0,
        content: (page.content ?? []).map((item) => ({
          doctorId: item.doctorId,
          doctorName: item.doctorName,
          totalAppointments: item.totalAppointments ?? 0,
          completedAppointments: item.completedAppointments ?? 0,
          completionRate: item.completionRate ?? 0,
          revenue: item.revenue ?? 0,
          avgRating: item.avgRating ?? 0,
          imageUrl: item.imageUrl ?? undefined,
        })),
        totalElements: page.totalElements ?? 0,
      };
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
      return { totalDoctors: 0, totalRevenue: 0, avgCompletionRate: 0, content: [], totalElements: 0 };
    }
  },

  getServiceStatsPaged: async (params: DashboardQueryParams) => {
    try {
      const res = await axiosInstance.get('/dashboard/service-stats', { params });
      const d = res.data?.data ?? {};
      const page = parsePagedResponse<ServiceStat>({ data: d.page ?? d });
      return {
        totalServices: d.totalServices ?? 0,
        totalOrders: d.totalOrders ?? 0,
        totalRevenue: d.totalRevenue ?? 0,
        content: (page.content ?? []).map((item) => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          totalOrders: item.totalOrders ?? 0,
          completedOrders: item.completedOrders ?? 0,
          completionRate: item.completionRate ?? 0,
          revenue: item.revenue ?? 0,
          imageUrl: item.imageUrl ?? undefined,
        })),
        totalElements: page.totalElements ?? 0,
      };
    } catch (error) {
      console.error('Error fetching service stats:', error);
      return { totalServices: 0, totalOrders: 0, totalRevenue: 0, content: [], totalElements: 0 };
    }
  },

  getPatientStatsPaged: async (params: DashboardQueryParams) => {
    try {
      const res = await axiosInstance.get('/dashboard/patient-stats', { params });
      const d = res.data.data;
      const page = parsePagedResponse<PatientStat>({ data: d.topPatients });
      return {
        newPatients: d.newPatients || 0,
        returningPatients: d.returningPatients || 0,
        topPatients: page.content,
        totalElements: page.totalElements,
      };
    } catch (error) {
      console.error('Error fetching patient stats:', error);
      return { newPatients: 0, returningPatients: 0, topPatients: [], totalElements: 0 };
    }
  },

  getRevenueStatsPaged: async (params: DashboardQueryParams): Promise<RevenueStatsSummary & { byServiceTotal: number }> => {
    try {
      const res = await axiosInstance.get('/dashboard/revenue-stats', { params });
      const d = res.data.data;
      const byServicePage = parsePagedResponse<{ serviceName: string; revenue: number; percentage: number }>({
        data: d.byService,
      });
      return {
        totalRevenue: d.totalRevenue || 0,
        consultationRevenue: d.consultationRevenue || 0,
        serviceRevenue: d.serviceRevenue || 0,
        monthlyTrend: d.monthlyTrend || [],
        byService: byServicePage.content,
        byServiceTotal: byServicePage.totalElements,
      };
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return { totalRevenue: 0, consultationRevenue: 0, serviceRevenue: 0, monthlyTrend: [], byService: [], byServiceTotal: 0 };
    }
  },

  getMonthlyStats: async (year: number): Promise<MonthlyStat[]> => {
    try {
      const res = await axiosInstance.get(`/dashboard/monthly-stats?year=${year}`);
      return res.data.data.map((item: { name?: string; completed?: number; cancelled?: number; rescheduled?: number }) => ({
        name: item.name || '',
        completed: item.completed || 0,
        cancelled: item.cancelled || 0,
        rescheduled: item.rescheduled || 0,
      }));
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      return [];
    }
  },

  getRecentAppointments: async (limit: number = 10): Promise<RecentAppointment[]> => {
    try {
      const res = await axiosInstance.get(`/dashboard/recent-appointments?limit=${limit}`);
      return res.data.data.map((item: { appointmentId?: number; patientName?: string; appointmentDate?: string; status?: string; patientAvatarUrl?: string }) => ({
        id: item.appointmentId?.toString() || '',
        patientName: item.patientName || 'Unknown',
        time: item.appointmentDate || '',
        status: item.status || 'PENDING',
        avatarUrl: item.patientAvatarUrl || null,
      }));
    } catch (error) {
      console.error('Error fetching recent appointments:', error);
      return [];
    }
  },

  generateReport: async (filter: ReportFilter): Promise<Blob> => {
    const response = await axiosInstance.post('/dashboard/report', filter, { responseType: 'blob' });
    return response.data;
  },
};
