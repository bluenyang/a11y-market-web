import axiosInstance from './axios-instance';

export const categoryApi = {
  getCategories: async () => await axiosInstance.get('/v1/categories'),
};
