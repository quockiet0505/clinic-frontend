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


  // features/dashboard/api/dashboardApi.ts
previewReport: async (filter: ReportFilter): Promise<string> => {
  try {
    const res = await axiosInstance.post('/dashboard/report-preview', filter);
    return res.data.data || '';
  } catch (error) {
    console.error('Preview error:', error);
    return '';
  }
},

  // Thống kê bác sĩ
  getDoctorStats: async (month: number, year: number): Promise<DoctorStat[]> => {
    try {
      const res = await axiosInstance.get(`/dashboard/doctor-stats?month=${month}&year=${year}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
      return [];
    }
  },

  // Thống kê dịch vụ
  getServiceStats: async (month: number, year: number): Promise<ServiceStat[]> => {
    try {
      const res = await axiosInstance.get(`/dashboard/service-stats?month=${month}&year=${year}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching service stats:', error);
      return [];
    }
  },

  // Thống kê bệnh nhân
  getPatientStats: async (month: number, year: number): Promise<PatientStatsSummary> => {
    try {
      const res = await axiosInstance.get(`/dashboard/patient-stats?month=${month}&year=${year}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching patient stats:', error);
      return {
        newPatients: 0,
        returningPatients: 0,
        topPatients: [],
      };
    }
  },

  // Thống kê doanh thu
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

  // Lấy dữ liệu thống kê theo tháng (cho biểu đồ)
getMonthlyStats: async (year: number): Promise<MonthlyStat[]> => {
  try {
    const res = await axiosInstance.get(`/dashboard/monthly-stats?year=${year}`);
    return res.data.data.map((item: any) => ({
      name: item.name,
      completed: item.completed || 0,
      cancelled: item.cancelled || 0,
    }));
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    return [];
  }
},

  // Lấy lịch hẹn gần đây
  getRecentAppointments: async (limit: number = 10): Promise<RecentAppointment[]> => {
    try {
      const res = await axiosInstance.get(`/dashboard/recent-appointments?limit=${limit}`);
      return res.data.data;
    } catch (error) {
      console.error('Error fetching recent appointments:', error);
      return [];
    }
  },

  // Xuất báo cáo PDF
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