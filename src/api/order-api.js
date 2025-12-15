import axiosInstance from '@/api/axios-instance';

export const orderApi = {
  // 내 주문 목록 조회
  getMyOrders: async () => {
    try {
      const resp = await axiosInstance.get('/v1/users/me/orders');

      if (resp.status !== 200) {
        throw new Error('Failed to fetch my orders');
      }

      return resp;
    } catch (err) {
      console.error('Failed to fetch my orders:', err);
      return Promise.reject(err);
    }
  },

  // 주문 상세 조회
  getMyOrderDetail: async (orderItemId) => {
    try {
      const resp = await axiosInstance.get(`/v1/users/me/orders/${orderItemId}`);

      if (resp.status !== 200) {
        throw new Error(`Failed to fetch order detail for orderItemId ${orderItemId}`);
      }

      return resp;
    } catch (err) {
      console.error(`Failed to fetch order detail for orderItemId ${orderItemId}:`, err);
      return Promise.reject(err);
    }
  },

  // 주문 취소 요청
  cancelOrder: async (orderId, data) => {
    try {
      const resp = await axiosInstance.post(`/v1/users/me/orders/cancel-request`, data);

      if (resp.status !== 204) {
        throw new Error(`Failed to cancel order with orderId ${orderId}`);
      }

      return resp;
    } catch (err) {
      console.error(`Failed to cancel order with orderId ${orderId}:`, err);
      return Promise.reject(err);
    }
  },

  //결제 전 주문 정보 조회
  /**
   * @deprecated Use getCheckoutInfoV2 instead
   * @returns 405 METHOD NOT ALLOWED
   */
  getCheckoutInfo: async () => await axiosInstance.post('/v1/orders/pre-check'),

  getCheckoutInfoV2: async (cartItemIds, directOrderItem) =>
    await axiosInstance.post('/v2/orders/pre-check', {
      cartItemIds: cartItemIds,
      directOrderItem: directOrderItem,
    }),

  // 주문 생성
  createOrder: async (data) => await axiosInstance.post('/v1/orders', data),

  verifyPayment: async (data) => await axiosInstance.post(`/v1/payments/verify`, data),

  confirmOrderItem: async (data) =>
    await axiosInstance.post(`/v1/users/me/orders/items/confirm`, data),
};
