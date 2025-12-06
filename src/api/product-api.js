import axiosInstance from './axios-instance';

export const productApi = {
  getProductDetails: async (productId) => await axiosInstance.get(`/v1/products/${productId}`),
};
