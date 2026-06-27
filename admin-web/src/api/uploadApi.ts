import axiosInstance from '@/config/axios';

export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      toastSuccess: 'Tải ảnh thành công',
    });
    return res.data.data as string;
  },
};
