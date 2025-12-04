import axiosInstance from './axios-instance';

export const mainApi = {
  getPopularItems: () => axiosInstance.get('/v1/main/products/populars'),
};
