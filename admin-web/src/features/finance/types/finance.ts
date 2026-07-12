export interface ExpenseCategory {
  categoryId: number;
  categoryName: string;
  description: string;
}

export interface ClinicExpense {
  expenseId: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  expenseDate: string;
  paymentMethod: 'CASH' | 'TRANSFER';
  description: string;
  created_by_name: string;
}

export type BillStatus = 'UNPAID' | 'PENDING_VERIFY' | 'PAID' | 'CANCELLED' | 'REFUNDED';

export interface InvoiceItem {
  itemId: number;
  itemType: 'CONSULTATION' | 'SERVICE';
  referenceId: number;
  description: string;
  priceAtTime: number;
}

export interface BillInvoice {
  invoiceId: number;
  recordId: number;
  patientId: number;
  patientName: string;
  patientPhone: string;
  totalPrice: number;
  paymentMethod?: 'CASH' | 'TRANSFER';
  status: BillStatus;
  createdAt: string;
  items?: InvoiceItem[];
}