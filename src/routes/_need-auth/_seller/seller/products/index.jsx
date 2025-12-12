import { sellerApi } from '@/api/seller-api';
import { LoadingEmpty } from '@/components/main/loading-empty';
import { UpdateStock } from '@/components/seller/products/update-stock';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

/** /seller/products : 판매자의 "내 상품 목록" 페이지 */
export const Route = createFileRoute('/_need-auth/_seller/seller/products/')({
  component: SellerProductListPage,
});

function SellerProductListPage() {
  // hooks
  const { isLoading } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const resp = await sellerApi.getMyProducts(0, 10);

        setProducts(resp.data);
      } catch (err) {
        toast.error('내 상품 목록을 불러오는 중에 오류가 발생했습니다.');
      }
    })();
  }, []);

  // variables
  const totalCount = products.length;
  const activeCount = products.filter((product) => product.productStatus === 'APPROVED').length;
  const pendingCount = products.filter((product) => product.productStatus === 'PENDING').length;
  const deletedCount = products.filter((product) => product.productStatus === 'DELETED').length;
  const pausedCount = products.filter((product) => product.productStatus === 'PAUSED').length;
  const soldOutCount = products.filter((product) => product.productStock === 0).length;
  const badgeColorMap = {
    APPROVED: 'bg-blue-500',
    PENDING: 'bg-orange-500',
    PAUSED: 'bg-violet-500',
    DELETED: 'bg-red-500',
  };

  // handler functions
  const handleProductDelete = async (productId) => {
    try {
      await sellerApi.deleteMyProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId),
      );
      toast.success('상품이 성공적으로 삭제되었습니다.');
    } catch (err) {
      toast.error('상품 삭제 중에 오류가 발생했습니다.');
    }
  };

  // sub-components
  /** 상품 한 줄(row) 표시용 컴포넌트 */
  function sellerProductRow({ product, key }) {
    const formattedPrice = product.productPrice.toLocaleString('ko-KR');

    const statusLabelMap = {
      APPROVED: '판매 중',
      PENDING: '승인 대기',
      PAUSED: '판매 중지',
      DELETED: '삭제됨',
    };

    const status = product.productStatus || 'APPROVED';
    const statusLabel = statusLabelMap[status] || status;
    const isSoldOut = status === 'SOLD_OUT' || product.productStock === 0;

    return (
      <div
        key={key}
        className='grid grid-cols-12 items-center px-4 py-3 text-sm'
      >
        <div
          className='col-span-4 truncate'
          tabIndex={0}
          aria-label={`상품명: ${product.productName}`}
        >
          <div className='font-medium'>{product.productName}</div>

          {product.categoryName && (
            <div className='text-muted-foreground text-xs'>{product.categoryName}</div>
          )}

          {product.approvedAt && (
            <div className='text-muted-foreground text-xs'>
              {`등록일: ${product.approvedAt.split('T')[0]}`}
            </div>
          )}
        </div>

        <div
          className='col-span-2 text-center tabular-nums'
          aria-label={`판매가: ${formattedPrice}원`}
          tabIndex={0}
        >
          {formattedPrice}원
        </div>

        <div
          className='col-span-2 flex flex-col text-center tabular-nums'
          aria-label={`재고 수: ${product.productStock} 개`}
          tabIndex={0}
        >
          {`${product.productStock} 개`}
          <UpdateStock
            productId={product.productId}
            currentStock={product.productStock}
            variant='outline'
            className='ml-2 px-2 py-1 text-xs'
            onStockUpdate={(id, newStock) => {
              setProducts((prevProducts) =>
                prevProducts.map((p) =>
                  p.productId === id ? { ...p, productStock: newStock } : p,
                ),
              );
            }}
          />
        </div>

        <div
          className='col-span-2 text-center'
          aria-label={`상태: ${isSoldOut ? '품절' : statusLabel}`}
          tabIndex={0}
        >
          <Badge
            variant='secondary'
            className={`${isSoldOut ? 'bg-neutral-500' : badgeColorMap[status]} px-2 py-1 text-xs text-white`}
          >
            {statusLabel}
          </Badge>
        </div>

        <div className='col-span-2 flex justify-center gap-2'>
          <Button
            asChild
            variant='outline'
            size='sm'
          >
            <Link
              to='/seller/products/$productId/edit'
              params={{ productId: product.productId }}
            >
              수정
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='bg-red-50 text-red-600 hover:bg-red-700 hover:text-white'
              >
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>상품 삭제</AlertDialogTitle>
                <AlertDialogDescription className='text-black'>
                  <span>정말로 해당 상품을 삭제하시겠습니까?</span>
                </AlertDialogDescription>
                <Separator />
                <div>
                  <span className='font-medium'>상품 정보</span>
                  <div className='mt-2 space-y-1 text-sm'>
                    <div className='flex'>
                      <dt className='w-20 font-medium'>상품명</dt>
                      <dd>{product.productName}</dd>
                    </div>
                    <div className='flex'>
                      <dt className='w-20 font-medium'>판매가</dt>
                      <dd>{formattedPrice}원</dd>
                    </div>
                    <div className='flex'>
                      <dt className='w-20 font-medium'>재고</dt>
                      <dd>{product.productStock} 개</dd>
                    </div>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    className='bg-red-50 text-red-600 hover:bg-red-700 hover:text-white'
                    onClick={() => handleProductDelete(product.productId)}
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  // main render
  if (isLoading) {
    return (
      <main className='mx-auto max-w-5xl px-4 py-8'>
        <LoadingEmpty />
      </main>
    );
  }

  return (
    <main className='font-kakao-big mx-auto max-w-5xl px-4 py-8'>
      <section className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>내 상품 목록</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            현재 판매 중인 상품을 확인하고 관리할 수 있습니다.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <Button
            variant='outline'
            className='hover:bg-blue-100 dark:hover:bg-blue-900'
            onClick={() => navigate({ to: '/seller/dashboard' })}
          >
            대시보드로 이동
          </Button>
          <Button
            variant='outline'
            className='hover:bg-green-100 dark:hover:bg-green-900'
            onClick={() => navigate({ to: '/seller/products/new' })}
          >
            상품 등록하기
          </Button>
        </div>
      </section>

      <section className='mb-6 grid gap-4 sm:grid-cols-3'>
        <Card
          tabIndex={0}
          aria-label={`등록된 상품 수: ${totalCount}개`}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium'>
              등록된 상품 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalCount}개</div>
          </CardContent>
        </Card>

        <Card
          className='bg-blue-100 dark:bg-blue-900'
          tabIndex={0}
          aria-label={`판매 중인 상품 수: ${activeCount}개`}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium'>판매 중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeCount}개</div>
          </CardContent>
        </Card>

        <Card
          className='bg-neutral-200 dark:bg-neutral-700'
          tabIndex={0}
          aria-label={`품절된 상품 수: ${soldOutCount}개`}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium'>품절</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{soldOutCount}개</div>
          </CardContent>
        </Card>

        <Card
          className='bg-violet-100 dark:bg-violet-900'
          tabIndex={0}
          aria-label={`판매 중단된 상품 수: ${pausedCount}개`}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium'>판매 중단</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pausedCount}개</div>
          </CardContent>
        </Card>

        <Card
          className='bg-orange-100 dark:bg-orange-900'
          tabIndex={0}
          aria-label={`승인 대기 중인 상품 수: ${pendingCount}개`}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium'>승인대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pendingCount}개</div>
          </CardContent>
        </Card>

        <Card
          className='bg-red-100 dark:bg-red-900'
          tabIndex={0}
          aria-label={`삭제된 상품 수: ${deletedCount}개`}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium'>삭제됨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{deletedCount}개</div>
          </CardContent>
        </Card>
      </section>

      <section className='bg-card rounded-xl border'>
        <div className='text-muted-foreground grid grid-cols-12 border-b px-4 py-3 text-xs font-medium'>
          <div className='col-span-4'>상품명</div>
          <div className='col-span-2 text-center'>판매가</div>
          <div className='col-span-2 text-center'>재고</div>
          <div className='col-span-2 text-center'>상태</div>
          <div className='col-span-2 text-center'>관리</div>
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
          <div className='divide-y'>
            {products.map((product, index) => sellerProductRow({ product, key: index }))}
          </div>
        )}
      </section>
    </main>
  );
}
