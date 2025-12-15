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
import { useSelector } from 'react-redux';
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
  { value: 'on-development', label: '정렬 기능 개발 중' },
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '신상품순' },
  { value: 'price-asc', label: '낮은 가격순' },
  { value: 'price-desc', label: '높은 가격순' },
];

function RouteComponent() {
  // URL 검색 매개변수
  const { searchQuery, categoryId, isA11yGuaranteed, sellerGrade } = Route.useSearch();
  const { categories: allCategories } = useSelector((state) => state.category);

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: searchQuery || '',
    categories: categoryId ? [categoryId] : [],
    isA11yGuaranteed: isA11yGuaranteed || false,
    sellerGrade: sellerGrade || '',
  });
  const [sortBy, setSortBy] = useState('on-development');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let targetCategories = [];

    if (categoryId) {
      const parentCategory = allCategories.find((cat) => cat.categoryId === categoryId);

      if (parentCategory) {
        const subCategoryIds =
          parentCategory.subCategories?.map((subCat) => subCat.categoryId) || [];
        targetCategories = [categoryId, ...subCategoryIds];
      } else {
        targetCategories = [categoryId];
      }
    }

    setFilters({
      searchQuery: searchQuery || '',
      categories: targetCategories,
      isA11yGuaranteed: isA11yGuaranteed || false,
      sellerGrade: sellerGrade || '',
    });
  }, [searchQuery, categoryId, isA11yGuaranteed, sellerGrade]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const resp = await productApi.getProducts({
          search: filters.searchQuery,
          categoryId: filters.categories,
          certified: filters.isA11yGuaranteed,
          grade: filters.sellerGrade,
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
  }, [filters]);

  // 클라이언트 사이드 필터링 제거
  // 서버 사이드에서 필터링된 데이터를 받아오기 때문에 불필요
  const filteredProducts = products;

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
    <main className='flex-1'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <h1 className='mb-2 text-3xl'>전체 상품</h1>
          <p>총 {sortedProducts.length}개의 상품</p>
        </div>

        <div className='lg:grid lg:grid-cols-[280px_1fr] lg:gap-6'>
          <aside className='mb-6 lg:mb-0'>
            {/* setFilters가 호출되면 필터가 변경되어 useEffect가 실행되고, 서버에서 필터링된 데이터를 받아옴 */}
            <ProductFilter
              filters={filters}
              setFilters={setFilters}
            />
          </aside>

          {/* 우측: 정렬 및 상품 그리드 */}
          <div>
            {isLoading ? (
              <LoadingEmpty />
            ) : (
              <>
                {/* 정렬 드롭다운 */}
                <div className='mb-6 flex items-center justify-between rounded-lg p-4 shadow-sm'>
                  <span className='text-sm'>{sortedProducts.length}개 상품</span>
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
                {sortedProducts.length > 0 ? (
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
                    {sortedProducts.map((product) => (
                      <ProductCard
                        key={product.productId}
                        product={product}
                      />
                    ))}
                  </div>
                ) : (
                  /* 상품이 없을 때 */
                  <div className='rounded-lg p-16 text-center shadow-sm'>
                    <p className='mb-4'>검색 조건에 맞는 상품이 없습니다.</p>
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
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
