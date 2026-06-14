export interface Medicine {
     medicineId: number;
     name: string;
     activeElement: string;
     unit: string;
     sellPrice: number;
     quantity: number;
     minStockLevel: number;
     usageNote?: string;
     productionUnit?: string;
   }
   
   export interface PurchaseOrder {
     poId: number;
     supplierId: number;
     supplierName: string; // Joined from supplier table
     orderDate: string;
     totalAmount: number;
     status: 'PENDING' | 'RECEIVED' | 'CANCELLED';
     createdByName: string; // Joined from staff
   }
   
   export interface PrescriptionUI {
     prescriptionId: number;
     recordId: number;
     patientName: string; // Joined from patient
     doctorName: string;  // Joined from staff
     createdAt: string;
     status: 'PENDING' | 'DISPENSED'; // UI status derived from inventory/bill
     items: any[];
   }


export interface Supplier {
     supplierId: number;
     supplierName: string;
     contactName: string;
     phone: string;
     email: string;
     address: string;
     isActive: boolean;
     createdAt?: string;
   }
   
   export type TransactionType = 'IMPORT' | 'DISPENSE' | 'EXPIRED' | 'LOST' | 'ADJUSTMENT';
   
   export interface InventoryTransaction {
     transactionId: number;
     medicineId: number;
     medicineName: string; // Joined from medicine
     transactionType: TransactionType;
     quantity: number;
     referenceId?: string;
     handledByName: string; // Joined from staff
     note?: string;
     createdAt: string;
   }