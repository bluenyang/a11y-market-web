import axiosInstance from './axios-instance';

export const mainApi = {
  getEventBanners: () => axiosInstance.get('/v1/main/events'),

  getPopularItems: () => axiosInstance.get('/v1/main/products/populars'),

  getCategories: () => axiosInstance.get('/v1/main/products/categories'),

  getProductsByCategory: (categoryId) => axiosInstance.get(`/v1/categories/${categoryId}/products`),
};
