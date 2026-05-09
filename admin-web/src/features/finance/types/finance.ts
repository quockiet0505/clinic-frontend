export interface ExpenseCategory {
     category_id: number;
     category_name: string;
     description: string;
   }
   
   export interface ClinicExpense {
     expense_id: number;
     category_id: number;
     category_name: string; // Joined từ expense_category
     amount: number;
     expense_date: string;
     payment_method: 'CASH' | 'TRANSFER';
     description: string;
     created_by_name: string; // Joined từ staff
   }
   
   export type BillStatus = 'UNPAID' | 'PAID' | 'CANCELLED' | 'REFUNDED';
   
   export interface BillInvoice {
     bill_id: number;
     record_id: number;
     patient_name: string; // Joined từ patient
     total_price: number;
     payment_method?: 'CASH' | 'TRANSFER';
     status: BillStatus;
     created_at: string;
   }