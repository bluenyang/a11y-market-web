import { DashboardDailyRevenue } from '@/components/seller/dashboard/daily-revenue';
import { DashboardRecentOrder } from '@/components/seller/dashboard/recent-order';
import { DashboardStatSection } from '@/components/seller/dashboard/stat-section';
import { DashboardTopProduct } from '@/components/seller/dashboard/top-product';
import { createFileRoute } from '@tanstack/react-router';

/** /seller/dashboard : 판매자 대시보드 */
export const Route = createFileRoute('/_need-auth/_seller/seller/dashboard')({
  component: SellerDashboardPage,
});

function SellerDashboardPage() {
  return (
    <main className='font-kakao-big-sans mx-auto max-w-6xl px-4 py-8'>
      {/* 헤더 */}
      <section className='mb-10 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>판매자 대시보드</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            내 판매 정보를 한눈에 확인할 수 있습니다.
          </p>
        </div>
      </section>

      {/* 요약 카드 */}
      <DashboardStatSection />

      {/* 기간 필터 + 매출 추이 차트 */}
      <DashboardDailyRevenue />

      {/* 판매 상위 상품 Bar 차트 */}
      <DashboardTopProduct />

      {/* 하단: 최근 주문 / 빠른 작업 */}
      <DashboardRecentOrder />
    </main>
  );
}
