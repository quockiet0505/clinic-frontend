import { DashboardStats, RecentAppointment } from '../types/dashboard';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        totalPatients: 2405,
        appointmentsToday: 34,
        monthlyRevenue: 45200,
        activeStaff: 48
      }), 800);
    });
  },

  getRecentAppointments: async (): Promise<RecentAppointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 'APT-101', patientName: 'John Doe', time: '09:00 AM', status: 'PENDING' },
        { id: 'APT-102', patientName: 'Alice Smith', time: '09:30 AM', status: 'CHECKED_IN' },
        { id: 'APT-103', patientName: 'Bob Johnson', time: '10:00 AM', status: 'IN_PROGRESS' },
        { id: 'APT-104', patientName: 'Emma Davis', time: '10:30 AM', status: 'COMPLETED' },
      ]), 800);
    });
  }
};