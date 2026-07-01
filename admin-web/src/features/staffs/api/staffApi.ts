import axiosInstance from '@/config/axios';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import { Staff, LeaveRequest } from '../types/staff';

interface StaffQueryParams extends BaseFilterParams {
  staffType?: string;
  expertiseId?: number;
  isActive?: number;
  minRating?: number;
  sortBy?: string;
  sortDir?: string;
}

interface LeaveRequestQueryParams extends BaseFilterParams {
  status?: string;
  leaveType?: string;
  staffType?: string;
  tab?: string;
  sortBy?: string;
  sortDir?: string;
}

export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    const res = await axiosInstance.get('/staffs/all');
    return res.data.data.map((doc: any) => {
      if (doc && doc.imageUrl && doc.imageUrl.startsWith('/')) {
        doc.imageUrl = `${import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:8080'}${doc.imageUrl}`;
      }
      return doc;
    });
  },

  getById: async (id: number): Promise<Staff | null> => {
    try {
      const res = await axiosInstance.get(`/staffs/${id}`);
      const doc = res.data.data;
      if (doc && doc.imageUrl && doc.imageUrl.startsWith('/')) {
        doc.imageUrl = `${import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:8080'}${doc.imageUrl}`;
      }
      return doc;
    } catch {
      return null;
    }
  },

  getAllPaged: async (params?: StaffQueryParams): Promise<{ content: Staff[]; totalElements: number }> => {
    const res = await axiosInstance.get('/staffs', { params });
    const parsed = parsePagedResponse<Staff>(res.data);
    if (!parsed.content.length && parsed.totalElements === 0 && res.data?.success === false) {
      console.error('getAllPaged staffs failed:', res.data?.message);
    }
    parsed.content = parsed.content.map((doc: any) => {
      if (doc && doc.imageUrl && doc.imageUrl.startsWith('/')) {
        doc.imageUrl = `${import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:8080'}${doc.imageUrl}`;
      }
      return doc;
    });
    return parsed;
  },

  create: async (data: Omit<Staff, 'staffId'> | Record<string, unknown>): Promise<void> => {
    await axiosInstance.post('/staffs', data, { toastSuccess: 'Thêm nhân viên thành công' });
  },

  update: async (id: number, data: Partial<Staff> | Record<string, unknown>): Promise<void> => {
    await axiosInstance.put(`/staffs/${id}`, data, { toastSuccess: 'Cập nhật nhân viên thành công' });
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/staffs/${id}`, { toastSuccess: 'Xóa nhân viên thành công' });
  },

  getLeaveRequestsPaged: async (
    params?: LeaveRequestQueryParams
  ): Promise<{ content: LeaveRequest[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/leave-requests', { params });
      return parsePagedResponse<LeaveRequest>(res.data);
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    const res = await axiosInstance.get('/leave-requests/all');
    return res.data.data;
  },

  cancelLeaveRequest: async (leaveId: number): Promise<void> => {
    await axiosInstance.delete(`/leave-requests/${leaveId}`, { toastSuccess: 'Đã hủy đơn nghỉ phép' });
  },

  reviewLeaveRequest: async (
    leaveId: number,
    status: 'APPROVED' | 'REJECTED',
    rejectionReason?: string
  ): Promise<void> => {
    await axiosInstance.put(
      `/leave-requests/${leaveId}/review`,
      { status, rejectionReason },
      { toastSuccess: 'Đã cập nhật trạng thái đơn' }
    );
  },

  createLeaveRequest: async (data: {
    leaveType: string;
    fromDate: string;
    toDate: string;
    reason: string;
  }): Promise<void> => {
    await axiosInstance.post('/leave-requests', data, { toastSuccess: 'Nộp đơn xin nghỉ thành công' });
  },
};
