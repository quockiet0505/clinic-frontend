export interface Expertise {
  expertiseId: number;
  expertiseName: string;
  iconUrl?: string;
   doctorCount?: number;
  technicianCount?: number;
  createdAt?: string;
}

export interface Service {
  serviceId: number;
  serviceName: string;
  serviceType: 'EXAM' | 'LAB_TEST' | 'X_RAY' | 'ULTRASOUND' | 'CT_SCAN' | 'MRI' | 'ENDOSCOPY' | 'OTHER';
  estimatedDuration?: number;
  originalPrice: number;
  discountAmount?: number;
  imageUrl?: string;
  isFeatured?: boolean;
  isDeleted?: number;
}

export interface DoctorPricing {
  id: number;
  staffId: number;
  doctorName: string;
  price: number;
  originalPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  imageUrl?: string;
}

export interface Role {
  roleId: number;
  roleCode: string;
  roleName: string;
}