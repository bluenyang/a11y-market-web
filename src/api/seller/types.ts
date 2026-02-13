import type { OrderItem } from '@/api/order/types';
import type { Product, ProductImageMetadata, ProductStatus } from '../product/types';

export const ESellerSubmitStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const ESellerGrade = {
  NEWER: 'NEWER',
  REGULAR: 'REGULAR',
  TRUSTED: 'TRUSTED',
} as const;

export type SellerSubmitStatus = keyof typeof ESellerSubmitStatus;
export type SellerGrade = keyof typeof ESellerGrade;

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalReviews: number;
  sellerName: string;
  sellerId: string;
  sellerIntro: string;
  refundRate: number;
  confirmedRate: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface ReceivedOrder extends OrderItem {
  orderId: string; // Added to fix lint
  buyerName: string;
  buyerPhone: string;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  orderedAt: string;
}

export interface ReceivedOrdersResponse {
  orderItems: ReceivedOrder[];
  totalOrderCount: number;
}

export interface OrderSummary {
  newOrders: number;
  acceptedOrders: number;
  shippingOrders: number;
  completedOrders: number;
  claimedOrders: number;
}

export interface Seller {
  sellerId: string;
  sellerName: string;
  businessNumber: string;
  storeIntro: string;
  contactEmail: string;
  contactPhone: string;
  sellerGrade: 'NEWER' | 'REGULAR' | 'TRUSTED';
  isA11yGuarantee: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerDetail extends Seller {
  profileStatus: string;
  submitDate: string;
  approvedDate: string;
  lastUpdatedDate: string;
  orders: OrderItem[];
  products: Product[];
}

export interface ProductRegisterRequest {
  request: {
    productName: string;
    productDescription: string;
    categoryId: string;
    productPrice: number;
    productStock: number;
    imageMetadataList: ProductImageMetadata[];
  };
  images: File[];
}

export interface ProductUpdateRequest {
  request: {
    productName: string;
    productDescription: string;
    categoryId: string;
    productPrice: number;
    productStock: number;
    productStatus: ProductStatus;
    imageMetadataList: ProductImageMetadata[];
  };
  images: File[];
}
