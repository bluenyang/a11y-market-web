import axiosInstance from './axios-instance';

export const sellerApi = {
  getDashboardStats: async () => {
    try {
      const resp = await axiosInstance.get('/v1/seller/dashboard/stats');

      if (resp.status !== 200) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return resp;
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      return Promise.reject(err);
    }
  },

  getDailyRevenue: async (year, month) => {
    try {
      const resp = await axiosInstance.get('/v1/seller/dashboard/daily-revenue', {
        params: { year, month },
      });

      if (resp.status !== 200) {
        throw new Error('Failed to fetch daily revenue');
      }

      return resp;
    } catch (err) {
      console.error('Error fetching daily revenue:', err);
      return Promise.reject(err);
    }
  },

  getTopProducts: async (topN) => {
    try {
      const resp = await axiosInstance.get('/v1/seller/dashboard/top-products', {
        params: { topN: topN || 5 },
      });

      if (resp.status !== 200) {
        throw new Error('Failed to fetch top products');
      }

      return resp;
    } catch (err) {
      console.error('Error fetching top products:', err);
      return Promise.reject(err);
    }
  },

  getRecentOrders: async (page, size) => {
    try {
      const resp = await axiosInstance.get('/v1/seller/dashboard/recent-orders', {
        params: { page: page || 0, size: size || 5 },
      });

      if (resp.status !== 200) {
        throw new Error('Failed to fetch recent orders');
      }

      return resp;
    } catch (err) {
      console.error('Error fetching recent orders:', err);
      return Promise.reject(err);
    }
  },

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

    try {
      const resp = await axiosInstance.post('/v1/seller/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (resp.status !== 201) {
        throw new Error('Failed to register product');
      }

      return resp;
    } catch (err) {
      console.error('Error registering product:', err);
      return Promise.reject(err);
    }
  },

  getMyProducts: async (page, size) => {
    try {
      const resp = await axiosInstance.get('/v1/seller/products', {
        params: { page: page || 0, size: size || 10 },
      });

      if (resp.status !== 200) {
        throw new Error('Failed to fetch my products');
      }

      return resp;
    } catch (err) {
      console.error('Error fetching my products:', err);
      return Promise.reject(err);
    }
  },

  updateProduct: async (productId, data, images) => {
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

    try {
      const resp = await axiosInstance.put(`/v1/seller/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (resp.status !== 200) {
        throw new Error('Failed to update product');
      }

      return resp;
    } catch (err) {
      console.error('Error updating product:', err);
      return Promise.reject(err);
    }
  },

  deleteMyProduct: async (productId) => {
    try {
      const resp = await axiosInstance.delete(`v1/seller/products/${productId}`);

      if (resp.status !== 204) {
        throw new Error('Failed to delete product');
      }

      return resp;
    } catch (err) {
      console.error('Error deleting product:', err);
      return Promise.reject(err);
    }
  },

  applySellerAccount: async (data) => await axiosInstance.post('/v1/seller/apply', data),

  getSellerInfo: async (sellerId) => await axiosInstance.get(`/v1/seller/info/${sellerId}`),

  getReceivedOrders: async (page, size, status) =>
    await axiosInstance.get('/v1/seller/orders/items', {
      params: { page: page || 0, size: size || 10, orderItemStatus: status || '' },
    }),

  updateOrderItemStatus: async (orderItemId, status) =>
    await axiosInstance.patch(`/v1/seller/orders/items/${orderItemId}/status`, {
      status,
    }),

  updateProductStock: async (productId, newStock) =>
    await axiosInstance.patch(`/v1/seller/products/${productId}/stock`, { productStock: newStock }),

  updateSellerInfo: async (data) => await axiosInstance.put('/v1/seller/me', data),
};
