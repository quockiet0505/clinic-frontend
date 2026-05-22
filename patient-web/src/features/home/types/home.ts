export interface QuickAction {
  id: string | number;
  title: string;
  iconUrl: string;
  slug?: string;
}

export interface Specialty {
  id: string | number;
  name: string;
  iconUrl: string;
}

export interface Doctor {
  id: string | number;
  fullName: string;
  specialtyName: string;
  rating: number;
  consultationFee: number;
  avatarUrl: string;
}

export interface ServicePackage {
  id: string | number;
  title: string;
  clinicName?: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
}