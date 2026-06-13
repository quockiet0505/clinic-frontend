export interface ExpenseCategory {
     categoryId: number;
     categoryName: string;
     description: string;
   }
   
   export interface ClinicExpense {
     expenseId: number;
     categoryId: number;
     categoryName: string; // Joined từ expenseCategory
     amount: number;
     expenseDate: string;
     paymentMethod: 'CASH' | 'TRANSFER';
     description: string;
     created_by_name: string; // Joined từ staff
   }
   
   export type BillStatus = 'UNPAID' | 'PAID' | 'CANCELLED' | 'REFUNDED';
   
   export interface BillInvoice {
     billId: number;
     recordId: number;
     patientName: string; // Joined từ patient
     totalPrice: number;
     paymentMethod?: 'CASH' | 'TRANSFER';
     status: BillStatus;
     createdAt: string;
   }