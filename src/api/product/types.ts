export interface ProductImage {
  imageId: string;
  imageUrl: string;
  altText: string;
  imageSequence: number;
}

export interface ProductImageMetadata {
  originalFileName: string;
  altText: string;
  sequence: number;
  isNew: boolean;
  imageId?: string;
}

export interface ProductImageWithFile extends ProductImageMetadata {
  previewUrl?: string;
  file: File;
}

export interface SimpleProductInfo {
  productId: string;
  productName: string;
  productPrice: number;
  productImageUrl: string;
  sellerId: string;
  sellerName: string;
  isA11yGuarantee: boolean;
  createdAt: string;
  salesCount: number;
}

export const EProductStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAUSED: 'PAUSED',
  DELETED: 'DELETED',
  SOLD_OUT: 'SOLD_OUT',
} as const;

export type ProductStatus = keyof typeof EProductStatus;

export interface Product extends SimpleProductInfo {
  productDescription: string;
  productImages: ProductImage[];
  parentCategoryId: string;
  categoryId: string;
  categoryName: string;
  productStatus: ProductStatus;
  productStock: number;
  summaryText?: string;
  usageContext?: string;
  usageMethod?: string;
  approvedDate?: string;
}

export interface ProductSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  category?: string;
  keyword?: string;
}

export interface ProductResponse {
  content: SimpleProductInfo[];
  totalPages: number;
  totalElements: number;
  size: number;
}
