import axiosInstance from '@/config/axios';

export interface PatientInvoice {
  invoiceId: number;
  recordId: number;
  totalPrice: number;
  paymentMethod?: 'CASH' | 'TRANSFER';
  status: 'UNPAID' | 'PENDING_VERIFY' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  items: Array<{
    itemId: number;
    itemType: 'CONSULTATION' | 'SERVICE';
    referenceId: number;
    description: string;
    priceAtTime: number;
  }>;
}

export const billingApi = {
  getMyInvoices: async (): Promise<PatientInvoice[]> => {
    const res = await axiosInstance.get('/invoices/my');
    return res.data.data;
  },

  requestTransfer: async (id: number): Promise<PatientInvoice> => {
    const res = await axiosInstance.put(`/invoices/${id}/request-transfer`);
    return res.data.data;
  }
};
