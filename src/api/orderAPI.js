// src/api/orderAPI.js

import axiosInstance from './axiosInstance';

//결제 전 주문 정보 조회
export async function getCheckoutInfo(orderItemIds) {
  const response = await axiosInstance.post('/api/v1/orders/pre-check', {
    checkoutItemIds: orderItemIds,
  });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('결제 정보 조회 실패');
}

// 주문 생성
export async function createOrder(addressId, orderItemIds) {
  const response = await axiosInstance.post('/api/v1/orders', {
    addressId,
    orderItemIds,
  });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('주문 생성 실패');
}
