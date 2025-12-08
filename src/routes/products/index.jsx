import { productApi } from '@/api/product-api';
import { LoadingEmpty } from '@/components/main/loading-empty';
import { ProductCard } from '@/components/main/product-card';
import { ProductFilter } from '@/components/product/product-filter';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/products/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    searchQuery: typeof search.searchQuery === 'string' ? search.searchQuery : '',
    categoryId: typeof search.categoryId === 'string' ? search.categoryId : '',
    isA11yGuaranteed: search.isA11yGuaranteed === 'true',
    sellerGrade: typeof search.sellerGrade === 'string' ? search.sellerGrade : '',
  }),
});

const sortOptions = [
  { value: 'on-development', label: '개발 중' },
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '신상품순' },
  { value: 'price-asc', label: '낮은 가격순' },
  { value: 'price-desc', label: '높은 가격순' },
];

function RouteComponent() {
  const { searchQuery, categoryId, isA11yGuaranteed, sellerGrade } = Route.useSearch();

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: searchQuery,
    categories: [...categoryId],
    isA11yGuaranteed: isA11yGuaranteed,
    sellerGrade: sellerGrade,
    priceRange: [0, 1000000],
  });
  const [sortBy, setSortBy] = useState('on-development');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const resp = await productApi.getProducts({
          search: searchQuery,
          categoryId: categoryId,
          certified: isA11yGuaranteed,
          grade: sellerGrade,
        });
        if (resp.status === 200) {
          setProducts(resp.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('상품을 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [searchQuery, categoryId, isA11yGuaranteed, sellerGrade]);

  const filteredProducts = products.filter((product) => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (
        !product.productName?.toLowerCase()?.includes(query) &&
        !product.productDescription?.toLowerCase()?.includes(query)
      ) {
        return false;
      }
    }
    if (filters.categories.length > 0 && !filters.categories.includes(product.categoryId)) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
      default:
        return b.salesCount - a.salesCount;
    }
  });

  return (
    <main className='flex-1 bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <h1 className='mb-2 text-3xl'>전체 상품</h1>
          <p className='text-gray-600'>총 {sortedProducts.length}개의 상품</p>
        </div>

        <div className='lg:grid lg:grid-cols-[280px_1fr] lg:gap-6'>
          <aside className='mb-6 lg:mb-0'>
            <ProductFilter onFilterChange={setFilters} />
          </aside>

          {/* 우측: 정렬 및 상품 그리드 */}
          <div>
            {/* 정렬 드롭다운 */}
            <div className='mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm'>
              <span className='text-sm text-gray-600'>{sortedProducts.length}개 상품</span>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
                disabled
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='정렬 기준' />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 상품 그리드 */}
            {isLoading ? (
              <LoadingEmpty />
            ) : sortedProducts.length > 0 ? (
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              /* 상품이 없을 때 */
              <div className='rounded-lg bg-white p-16 text-center shadow-sm'>
                <p className='mb-4 text-gray-500'>검색 조건에 맞는 상품이 없습니다.</p>
                <Button
                  variant='outline'
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      categories: [],
                      priceRange: [0, maxPrice],
                      minRating: 0,
                    })
                  }
                >
                  필터 초기화
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
