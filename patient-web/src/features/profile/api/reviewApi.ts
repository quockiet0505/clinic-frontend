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
    await axiosInstance.post('/feedbacks/doctor/my', data, {
      toastSuccess: 'Đã gửi đánh giá bác sĩ thành công',
    });
  },

  updateDoctorReview: async (id: number, data: DoctorFeedbackSubmitRequest): Promise<void> => {
    await axiosInstance.put(`/feedbacks/doctor/my/${id}`, data, {
      toastSuccess: 'Đã sửa đánh giá bác sĩ thành công',
    });
  },

  submitClinicReview: async (data: ClinicFeedbackSubmitRequest): Promise<void> => {
    await axiosInstance.post('/feedbacks/clinic/my', data, {
      toastSuccess: 'Đã gửi đánh giá phòng khám thành công',
    });
  },

  updateClinicReview: async (id: number, data: ClinicFeedbackSubmitRequest): Promise<void> => {
    await axiosInstance.put(`/feedbacks/clinic/my/${id}`, data, {
      toastSuccess: 'Đã sửa đánh giá phòng khám thành công',
    });
  },
  
  getMyDoctorReviews: async (): Promise<DoctorFeedbackResponse[]> => {
    const res = await axiosInstance.get('/feedbacks/doctor/my', { skipToast: true });
    return res.data.data;
  },

  getMyClinicReviews: async (): Promise<ClinicFeedbackResponse[]> => {
    const res = await axiosInstance.get('/feedbacks/clinic/my', { skipToast: true });
    return res.data.data;
  }
};
