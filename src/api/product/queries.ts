import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { productApi } from './index';
import { productKeys } from './keys';
import type { ProductSearchParams } from './types';

import { useProductFilterStore } from '@/store/product-filter-store';

export const useGetProducts = (params?: ProductSearchParams) => {
  const filters = useProductFilterStore((state) => state.filters);
  const sortBy = useProductFilterStore((state) => state.sortBy);

  const queryParams: ProductSearchParams = params
    ? params
    : {
        keyword: filters.searchQuery || undefined,
        category: Array.isArray(filters.categories)
          ? filters.categories[0]
          : filters.categories || undefined,
        sort: sortBy !== 'on-development' ? sortBy : undefined,
      };

  return useQuery({
    queryKey: productKeys.list(queryParams),
    queryFn: () => productApi.getProducts(queryParams),
    placeholderData: keepPreviousData,
  });
};

export const useGetProductDetails = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productApi.getProductDetails(productId),
    enabled: !!productId,
  });
};
