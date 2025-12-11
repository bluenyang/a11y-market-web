// src/routes/products/$productId.jsx
import { cartApi } from '@/api/cart-api';
import { productApi } from '@/api/product-api';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { LoadingEmpty } from '@/components/main/loading-empty';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { Item } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { MinusIcon, PlusIcon, RotateCcw, Shield, ShoppingCart, Store, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function ProductDetailPage() {
  const { productId } = Route.useParams(); // 실제 연동 시 사용 예정

  // 기본 탭은 상세정보로
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(1); // 수량 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getProductDetails(productId);
        setProductData(response.data);
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

  const handleBuyNow = async () => {
    // 결제 페이지로 이동
    navigate({
      to: '/order/checkout',
      search: (old) => ({
        ...old,
        type: 'DIRECT',
        productId: productId,
        quantity: quantity.toString(),
      }),
    });
  };

  const handleAddToCart = async () => {
    try {
      setIsSubmitting(true);
      const { status } = await cartApi.addCartItem(productId, quantity);

      if (status !== 204) {
        throw new Error('Failed to add item to cart');
      }

      toast.success('장바구니에 상품이 추가되었습니다.');
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      toast.error('장바구니에 상품을 추가하는 데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
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
              </div>

              <div className='mb-6 flex flex-row items-center justify-between'>
                <ButtonGroup>
                  <Button
                    variant='outline'
                    className='w-8'
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label='수량 감소'
                  >
                    <MinusIcon className='size-4' />
                  </Button>
                  <Input
                    className='bg-card text-card-foreground w-16 p-0 text-center'
                    value={quantity}
                    onChange={(e) => {
                      const value = Math.max(1, Number(e.target.value));
                      setQuantity(isNaN(value) ? 1 : value);
                    }}
                    aria-label='수량 선택'
                  />
                  <Button
                    variant='outline'
                    className='w-8'
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label='수량 증가'
                  >
                    <PlusIcon className='size-4' />
                  </Button>
                </ButtonGroup>
                <span className='text-lg'>
                  {(quantity * productData.productPrice)?.toLocaleString('ko-KR')}원
                </span>
              </div>

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
                  className='flex flex-1'
                  disabled={isSubmitting}
                  aria-label='바로 구매'
                >
                  바로 구매
                  {isSubmitting ? <Spinner className='ml-2 size-5' /> : null}
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
              <h3 className='mb-4 text-xl font-bold'>상품 상세 정보</h3>
              <div className='prose max-w-none'>
                <p>{productData.productDescription}</p>
                {productData.summaryText && (
                  // 상품 요약 정보가 있으면, 상품 요약 정보, 사용처, 사용방법을 Item 컴포넌트로 감싸기
                  <Item
                    variant='outline'
                    className='my-8 flex-col items-start'
                    tabIndex={0}
                    role='region'
                    aria-label='상품 요약 정보'
                  >
                    {/* 전체를 감싸는 설명 목록 (dl) */}
                    <dl className='w-full space-y-4'>
                      <div className='space-y-1'>
                        <dt className='text-lg font-semibold'>상품 요약 설명: </dt>
                        <dd className='text-muted-foreground'>{productData.summaryText}</dd>
                      </div>

                      <div className='space-y-1'>
                        <dt className='text-lg font-semibold'>사용처: </dt>
                        <dd className='text-muted-foreground'>{productData.usageContext}</dd>
                      </div>

                      <div className='space-y-1'>
                        <dt className='text-lg font-semibold'>사용방법: </dt>
                        <dd className='text-muted-foreground'>{productData.usageMethod}</dd>
                      </div>
                    </dl>
                  </Item>
                )}
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
