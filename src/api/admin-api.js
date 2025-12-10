import axiosInstance from '@/api/axios-instance';
import { toast } from 'sonner';

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

  getDashboardStats: async () => {
    try {
      const resp = await axiosInstance.get('/v1/admin/dashboard/stats');

      if (resp.status !== 200) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return resp.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('대시보드 통계 정보를 불러오는 데 실패했습니다.');
      return {};
    }
  },

  // 회원 권한 변경
  updateUserRole: ({ userId, role }) =>
    axiosInstance.patch(`/v1/admin/users/${userId}/permission`, null, {
      params: { role },
    }),

  // 회원 목록 조회
  getUsers: async () => {
    try {
      const resp = await axiosInstance.get('/v1/admin/users');
      return resp;
    } catch (err) {
      console.error('Failed to fetch users info:', err);
      return Promise.reject(err);
    }
  },

  // 회원 권한 변경
  updateUserRole: async ({ userId, role }) => {
    try {
      const resp = await axiosInstance.patch(`/v1/admin/users/${userId}/permission`, null, {
        params: { role },
      });

      if (resp.status !== 200) {
        throw new Error('Failed to update user role');
      }

      return resp;
    } catch (err) {
      console.error('Failed to update user role:', err);
      return Promise.reject(err);
    }
  },
  getPendingSellers: async () => await axiosInstance.get('/v1/admin/sellers/pending'),

  updateSellerStatus: async (sellerId, status) =>
    await axiosInstance.patch(`/v1/admin/sellers/${sellerId}/status`, null, { params: { status } }),
};
