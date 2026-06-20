import axiosInstance from '@/config/axios';

export interface DoctorFeedbackSubmitRequest {
  doctorId: number;
  appointmentId: number;
  rating: number;
  comment: string;
  isAnonymous?: boolean;
}

export interface ClinicFeedbackSubmitRequest {
  recordId: number;
  rating: number;
  comment: string;
  isAnonymous?: boolean;
}

export interface DoctorFeedbackResponse {
  reviewId: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
  isAnonymous?: boolean;
}

export interface ClinicFeedbackResponse {
  feedbackId: number;
  recordId: number;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
  isAnonymous?: boolean;
}

export const reviewApi = {
  submitDoctorReview: async (data: DoctorFeedbackSubmitRequest): Promise<void> => {
    await axiosInstance.post('/feedbacks/doctor/my', data);
  },
  
  submitClinicReview: async (data: ClinicFeedbackSubmitRequest): Promise<void> => {
    await axiosInstance.post('/feedbacks/clinic/my', data);
  },
  
  getMyDoctorReviews: async (): Promise<DoctorFeedbackResponse[]> => {
    const res = await axiosInstance.get('/feedbacks/doctor/my');
    return res.data.data;
  },
  
  getMyClinicReviews: async (): Promise<ClinicFeedbackResponse[]> => {
    const res = await axiosInstance.get('/feedbacks/clinic/my');
    return res.data.data;
  }
};
