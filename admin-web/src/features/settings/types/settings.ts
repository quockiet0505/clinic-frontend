export interface Expertise {
  expertiseId: number;
  expertiseName: string;
  iconUrl?: string;
   doctorCount?: number;
  createdAt?: string;
}

export interface Service {
  serviceId: number;
  serviceName: string;
  serviceType: 'EXAM' | 'LAB_TEST' | 'X_RAY' | 'ULTRASOUND' | 'CT_SCAN' | 'MRI' | 'ENDOSCOPY' | 'OTHER';
  estimatedDuration?: number;
  originalPrice: number;
  discountPrice?: number;
  imageUrl?: string;
  isFeatured?: boolean;
  isDeleted?: number;
}

export interface DoctorPricing {
  id: number;
  staffId: number;
  doctorName: string;
  serviceId: number;
  serviceName: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  imageUrl?: string;
}

export interface Role {
  roleId: number;
  roleCode: string;
  roleName: string;
}