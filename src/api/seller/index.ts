import axiosInstance from '@/api/axios-instance';
import type { Product } from '@/api/product/types';
import type {
  DailyRevenue,
  DashboardStats,
  OrderSummary,
  ProductRegisterRequest,
  ProductUpdateRequest,
  ReceivedOrdersResponse,
} from './types';

export const sellerApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await axiosInstance.get<DashboardStats>('/v1/seller/dashboard/stats');
    return data;
  },

  updateSellerInfo: async (data: { sellerName: string; sellerIntro: string }): Promise<void> => {
    await axiosInstance.patch('/v1/seller/info', data);
  },

  getDailyRevenue: async (year: number, month: number): Promise<DailyRevenue[]> => {
    const { data } = await axiosInstance.get<DailyRevenue[]>('/v1/seller/dashboard/revenue/daily', {
      params: { year, month },
    });
    return data;
  },

  getTopSellingProducts: async (): Promise<Product[]> => {
    const { data } = await axiosInstance.get<Product[]>('/v1/seller/dashboard/products/top');
    return data;
  },

  getRecentOrders: async (): Promise<any[]> => {
    const { data } = await axiosInstance.get('/v1/seller/dashboard/orders/recent');
    return data;
  },

  getMyProducts: async (page = 0, size = 10): Promise<Product[]> => {
    const { data } = await axiosInstance.get<Product[]>('/v1/seller/products', {
      params: { page, size },
    });
    return data;
  },

  deleteMyProduct: async (productId: string): Promise<void> => {
    await axiosInstance.delete(`/v1/seller/products/${productId}`);
  },

  updateProductStock: async (productId: string, stock: number): Promise<void> => {
    await axiosInstance.patch(`/v1/seller/products/${productId}/stock`, {
      stock,
    });
  },

  getReceivedOrders: async (
    page = 0,
    size = 10,
    status: string | null = null,
  ): Promise<ReceivedOrdersResponse> => {
    const { data } = await axiosInstance.get<ReceivedOrdersResponse>('/v1/seller/orders', {
      params: { page, size, status },
    });
    return data;
  },

  getOrderSummary: async (): Promise<OrderSummary> => {
    const { data } = await axiosInstance.get<OrderSummary>('/v1/seller/orders/summary');
    return data;
  },

  updateOrderItemStatus: async (orderItemId: string, status: string): Promise<void> => {
    await axiosInstance.patch(`/v1/seller/orders/${orderItemId}/status`, { status });
  },

  registerProduct: async (productData: ProductRegisterRequest): Promise<{ status: number }> => {
    const { status } = await axiosInstance.post(
      '/v1/seller/products',
      {
        request: productData.request,
        images: productData.images,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return { status };
  },

  updateProduct: async (
    productId: string,
    productData: ProductUpdateRequest,
  ): Promise<{ status: number }> => {
    const { status } = await axiosInstance.put(
      `/v1/seller/products/${productId}`,
      {
        request: productData.request,
        images: productData.images,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return { status };
  },
};
