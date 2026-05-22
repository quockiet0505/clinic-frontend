// Định nghĩa các Interface dựa trên CSDL (Database Schema)
export interface Expertise {
     id: number;
     name: string;
   }
   
   export interface Doctor {
     id: number;
     expertiseId: number;
     fullName: string;
   }
   
   export interface Service {
     id: number;
     name: string;
     price: number;
   }
   
   export interface AvailableDate {
     dateString: string; 
     displayDate: string; 
     dayOfWeek: string; 
   }
   
   export interface TimeSlot {
     timeStart: string; 
     timeEnd: string; 
     displayTime: string; 
     period: 'morning' | 'afternoon';
     isAvailable: boolean;
   }
   
   // State của Form đặt lịch
   export interface BookingFormState {
     expertiseId: number | '';
     serviceId: number | ''; 
     doctorId: number | '';  
     appointmentDate: string;
     timeStart: string;
     timeEnd: string;
     description: string;    
   }
   
   // Dữ liệu cho trang Danh sách Lịch khám của tôi
   export interface AppointmentHistory {
     id: number;
     doctorName: string;
     expertiseName: string;
     appointmentDate: string;
     timeStart: string;
     timeEnd: string;
     status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
     clinicName: string;
     cancelReason?: string;
   }