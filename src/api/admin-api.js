import axiosInstance from '@/api/axios-instance';

export const adminApi = {
  getUsers: async () => await axiosInstance.get('/v1/admin/users'),
};
