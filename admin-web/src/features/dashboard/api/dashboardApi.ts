// features/dashboard/api/dashboardApi.ts
import axiosInstance from '@/config/axios';
import { 
  DashboardStats, 
  RecentAppointment, 
  MonthlyStat,
  DoctorStat,
  ServiceStat,
  PatientStatsSummary,
  RevenueStatsSummary,
  ReportFilter
} from '../types/dashboard';

export const dashboardApi = {
  // Stats tổng quan
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

  getDoctorStats: async (month: number, year: number): Promise<DoctorStat[]> => {
    try {
      const res = await axiosInstance.get(`/dashboard/doctor-stats?month=${month}&year=${year}`);
      return res.data.data.map((item: any) => ({
        doctorId: item.doctorId,
        doctorName: item.doctorName,
        totalAppointments: item.totalAppointments || 0,
        completedAppointments: item.completedAppointments || 0,
        completionRate: item.completionRate || 0,
        revenue: item.revenue || 0,
        avgRating: item.avgRating || 0,
        imageUrl: item.imageUrl || null, //  map ảnh bác sĩ
      }));
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
      return [];
    }
  },

  getServiceStats: async (month: number, year: number): Promise<ServiceStat[]> => {
    try {
      const res = await axiosInstance.get(`/dashboard/service-stats?month=${month}&year=${year}`);
      return res.data.data.map((item: any) => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        totalOrders: item.totalOrders || 0,
        completedOrders: item.completedOrders || 0,
        completionRate: item.completionRate || 0,
        revenue: item.revenue || 0,
        imageUrl: item.imageUrl || null, //  map ảnh dịch vụ
      }));
    } catch (error) {
      console.error('Error fetching service stats:', error);
      return [];
    }
  },

  getPatientStats: async (month: number, year: number): Promise<PatientStatsSummary> => {
    try {
      const res = await axiosInstance.get(`/dashboard/patient-stats?month=${month}&year=${year}`);
      const data = res.data.data;
      return {
        newPatients: data.newPatients || 0,
        returningPatients: data.returningPatients || 0,
        topPatients: (data.topPatients || []).map((p: any) => ({
          patientId: p.patientId,
          patientName: p.patientName,
          visitCount: p.visitCount || 0,
          lastVisit: p.lastVisit || null,
          totalSpent: p.totalSpent || 0,
          avatarUrl: p.avatarUrl || null, //  map avatar bệnh nhân
        })),
      };
    } catch (error) {
      console.error('Error fetching patient stats:', error);
      return {
        newPatients: 0,
        returningPatients: 0,
        topPatients: [],
      };
    }
  },

  getRevenueStats: async (month: number, year: number): Promise<RevenueStatsSummary> => {
    try {
      const res = await axiosInstance.get(`/dashboard/revenue-stats?month=${month}&year=${year}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return {
        totalRevenue: 0,
        monthlyTrend: [],
        byService: [],
      };
    }
  },

  getMonthlyStats: async (year: number): Promise<MonthlyStat[]> => {
    try {
      const res = await axiosInstance.get(`/dashboard/monthly-stats?year=${year}`);
      return res.data.data.map((item: any) => ({
        name: item.name || '',
        completed: item.completed || 0,
        cancelled: item.cancelled || 0,
      }));
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      return [];
    }
  },

  getRecentAppointments: async (limit: number = 10): Promise<RecentAppointment[]> => {
    try {
      const res = await axiosInstance.get(`/dashboard/recent-appointments?limit=${limit}`);
      return res.data.data.map((item: any) => ({
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
    try {
      const response = await axiosInstance.post('/dashboard/report', filter, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },
};