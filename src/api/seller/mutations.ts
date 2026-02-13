import { sellerApi } from '@/api/seller';
import { SELLER_KEYS } from '@/api/seller/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productKeys } from '../product/keys';
import type { ProductRegisterRequest, ProductUpdateRequest } from './types';

export const useDeleteMyProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => sellerApi.deleteMyProduct(productId),
    onSuccess: () => {
      toast.success('상품이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: SELLER_KEYS.all });
    },
    onError: (error) => {
      console.error('Failed to delete product:', error);
      toast.error('상품 삭제에 실패했습니다.');
    },
  });
};

export const useUpdateOrderItemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderItemId, status }: { orderItemId: string; status: string }) =>
      sellerApi.updateOrderItemStatus(orderItemId, status),
    onSuccess: () => {
      toast.success('주문 상태가 변경되었습니다.');
      queryClient.invalidateQueries({ queryKey: SELLER_KEYS.all });
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
      toast.error('주문 상태 변경에 실패했습니다.');
    },
  });
};

export const useUpdateMySellerInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sellerInfo: { sellerName: string; sellerIntro: string }) =>
      sellerApi.updateSellerInfo(sellerInfo),
    onSuccess: () => {
      toast.success('판매자 정보가 변경되었습니다.');
      queryClient.invalidateQueries({ queryKey: SELLER_KEYS.all });
    },
    onError: (error) => {
      console.error('Failed to update seller info:', error);
      toast.error('판매자 정보 변경에 실패했습니다.');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      productData,
    }: {
      productId: string;
      productData: ProductUpdateRequest;
    }) => sellerApi.updateProduct(productId, productData),
    onSuccess: () => {
      toast.success('상품이 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: SELLER_KEYS.all });
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
      toast.error('상품 수정에 실패했습니다.');
    },
  });
};

export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, newStock }: { productId: string; newStock: number }) =>
      sellerApi.updateProductStock(productId, newStock),
    onSuccess: () => {
      toast.success('재고가 성공적으로 업데이트되었습니다.');
      queryClient.invalidateQueries({ queryKey: SELLER_KEYS.all });
    },
    onError: (error) => {
      console.error('Failed to update product stock:', error);
      toast.error('재고 업데이트에 실패했습니다.');
    },
  });
};

export const useRegisterProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductRegisterRequest) => sellerApi.registerProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
      toast.success('상품이 성공적으로 등록 신청되었습니다!');
    },
    onError: (error) => {
      console.error('Register product error:', error);
      toast.error('상품 등록 신청에 실패했습니다.');
    },
  });
};
