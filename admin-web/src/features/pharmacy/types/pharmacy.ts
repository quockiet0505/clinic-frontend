export interface Medicine {
     medicine_id: number;
     name: string;
     active_element: string;
     unit: string;
     sell_price: number;
     quantity: number;
     min_stock_level: number;
     usage_note?: string;
     production_unit?: string;
   }
   
   export interface PurchaseOrder {
     po_id: number;
     supplier_id: number;
     supplier_name: string; // Joined from supplier table
     order_date: string;
     total_amount: number;
     status: 'PENDING' | 'RECEIVED' | 'CANCELLED';
     created_by_name: string; // Joined from staff
   }
   
   export interface PrescriptionUI {
     prescription_id: number;
     record_id: number;
     patient_name: string; // Joined from patient
     doctor_name: string;  // Joined from staff
     created_at: string;
     status: 'PENDING' | 'DISPENSED'; // UI status derived from inventory/bill
     items: any[];
   }


export interface Supplier {
     supplier_id: number;
     supplier_name: string;
     contact_name: string;
     phone: string;
     email: string;
     address: string;
     is_active: boolean;
     created_at?: string;
   }
   
   export type TransactionType = 'IMPORT' | 'DISPENSE' | 'EXPIRED' | 'LOST' | 'ADJUSTMENT';
   
   export interface InventoryTransaction {
     transaction_id: number;
     medicine_id: number;
     medicine_name: string; // Joined from medicine
     transaction_type: TransactionType;
     quantity: number;
     reference_id?: string;
     handled_by_name: string; // Joined from staff
     note?: string;
     created_at: string;
   }