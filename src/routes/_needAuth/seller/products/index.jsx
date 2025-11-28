import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute, Link } from '@tanstack/react-router';

/** /seller/products : 판매자의 "내 상품 목록" 페이지 */
export const Route = createFileRoute('/_needAuth/seller/products/')({
  component: SellerProductListPage,
});

/** API 연동 전까지 사용할 목 데이터 */
const MOCK_PRODUCTS = [
  {
    id: 'P-001',
    name: '저염 갓김치 500g',
    price: 8900,
    stock: 32,
    status: 'ACTIVE',
    categoryName: '저염 장아찌/김치',
    createdAt: '2025-11-20',
  },
  {
    id: 'P-002',
    name: '무설탕 검은콩 두유 세트',
    price: 12900,
    stock: 12,
    status: 'ACTIVE',
    categoryName: '무설탕 건강즙/음료',
    createdAt: '2025-11-21',
  },
  {
    id: 'P-003',
    name: '경량 접이식 지팡이',
    price: 15900,
    stock: 0,
    status: 'SOLD_OUT',
    categoryName: '보조기구',
    createdAt: '2025-11-22',
  },
];

function SellerProductListPage() {
  const products = MOCK_PRODUCTS;

  const totalCount = products.length;
  const activeCount = products.filter((p) => p.status === 'ACTIVE').length;

  /** 상품 한 줄(row) 표시용 컴포넌트 */
  function sellerProductRow({ product }) {
    const formattedPrice = new Intl.NumberFormat('ko-KR').format(product.price);

    const statusLabelMap = {
      ACTIVE: '판매 중',
      PENDING: '승인 대기',
      SOLD_OUT: '품절',
      DELETED: '삭제됨',
    };

    const status = product.status || 'ACTIVE';
    const statusLabel = statusLabelMap[status] || status;
    const isSoldOut = status === 'SOLD_OUT' || product.stock === 0;

    return (
      <div className='grid grid-cols-12 items-center px-4 py-3 text-sm'>
        <div className='col-span-5 truncate'>
          <div className='font-medium'>{product.name}</div>

          {product.categoryName && (
            <div className='text-muted-foreground text-xs'>{product.categoryName}</div>
          )}

          {product.createdAt && (
            <div className='text-muted-foreground text-xs'>등록일: {product.createdAt}</div>
          )}
        </div>

        <div className='col-span-2 text-right tabular-nums'>{formattedPrice}원</div>

        <div className='col-span-1 text-center tabular-nums'>{product.stock}</div>

        <div className='col-span-2 text-center'>
          {isSoldOut ? (
            <Badge variant='destructive'>품절</Badge>
          ) : (
            <Badge variant='outline'>{statusLabel}</Badge>
          )}
        </div>

        <div className='col-span-2 flex justify-end gap-2'>
          <Button
            asChild
            variant='outline'
            size='sm'
          >
            <Link
              to='/seller/products/$productId/edit'
              params={{ productId: product.id }}
            >
              수정
            </Link>
          </Button>

          <Button
            variant='outline'
            size='sm'
            disabled
          >
            삭제
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className='font-kakao-big-sans mx-auto max-w-5xl px-4 py-8'>
      <section className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>내 상품 목록</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            현재 판매 중인 상품을 확인하고 관리할 수 있습니다.
          </p>
        </div>

        <Button asChild>
          <Link to='/seller/products/new'>상품 등록하기</Link>
        </Button>
      </section>

      <section className='mb-6 grid gap-4 sm:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium'>
              등록된 상품 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalCount}개</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium'>판매 중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeCount}개</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium'>품절/비활성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalCount - activeCount}개</div>
          </CardContent>
        </Card>
      </section>

      <section className='bg-card rounded-xl border'>
        <div className='text-muted-foreground grid grid-cols-12 border-b px-4 py-3 text-xs font-medium'>
          <div className='col-span-5'>상품명</div>
          <div className='col-span-2 text-right'>판매가</div>
          <div className='col-span-1 text-center'>재고</div>
          <div className='col-span-2 text-center'>상태</div>
          <div className='col-span-2 text-right'>관리</div>
        </div>

        {products.length === 0 && (
          <div className='text-muted-foreground px-4 py-10 text-center text-sm'>
            아직 등록한 상품이 없습니다.{' '}
            <Link
              to='/seller/products/new'
              className='font-semibold underline'
            >
              첫 상품을 등록해보세요.
            </Link>
          </div>
        )}

        {products.length > 0 && (
          <div className='divide-y'>{products.map((product) => sellerProductRow({ product }))}</div>
        )}
      </section>
    </main>
  );
}
