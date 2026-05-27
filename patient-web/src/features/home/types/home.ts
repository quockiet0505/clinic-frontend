export interface QuickAction {
  id: number;
  title: string;
  iconUrl: string;
}

export interface Specialty {
  expertiseId: number;
  expertiseName: string;
  iconUrl: string;
}

export interface Doctor {
  staffId: number;
  fullName: string;
  imageUrl: string;
  expertise?: {
    expertiseId: number;
    expertiseName: string;
  };
  consultationFee?: number; 
}

export interface ServicePackage {
  serviceId: number;
  serviceName: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
}