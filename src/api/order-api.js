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
  getMyOrderDetail: async (orderId) => {
    try {
      const resp = await axiosInstance.get(`/v1/users/me/orders/${orderId}`);

      if (resp.status !== 200) {
        throw new Error(`Failed to fetch order detail for orderId ${orderId}`);
      }

      return resp;
    } catch (err) {
      console.error(`Failed to fetch order detail for orderId ${orderId}:`, err);
      return Promise.reject(err);
    }
  },

  // 주문 취소 요청
  cancelOrder: async (orderId, data) => {
    try {
      const resp = await axiosInstance.post(`/v1/users/me/orders/${orderId}/cancel-request`, data);

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
  getCheckoutInfo: async (orderItemIds, orderAllItems = false) => {
    try {
      const resp = await axiosInstance.post('/v1/orders/pre-check', {
        checkoutItemIds: orderItemIds,
        orderAllItems,
      });

      if (resp.status !== 200) {
        throw new Error('Failed to fetch checkout info');
      }

      return resp;
    } catch (err) {
      console.error('Failed to fetch checkout info:', err);
      return Promise.reject(err);
    }
  },

  getCheckoutInfoV2: async (cartItemIds, directOrderItem) => {
    try {
      const resp = await axiosInstance.post('/v2/orders/pre-check', {
        cartItemIds: cartItemIds,
        directOrderItem: directOrderItem,
      });

      if (resp.status !== 200) {
        throw new Error('Failed to fetch checkout info');
      }

      return resp;
    } catch (err) {
      console.error('Failed to fetch checkout info:', err);
      return Promise.reject(err);
    }
  },

  // 주문 생성
  createOrder: async (addressId, orderItemIds) => {
    try {
      const resp = await axiosInstance.post('/v1/orders', {
        addressId,
        orderItemIds,
      });

      if (resp.status !== 201) {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      console.error('Failed to create order:', err);
      return Promise.reject(err);
    }
  },
};
