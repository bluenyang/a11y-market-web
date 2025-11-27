import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/_needAuth/order/complete')({
  component: OrderCompletePage,
  validateSearch: (search) => ({
    orderId: search.orderId,
  }),
});

function OrderCompletePage() {
  const { orderId } = Route.useSearch();

  return (
    <section
      className='flex min-h-screen items-center justify-center bg-gray-50 px-6'
      aria-label='주문 완료 페이지'
    >
      <div className='w-full max-w-xl rounded-xl border bg-white p-8 text-center shadow-lg'>
        {/* 아이콘 */}
        <CheckCircle2
          className='mx-auto mb-6 h-16 w-16 text-green-600'
          aria-hidden='true'
        />

        {/* 상태 메세지 - screen reader */}
        <h1
          className='mb-2 text-2xl font-bold'
          role='status'
          aria-live='polite'
        >
          주문이 완료되었습니다.
        </h1>
        <p className='mb-6 text-gray-700'>(결제가 미구현 상태입니다.)</p>

        {/* 주문번호 */}
        <p className='mb-6 text-gray-600'>주문 번호를 아래에서 확인하실 수 있습니다.</p>

        <div
          className='mb-8 rounded-md bg-gray-100 p-4 text-sm font-medium'
          aria-label='주문 번호 정보'
        >
          주문번호: <span className='font-semibold text-gray-900'>{orderId || '알 수 없음'}</span>
        </div>

        {/* 버튼 영역 */}
        <div className='flex flex-col gap-3'>
          <Button
            variant='default'
            className='w-full'
            onClick={() => (window.location.href = '/')}
            aria-label='홈으로 이동'
          >
            홈으로 이동
          </Button>

          <Button
            variant='outline'
            className='w-full'
            onClick={() => (window.location.href = '/mypage/orders')}
            aria-label='내 주문 내역 보기'
          >
            내 주문 내역 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
