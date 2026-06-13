export interface Expertise {
  expertiseId: number;
  expertiseName: string;
  iconUrl?: string;
  createdAt?: string;
}

export interface Service {
  serviceId: number;
  serviceName: string;
  serviceType: 'EXAM' | 'LAB_TEST' | 'IMAGING';
  originalPrice: number;
  discountPrice?: number;
  isDeleted?: number;
}

export interface DoctorPricing {
  id: number;
  staffId: number;
  doctorName: string;
  serviceId: number;
  serviceName: string;
  price: number;
  imageUrl?: string;
}

export interface Role {
  roleId: number;
  roleCode: string;
  roleName: string;
}