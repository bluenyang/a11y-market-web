import axiosInstance from './axios-instance';

export const sellerApi = {
  getDashboardStats: async () => await axiosInstance.get('/v1/seller/dashboard/stats'),

  getDailyRevenue: async (year, month) =>
    await axiosInstance.get('/v1/seller/dashboard/daily-revenue', {
      params: { year, month },
    }),

  getTopProducts: async (topN) =>
    await axiosInstance.get('/v1/seller/dashboard/top-products', {
      params: { topN: topN || 5 },
    }),

  getRecentOrders: async (page, size) =>
    await axiosInstance.get('/v1/seller/dashboard/recent-orders', {
      params: { page: page || 0, size: size || 5 },
    }),

  registerProduct: async (data, images) => {
    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    if (images && images.length > 0) {
      Array.from(images).forEach((image) => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });
    }

    return await axiosInstance.post('/v1/seller/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
