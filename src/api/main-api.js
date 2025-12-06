import axiosInstance from './axios-instance';

export const mainApi = {
  getEventBanners: async () => await axiosInstance.get('/v1/main/events'),

  getPopularItems: async () => await axiosInstance.get('/v1/main/products/populars'),

  getCategories: async () => await axiosInstance.get('/v1/main/products/categories'),

  getProductsByCategory: async (categoryId) =>
    await axiosInstance.get(`/v1/categories/${categoryId}/products`),
};
