// src/routes/_need-auth/_admin/admin/products.jsx
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { adminApi } from '@/api/admin-api';

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
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/_admin/admin/products/approval')({
  component: AdminProductPendingPage,
});

/** /admin/products/pending : 관리자 상품 등록 신청 관리 페이지 */
function AdminProductPendingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data } = await adminApi.getPendingProducts();
        setProducts(data);
      } catch (err) {
        console.error('승인 대기 상품 조회 실패:', err);
        toast.error('승인 대기 상품 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsList = [
    { label: '전체 신청', value: products.length },
    { label: '승인 대기', value: products.filter((p) => p.productStatus === 'PENDING').length },
    { label: '승인 완료', value: products.filter((p) => p.productStatus === 'APPROVED').length },
    { label: '반려 처리', value: products.filter((p) => p.productStatus === 'REJECTED').length },
  ];

  const productStatusOptions = {
    PENDING: {
      label: '승인 대기',
      variant: 'outline',
    },
    APPROVED: {
      label: '승인 완료',
      variant: 'default',
    },
    REJECTED: {
      label: '반려',
      variant: 'destructive',
    },
  };

  // 승인/반려 - 실제 API 연동 + 로컬 상태 동기화
  const handleUpdateStatus = async (productId, nextStatus) => {
    const actionLabel = nextStatus === 'APPROVED' ? '승인' : '반려';

    try {
      await adminApi.updateProductStatus(productId, nextStatus);

      // 로컬 상태도 함께 업데이트
      setProducts((prev) =>
        prev.map((p) => (p.productId === productId ? { ...p, productStatus: nextStatus } : p)),
      );

      toast.success(`상품이 성공적으로 ${actionLabel} 처리되었습니다.`);
    } catch (err) {
      console.error('상품 상태 변경 실패:', err);
      toast.error(`상품 ${actionLabel} 처리 중 오류가 발생했습니다.`);
    }
  };

  return (
    <main className='font-kakao-big mx-auto max-w-6xl px-4 py-8'>
      <section className='mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>상품 등록 신청 관리</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            판매자가 등록 요청한 상품을 검토하고 승인/반려할 수 있습니다.
          </p>
        </div>
      </section>

      {/* 상단 요약 카드 */}
      <section className='mb-8 grid gap-4 sm:grid-cols-4'>
        {statsList.map((status) => (
          <Card
            className='rounded-2xl'
            key={status.label}
          >
            <CardHeader className='pb-2'>
              <CardTitle className='text-muted-foreground text-xs'>{status.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xl font-bold'>{status.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 에러 메시지 */}
      {error && (
        <div className='border-destructive/40 bg-destructive/5 text-destructive mb-3 rounded-xl border px-4 py-3 text-sm'>
          {error}
        </div>
      )}

      {/* 목록 테이블 */}
      <section className='bg-card rounded-2xl border'>
        <div className='text-muted-foreground grid grid-cols-12 border-b px-4 py-3 text-xs font-medium'>
          <div className='col-span-4'>상품 정보</div>
          <div className='col-span-3 text-center'>판매자 정보</div>
          <div className='col-span-2 text-center'>판매가</div>
          <div className='col-span-1 text-center'>상태</div>
          <div className='col-span-2 text-center'>관리</div>
        </div>

        {loading && (
          <div className='text-muted-foreground px-4 py-10 text-center text-sm'>
            승인 대기 상품을 불러오는 중입니다...
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className='text-muted-foreground px-4 py-10 text-center text-sm'>
            현재 승인 대기 중인 상품 등록 신청이 없습니다.
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className='divide-y'>
            {products.map((product) => (
              <div className='grid grid-cols-12 items-center px-4 py-3 text-sm'>
                {/* 상품 정보 */}
                <div className='col-span-4 min-w-0'>
                  <div className='truncate font-medium'>{product.productName}</div>
                  <div className='text-muted-foreground text-xs'>{product.categoryName}</div>
                  <div className='text-muted-foreground text-[11px]'>
                    {`신청일 : ${product.submitDate ? new Date(product.submitDate).toLocaleDateString() : `정보 없음`}`}
                  </div>
                </div>

                {/* 판매자 정보 */}
                <div className='col-span-3 min-w-0'>
                  <div className='truncate text-center text-sm'>{product.sellerName}</div>
                </div>

                {/* 가격 */}
                <div className='col-span-2 text-center tabular-nums'>
                  {product.productPrice?.toLocaleString('ko-KR')}원
                </div>

                {/* 상태 */}
                <div className='col-span-1 text-center'>
                  <Badge variant={productStatusOptions[product.productStatus].variant}>
                    {productStatusOptions[product.productStatus].label}
                  </Badge>
                </div>

                {/* 관리 버튼 */}
                <div className='col-span-2 flex justify-center gap-2'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size='sm'
                        variant='outline'
                        disabled={product.productStatus !== 'PENDING'}
                        className='hover:bg-blue-500 hover:text-white'
                      >
                        승인
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='text-lg font-medium'>
                          승인하시겠습니까?
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-muted-foreground mt-4 mb-6 text-sm'>
                          해당 상품을 승인 처리하면 판매자가 상품을 판매할 수 있게 됩니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          className='bg-blue-500 text-white hover:bg-blue-600'
                          onClick={() => handleUpdateStatus(product.productId, 'APPROVED')}
                        >
                          승인
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size='sm'
                        variant='outline'
                        className='text-red-500 hover:bg-red-500 hover:text-white'
                        disabled={product.productStatus !== 'PENDING'}
                      >
                        반려
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='text-lg font-medium'>
                          반려하시겠습니까?
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-muted-foreground mt-4 mb-6 text-sm'>
                          해당 상품을 반려 처리하면 해당 상품은 판매 불가능 상태가 됩니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          className='bg-red-500 text-white'
                          onClick={() => handleUpdateStatus(product.productId, 'REJECTED')}
                        >
                          반려
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
