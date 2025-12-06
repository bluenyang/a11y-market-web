import axiosInstance from '@/api/axios-instance';

export const orderApi = {
  // 내 주문 목록 조회
  getMyOrders: async () => await axiosInstance.get('/v1/users/me/orders'),

  // 주문 상세 조회
  getMyOrderDetail: async (orderId) => await axiosInstance.get(`/v1/users/me/orders/${orderId}`),

  // 주문 취소 요청
  cancelOrder: async (orderId, data) =>
    await axiosInstance.post(`/v1/users/me/orders/${orderId}/cancel-request`, data),

  //결제 전 주문 정보 조회
  getCheckoutInfo: async (orderItemIds, orderAllItems = false) =>
    await axiosInstance.post('/v1/orders/pre-check', {
      checkoutItemIds: orderItemIds,
      orderAllItems,
    }),
  // 주문 생성
  createOrder: async (addressId, orderItemIds) =>
    await axiosInstance.post('/v1/orders', {
      addressId,
      orderItemIds,
    }),
};
