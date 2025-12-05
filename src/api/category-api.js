import axiosInstance from './axios-instance';

export const categoryApi = {
  getCategories: async () => axiosInstance.get('/v1/categories'),
};
