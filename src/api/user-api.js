import axiosInstance from '@/api/axios-instance';

export const userApi = {
  getProfile: async () => await axiosInstance.get('/v1/users/me'),

  updateProfile: async (data) => await axiosInstance.patch('/v1/users/me', data),
};
