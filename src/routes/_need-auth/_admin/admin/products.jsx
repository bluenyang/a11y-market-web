// src/routes/_need-auth/_admin/admin/products.jsx
import { useEffect, useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { adminApi } from '@/api/admin-api';
import { productApi } from '@/api/product-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/_need-auth/_admin/admin/products')({
  component: AdminProductPendingPage,
});

/** /admin/products/pending : 관리자 상품 등록 신청 관리 페이지 */
function AdminProductPendingPage() {
  const [products, setProducts] = useState([]); // /v1/admin/products/pending 결과
  const [detailsMap, setDetailsMap] = useState({}); // key: productId, value: 상세 조회 응답
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatPrice = (value) =>
    typeof value === 'number' ? new Intl.NumberFormat('ko-KR').format(value) : '-';

  // 승인/반려 - 실제 API 연동 + 로컬 상태 동기화
  const handleUpdateStatus = async (productId, nextStatus) => {
    const actionLabel = nextStatus === 'APPROVED' ? '승인' : '반려';

    const confirmed = window.confirm(`해당 상품을 ${actionLabel} 처리하시겠습니까?`);
    if (!confirmed) return;

    try {
      await adminApi.updateProductStatus(productId, nextStatus);

      // 로컬 상태도 함께 업데이트
      setProducts((prev) =>
        prev.map((p) => (p.productId === productId ? { ...p, productStatus: nextStatus } : p)),
      );

      window.alert(`${actionLabel} 처리되었습니다.`);
    } catch (err) {
      console.error('상품 상태 변경 실패:', err);
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        '상품 상태 변경 중 오류가 발생했습니다.';
      window.alert(msg);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) 관리자 승인 대기 목록 조회
        const { data } = await adminApi.getPendingProducts();
        const list = Array.isArray(data) ? data : [];
        setProducts(list);

        // 2) 각 상품의 상세 정보 조회(GET /v1/products/{productId})
        if (list.length > 0) {
          const results = await Promise.allSettled(
            list.map((item) => productApi.getProductDetails(item.productId)),
          );

          const map = {};
          results.forEach((res, idx) => {
            const base = list[idx];
            if (res.status === 'fulfilled') {
              map[base.productId] = res.value.data;
            }
          });

          setDetailsMap(map);
        }
      } catch (err) {
        console.error('승인 대기 상품 조회 실패:', err);
        const msg =
          err.response?.data?.message ??
          err.response?.data?.error ??
          '승인 대기 상품 목록을 불러오는 데 실패했습니다.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { total, pending, approved, rejected } = useMemo(() => {
    const total = products.length;
    const pending = products.filter((p) => p.productStatus === 'PENDING').length;
    const approved = products.filter((p) => p.productStatus === 'APPROVED').length;
    const rejected = products.filter((p) => p.productStatus === 'REJECTED').length;
    return { total, pending, approved, rejected };
  }, [products]);

  return (
    <main className='font-kakao-big-sans mx-auto max-w-6xl px-4 py-8'>
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
        <SummaryCard
          label='전체 신청'
          value={`${total}건`}
        />
        <SummaryCard
          label='승인 대기'
          value={`${pending}건`}
        />
        <SummaryCard
          label='승인 완료'
          value={`${approved}건`}
        />
        <SummaryCard
          label='반려 처리'
          value={`${rejected}건`}
        />
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
          <div className='col-span-3'>판매자 정보</div>
          <div className='col-span-2 text-right'>판매가</div>
          <div className='col-span-1 text-center'>상태</div>
          <div className='col-span-2 text-right'>관리</div>
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
              <AdminProductRow
                key={product.productId}
                product={product}
                detail={detailsMap[product.productId]}
                formatPrice={formatPrice}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({ label, value }) {
  return (
    <Card className='rounded-2xl'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-muted-foreground text-xs'>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  );
}

function AdminProductRow({ product, detail, formatPrice, onUpdateStatus }) {
  const { productId, productName, productPrice, productStatus, submitDate } = product;

  // 상품 상세 조회 응답에서 가져오는 값들
  const categoryName = detail?.categoryName ?? '-';
  const sellerName = detail?.sellerName ?? '-';
  const sellerGrade = detail?.sellerGrade ?? '-';

  // 신청일: 우선 관리자 목록 DTO의 submitDate 사용, 없으면 detail.submitDate 사용
  const submittedAt = submitDate ?? detail?.submitDate ?? null;

  const status = productStatus || 'PENDING';

  const statusLabelMap = {
    PENDING: '승인 대기',
    APPROVED: '승인 완료',
    REJECTED: '반려',
  };

  const statusVariantMap = {
    PENDING: 'outline',
    APPROVED: 'default',
    REJECTED: 'destructive',
  };

  const statusLabel = statusLabelMap[status] || status;
  const badgeVariant = statusVariantMap[status] || 'outline';
  const isPending = status === 'PENDING';

  return (
    <div className='grid grid-cols-12 items-center px-4 py-3 text-sm'>
      {/* 상품 정보 */}
      <div className='col-span-4 min-w-0'>
        <div className='truncate font-medium'>{productName}</div>
        <div className='text-muted-foreground text-xs'>{categoryName}</div>
        <div className='text-muted-foreground text-[11px]'>
          신청일 : {submittedAt ? String(submittedAt).slice(0, 10) : '-'}
        </div>
      </div>

      {/* 판매자 정보 */}
      <div className='col-span-3 min-w-0'>
        <div className='truncate text-sm'>{sellerName}</div>
        <div className='text-muted-foreground text-xs'>등급: {sellerGrade}</div>
      </div>

      {/* 가격 */}
      <div className='col-span-2 text-right tabular-nums'>{formatPrice(productPrice)}원</div>

      {/* 상태 */}
      <div className='col-span-1 text-center'>
        <Badge variant={badgeVariant}>{statusLabel}</Badge>
      </div>

      {/* 관리 버튼 */}
      <div className='col-span-2 flex justify-end gap-2'>
        <Button
          size='sm'
          variant='outline'
          disabled={!isPending}
          onClick={() => onUpdateStatus(productId, 'APPROVED')}
        >
          승인
        </Button>
        <Button
          size='sm'
          variant='outline'
          className='text-red-500'
          disabled={!isPending}
          onClick={() => onUpdateStatus(productId, 'REJECTED')}
        >
          반려
        </Button>
      </div>
    </div>
  );
}

export default AdminProductPendingPage;
