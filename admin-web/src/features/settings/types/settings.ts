export interface Expertise {
     expertiseId: number;
     expertiseName: string;
     description?: string;
     doctorCount: number;
     status: 'Active' | 'Inactive';
   }
   
   export interface Service {
     serviceId: number;
     serviceName: string;
     serviceType: 'EXAM' | 'LAB_TEST' | 'IMAGING';
     price: number;
     isDeleted?: number;
   }
   
   export interface DoctorPricing {
     id: number;          
     staffId: number;
     name: string;        
     specialty: string;   
     fee: number;         
   }
   
   export interface Role {
     roleId: number;
     roleCode: string;
     roleName: string;
   }