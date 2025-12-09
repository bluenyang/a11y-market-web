import axiosInstance from '@/api/axios-instance';

export const adminApi = {
  getUsers: async () => await axiosInstance.get('/v1/admin/users'),

  // 승인 대기 상품 목록 조회
  getPendingProducts: async () => await axiosInstance.get('/v1/admin/products/pending'),

  // 상품 승인 / 반려
  updateProductStatus: async (productId, status) =>
    await axiosInstance.patch(`/v1/admin/products/${productId}/status`, null, {
      params: { status },
    }),
};
