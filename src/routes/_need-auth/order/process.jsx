import { orderApi } from '@/api/order-api';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { fetchCartCount } from '@/store/cart-slice';
import { Icon } from '@iconify/react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/order/process')({
  component: RouteComponent,
  validateSearch: (search) => ({
    orderId: search.orderId || search.merchant_uid,
    amount: search.amount,
    paymentKey: search.paymentKey, // Toss Payments 결제 인증 키
    imp_uid: search.imp_uid, // iamport 결제 인증 키 (추후 iamport 연동 시 사용)
    code: search.code, // 결제 상태 코드
    message: search.message, // 결제 상태 메시지
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = useSearch({ from: Route.id });
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    (async () => {
      try {
        const { orderId, amount, paymentKey, imp_uid, code, message } = searchParams;

        if (code) {
          throw new Error(`결제에 실패하였습니다: ${message} (코드: ${code})`);
        }
        if (!orderId) throw new Error('주문 ID가 없습니다.');

        const cartItemIds = JSON.parse(sessionStorage.getItem('checkout_cart_items') || '[]');

        await orderApi.verifyPayment({
          orderId,
          amount: Number(amount),
          method: paymentKey ? 'TOSS' : 'PORTONE',
          paymentKey: paymentKey,
          imp_uid: imp_uid,
          cartItemIdsToDelete: cartItemIds,
        });

        sessionStorage.removeItem('checkout_cart_items');

        dispatch(fetchCartCount());
        navigate({
          to: '/order/complete',
          replace: true,
          search: {
            orderId,
          },
        });
      } catch (err) {
        console.error('결제 검증에 실패하였습니다:', err);
        toast.error(`결제 검증에 실패하였습니다: ${err.message || err}`);
        navigate({
          to: '/cart',
          replace: true,
        });
      }
    })();
  }, [searchParams, navigate]);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Icon
            icon='svg-spinners:90-ring-with-bg'
            className='size-16'
          />
        </EmptyMedia>
        <EmptyTitle className='text-3xl font-bold'>로딩 중 입니다.</EmptyTitle>
        <EmptyDescription className='text-lg'>잠시만 기다려주세요.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
