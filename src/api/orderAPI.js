// src/api/orderAPI.js

import { HttpStatusCode } from 'axios';
import axiosInstance from './axiosInstance';

//결제 전 주문 정보 조회
export async function getCheckoutInfo(orderItemIds, orderAllItems = false) {
  const response = await axiosInstance.post('/v1/orders/pre-check', {
    checkoutItemIds: orderItemIds,
    orderAllItems,
  });

  if (response.status === 200) {
    return response.data;
  } else {
    return {
      status: response.data.status || 'ERROR',
      message: response.data.message || '주문 정보 조회 실패',
    };
  }
}

// 주문 생성
export async function createOrder(addressId, orderItemIds) {
  const response = await axiosInstance.post('/v1/orders', {
    addressId,
    orderItemIds,
  });

  if (response.status === HttpStatusCode.Created) {
    return response.data;
  } else {
    return {
      status: response.data.status || 'ERROR',
      message: response.data.message || '주문 정보 조회 실패',
    };
  }
}
