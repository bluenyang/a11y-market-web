// src/routes/products/$productId.jsx
import { productApi } from '@/api/product-api';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { LoadingEmpty } from '@/components/main/loading-empty';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { RotateCcw, Shield, ShoppingCart, Store, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

// 임시 상품 데이터 (백엔드 연동 전까지 UI 확인용)
const productData = {
  id: 1,
  name: '상품명',
  price: 0,
  sellerName: '판매자명',
  sellerGrade: '우수',
  a11yGuarantee: true,
  shippingInfo: ['배송정보', '무료배송'],
  summary: '상품정보 요약',
  options: [
    { id: 'opt1', label: '옵션1', values: ['옵션 1-1', '옵션 1-2'] },
    { id: 'opt2', label: '옵션2', values: ['옵션 2-1', '옵션 2-2'] },
  ],
};

function ProductDetailPage() {
  const { productId } = Route.useParams(); // 실제 연동 시 사용 예정

  // 기본 탭은 상세정보로
  const [productData, setProductData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1); // 수량 상태
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getProductDetails(productId);
        setProductData(response.data);
        console.log('Fetched productData details:', response.data);
      } catch (error) {
        console.error('Failed to fetch productData details:', error);
        navigate({
          to: '/not-found',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleBuyNow = () => {
    // TODO: 바로구매 로직
    console.log('Buy Now', {
      productId,
      selectedOptions,
      quantity,
    });
  };

  const handleAddToCart = () => {
    // TODO: 장바구니 담기 로직
    console.log('Add to Cart', {
      productId,
      selectedOptions,
      quantity,
    });
  };

  if (isLoading || !productData) {
    return <LoadingEmpty />;
  }

  return (
    <main
      className='mx-auto max-w-5xl px-4'
      aria-label='상품 상세 정보 페이지'
    >
      <article className='container mx-auto px-4 py-8'>
        <div className='rounded-lg bg-neutral-50 p-6 shadow-sm md:p-8 dark:bg-neutral-900'>
          <section className='grid gap-8 md:grid-cols-2'>
            {/* 상품 이미지 */}
            <div>
              <div className='aspect-square overflow-hidden rounded-lg bg-neutral-100'>
                <ImageWithFallback
                  src={productData.productImages[0]?.imageUrl}
                  alt={`${productData.productName} 대표 이미지`}
                  className='size-full object-cover'
                />
              </div>
            </div>

            {/* 상품 정보 */}
            <div>
              <Badge className='mb-2'>{productData.categoryName}</Badge>

              {/* 판매자 이름 - 상품명 상단 */}
              <div className='mb-2 flex items-center gap-2'>
                <Store
                  className='size-4 text-neutral-600 dark:text-neutral-300'
                  aria-hidden='true'
                />
                <Link
                  to={`/seller/${productData.sellerId}`}
                  className='text-neutral-700 transition-colors hover:text-blue-600 hover:underline dark:text-neutral-200 dark:hover:text-blue-400'
                >
                  {productData.sellerName}
                </Link>
                {productData.isA11yGuarantee && (
                  <Badge
                    variant='secondary'
                    className='bg-green-500 px-2 py-1 text-white dark:bg-green-600'
                  >
                    <Shield
                      className='size-4'
                      aria-hidden='true'
                    />
                    접근성 보장
                  </Badge>
                )}
              </div>

              <h1 className='mb-4 text-3xl'>{productData.productName}</h1>
              <div className='mb-4 border-t border-b py-4'>
                <div className='mb-2 text-3xl'>
                  {productData.productPrice?.toLocaleString('ko-KR')}원
                </div>
                <p className='text-sm'>재고: {productData.stock}개</p>
              </div>

              <p className='mb-6 leading-relaxed'>{productData.productDescription}</p>

              {/* 구매 버튼 */}
              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  size='lg'
                  onClick={handleAddToCart}
                  className='flex-1 gap-2'
                  aria-label='장바구니에 추가'
                >
                  <ShoppingCart
                    className='size-5'
                    aria-hidden='true'
                  />
                  장바구니
                </Button>
                <Button
                  size='lg'
                  onClick={handleBuyNow}
                  className='flex-1'
                >
                  바로 구매
                </Button>
              </div>

              {/* 배송/교환 정보 */}
              <div className='mt-6 space-y-3 text-sm'>
                <div className='flex items-center gap-2'>
                  <Truck
                    className='size-5'
                    aria-hidden='true'
                  />
                  <span>무료배송 (3만원 이상 구매 시)</span>
                </div>
                <div className='flex items-center gap-2'>
                  <RotateCcw
                    className='size-5'
                    aria-hidden='true'
                  />
                  <span>7일 이내 무료 반품</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Shield
                    className='size-5'
                    aria-hidden='true'
                  />
                  <span>구매 안전 보호</span>
                </div>
              </div>
            </div>
          </section>

          {/* 상세 정보 탭 */}
          <Tabs
            defaultValue='details'
            className='mt-8'
          >
            <TabsList className='w-full max-w-full rounded-full p-1'>
              <TabsTrigger
                value='details'
                className='rounded-full'
              >
                상세 정보
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value='details'
              className='py-6'
            >
              <h3 className='mb-4 text-xl'>상품 상세 정보</h3>
              <div className='prose max-w-none'>
                <p>{productData.productDescription}</p>
                {/* 이미지 상세 정보가 있으면 gap 없이 1번부터 세로 나열 */}
                <div className='space-y-6'>
                  {productData.productImages.slice(1)?.map((image) => (
                    <div
                      key={image.imageSequence}
                      className='overflow-hidden rounded-lg bg-neutral-100'
                    >
                      <ImageWithFallback
                        src={image.imageUrl}
                        alt={image.altText || `${productData.productName} 상세 이미지`}
                        className='w-full'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </article>
    </main>
  );
}

// TanStack Router – /products/:productId 경로
export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailPage,
});
