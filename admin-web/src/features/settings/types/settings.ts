export interface Expertise {
     expertise_id: number;
     expertise_name: string;
     description?: string;
     doctorCount: number;
     status: 'Active' | 'Inactive';
   }
   
   export interface Service {
     service_id: number;
     service_name: string;
     service_type: 'EXAM' | 'LAB_TEST' | 'IMAGING';
     price: number;
     is_deleted?: number;
   }
   
   export interface DoctorPricing {
     id: number;          
     staff_id: number;
     name: string;        
     specialty: string;   
     fee: number;         
   }
   
   export interface Role {
     role_id: number;
     role_code: string;
     role_name: string;
   }