export interface DashboardStats {
     totalPatients: number;
     appointmentsToday: number;
     monthlyRevenue: number;
     activeStaff: number;
   }
   
   export interface RecentAppointment {
     id: string;
     patientName: string;
     time: string;
     status: 'PENDING' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
   }