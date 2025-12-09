import axiosInstance from '@/api/axios-instance';

export const adminApi = {
  getUsers: async () => {
    try {
      const resp = await axiosInstance.get('/v1/admin/users');

      if (resp.status !== 200) {
        throw new Error('Failed to fetch users');
      }

      return resp;
    } catch (err) {
      console.error('Error fetching users:', err);
      return Promise.reject(err);
    }
  },

  // 승인 대기 상품 목록 조회
  getPendingProducts: async () => {
    try {
      const resp = await axiosInstance.get('/v1/admin/products/pending');

      if (resp.status !== 200) {
        throw new Error('Failed to fetch pending products');
      }

      return resp;
    } catch (err) {
      console.error('Error fetching pending products:', err);
      return Promise.reject(err);
    }
  },

  // 상품 승인 / 반려
  updateProductStatus: async (productId, status) => {
    try {
      const resp = await axiosInstance.patch(`/v1/admin/products/${productId}/status`, null, {
        params: { status },
      });

      if (resp.status !== 200) {
        throw new Error('Failed to update product status');
      }

      return resp;
    } catch (err) {
      console.error('Error updating product status:', err);
      return Promise.reject(err);
    }
  },
};
