import axiosInstance from '@/config/axios';
import { Appointment } from '../types/appointment';

export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    // Assuming backend returns an array of appointments via ApiResponse.data
    // Since we use mock data in the UI temporarily, let's still hit the backend but fallback
    try {
      const res = await axiosInstance.get('/appointments');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  
  cancel: async (id: number, reason: string): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/cancel?reason=${encodeURIComponent(reason)}`);
  },

  checkIn: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/status`, { status: 'CHECKED_IN' });
  }
};
