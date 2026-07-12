import axiosInstance from '@/config/axios';
import { parsePagedResponse } from '@/utils/pagedApi';
import { BillInvoice } from '../types/finance';

export const financeApi = {
  getInvoices: async (params?: { status?: string; search?: string; page?: number; size?: number }): Promise<{ content: BillInvoice[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/invoices', { params, skipToast: true });
      return parsePagedResponse<BillInvoice>(res.data);
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  getInvoiceById: async (id: number): Promise<BillInvoice> => {
    const res = await axiosInstance.get(`/invoices/${id}`);
    return res.data.data;
  },

  collectPayment: async (id: number, paymentMethod: 'CASH' | 'TRANSFER'): Promise<BillInvoice> => {
    const res = await axiosInstance.put(`/invoices/${id}/pay`, null, {
      params: { paymentMethod },
      toastSuccess: 'Thu phí hóa đơn thành công'
    });
    return res.data.data;
  },

  confirmTransfer: async (id: number): Promise<BillInvoice> => {
    const res = await axiosInstance.put(`/invoices/${id}/confirm-transfer`, null, {
      toastSuccess: 'Đã gửi yêu cầu đối soát chuyển khoản'
    });
    return res.data.data;
  },

  verifyTransfer: async (id: number, verifyStatus: 'PAID' | 'UNPAID'): Promise<BillInvoice> => {
    const res = await axiosInstance.put(`/invoices/${id}/verify-transfer`, null, {
      params: { status: verifyStatus },
      toastSuccess: verifyStatus === 'PAID' ? 'Xác nhận hóa đơn đã thanh toán' : 'Từ chối giao dịch chuyển khoản'
    });
    return res.data.data;
  }
};
