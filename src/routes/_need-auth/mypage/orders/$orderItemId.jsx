import { orderApi } from '@/api/order-api';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { LoadingEmpty } from '@/components/main/loading-empty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ORDER_ITEM_STATUS, statusLabel } from '@/constants/order-item-status';
import { orderItemStatusAlert } from '@/lib/order-Item-alert';
import { createFileRoute } from '@tanstack/react-router';
import { Barcode, Calendar, CreditCard, Hash, Package, ShoppingBag, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/mypage/orders/$orderItemId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderItemId } = Route.useParams();

  const [order, setOrder] = useState(null);
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [canRefund, setCanRefund] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await orderApi.getMyOrderDetail(orderItemId);

        const order = resp.data;
        setOrder(order);
        if (
          order.orderItem.orderItemStatus === 'PAID' ||
          order.orderItem.orderItemStatus === 'ORDERED'
        ) {
          setCanCancel(true);
        } else if (
          order.orderItem.orderItemStatus === 'SHIPPED' ||
          order.orderItem.orderItemStatus === 'ACCEPTED'
        ) {
          setCanRefund(true);
        }
      } catch (err) {
        console.error('주문 정보 불러오기 실패:', err);
        toast.error('주문 정보 불러오기 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    })();
  }, []);

  const handleConfirmAction = async () => {
    setIsProcessing(true);

    try {
      await orderApi.cancelOrder(orderItemId, {
        orderItemId: orderItemId,
        reason: reason,
      });

      toast.success('주문 취소 요청이 접수되었습니다.');

      setCanCancel(false);
      setCanRefund(null);
    } catch (err) {
      console.error('주문 처리 실패:', err);
      toast.error('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActionOrderItemConfirm = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsProcessing(true);

    try {
      await orderApi.confirmOrderItem({ orderItemId: orderItemId });

      toast.success('구매 확정이 완료되었습니다.');
      setOrder((prev) => ({
        ...prev,
        orderItem: {
          ...prev.orderItem,
          orderItemStatus: ORDER_ITEM_STATUS.CONFIRMED,
        },
      }));
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error('구매 확정 실패:', err);
      toast.error(err.message || '구매 확정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  if (!order) {
    return <LoadingEmpty />;
  }

  return (
    <main
      aria-labelledby='order-actions-title'
      className='rounded-lg p-6 shadow-sm'
    >
      <h2
        id='order-actions-title'
        className='mb-6 border-b border-gray-200 pb-4 text-center text-2xl font-bold'
      >
        주문 상세 정보
      </h2>
      <article className='mb-6 space-y-6'>
        <Alert
          className={`${orderItemStatusAlert[order.orderItem.orderItemStatus].color} items-center p-6 has-[>svg]:grid-cols-[calc(var(--spacing)*8)_1fr] [&>svg]:row-span-2 [&>svg]:size-8`}
        >
          {orderItemStatusAlert[order.orderItem.orderItemStatus].icon}
          <AlertTitle className='text-xl font-bold'>
            {orderItemStatusAlert[order.orderItem.orderItemStatus].label}
          </AlertTitle>
          <AlertDescription className='text-base'>
            {orderItemStatusAlert[order.orderItem.orderItemStatus].description}
          </AlertDescription>
        </Alert>

        <section
          aria-labelledby='order-info-title'
          className='border-border rounded-lg border p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
        >
          <h2
            id='order-info-title'
            className='mb-6 border-b border-gray-200 pb-4'
          >
            주문 내역
          </h2>

          <dl className='space-y-4'>
            <div className='flex items-start gap-3'>
              <dt className='flex min-w-[140px] items-center gap-2 text-gray-600'>
                <Calendar
                  className='h-5 w-5'
                  aria-hidden='true'
                />
                <span>주문 일자</span>
              </dt>
              <dd className='flex-1'>
                <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
              </dd>
            </div>

            <div className='flex items-start gap-3'>
              <dt className='flex min-w-[140px] items-center gap-2 text-gray-600'>
                <Hash
                  className='h-5 w-5'
                  aria-hidden='true'
                />
                <span>주문 UUID</span>
              </dt>
              <dd className='flex-1'>
                <code className='rounded bg-gray-700 px-2 py-1 text-sm break-all text-white dark:bg-gray-300 dark:text-gray-900'>
                  {order.orderItem.orderItemId}
                </code>
              </dd>
            </div>

            <div className='flex items-start gap-3'>
              <dt className='flex min-w-[140px] items-center gap-2 text-gray-600'>
                <CreditCard
                  className='h-5 w-5'
                  aria-hidden='true'
                />
                <span>결제 금액</span>
              </dt>
              <dd className='flex-1'>
                <strong
                  aria-label={`총 ${formatCurrency(order.orderItem.productPrice * order.orderItem.productQuantity)}원`}
                >
                  {formatCurrency(order.orderItem.productPrice * order.orderItem.productQuantity)}
                </strong>
              </dd>
            </div>

            <div className='flex items-start gap-3'>
              <dt className='flex min-w-[140px] items-center gap-2 text-gray-600'>
                <Package
                  className='h-5 w-5'
                  aria-hidden='true'
                />
                <span>상품 수량</span>
              </dt>
              <dd className='flex-1'>
                <span aria-label={`${order.orderItem.productQuantity}개`}>
                  {order.orderItem.productQuantity}개
                </span>
              </dd>
            </div>

            <div className='flex items-start gap-3'>
              <dt className='flex min-w-[140px] items-center gap-2 text-gray-600'>
                <ShoppingBag
                  className='h-5 w-5'
                  aria-hidden='true'
                />
                <span>주문 상태</span>
              </dt>
              <dd className='flex-1'>
                <Badge className={statusLabel(order.orderItem.orderItemStatus).className}>
                  {statusLabel(order.orderItem.orderItemStatus).label}
                </Badge>
              </dd>
            </div>
          </dl>
        </section>

        <section
          aria-labelledby='product-info-title'
          className='border-border rounded-lg border p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
        >
          <h2
            id='product-info-title'
            className='mb-6 border-b border-gray-200 pb-4'
          >
            상품 정보
          </h2>
          <div className='flex flex-col gap-6 md:flex-row'>
            <ImageWithFallback
              src={order.orderItem.productImageUrl}
              alt={order.orderItem.productName}
              className='aspect-3/2 w-full max-w-xs rounded-md border object-cover'
            />
            <div className='flex flex-1 flex-col justify-center gap-6'>
              <div>
                <h3 className='mb-2 text-xl font-bold'>{order.orderItem.productName}</h3>
              </div>
              <dl className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <dt className='flex min-w-[100px] items-center gap-2 text-gray-600'>
                    <Tag
                      className='h-4 w-4'
                      aria-hidden='true'
                    />
                    <span>카테고리</span>
                  </dt>
                  <dd>{order.orderItem.categoryName}</dd>
                </div>

                <div className='flex items-center gap-3'>
                  <dt className='flex min-w-[100px] items-center gap-2 text-gray-600'>
                    <Barcode
                      className='h-4 w-4'
                      aria-hidden='true'
                    />
                    <span>상품 코드</span>
                  </dt>
                  <dd>
                    <code className='rounded bg-gray-700 px-2 py-1 text-sm break-all text-white dark:bg-gray-300 dark:text-gray-900'>
                      {order.orderItem.productId}
                    </code>
                  </dd>
                </div>

                <div className='flex items-center gap-3'>
                  <dt className='min-w-[100px] text-gray-600'>단가</dt>
                  <dd>
                    <strong>{formatCurrency(order.orderItem.productPrice)}</strong>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section
          aria-labelledby='product-info-title'
          className='border-border rounded-lg border p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
        >
          <h2
            id='product-info-title'
            className='mb-6 border-b border-gray-200 pb-4'
          >
            주문 관리
          </h2>
          <div className='flex flex-col gap-4 md:flex-row md:gap-6'>
            {order.orderItem.orderItemStatus === ORDER_ITEM_STATUS.SHIPPED && (
              <AlertDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant='default'
                    className='w-full md:w-auto'
                  >
                    구매 확정하기
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>구매 확정하기</AlertDialogTitle>
                    <AlertDialogDescription>
                      정말로 이 주문을 구매 확정하시겠습니까? 구매 확정 후에는 환불이 불가능합니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleActionOrderItemConfirm}
                      disabled={isProcessing}
                    >
                      구매 확정
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button
                    variant='destructive'
                    className='w-full'
                    disabled={!canCancel && !canRefund}
                  >
                    주문 취소 요청
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>주문 취소 요청</DialogTitle>
                    <DialogDescription>
                      정말로 이 주문을 취소하시겠습니까? 취소 사유를 입력해주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <Field className='mt-4'>
                    <FieldLabel htmlFor='reason'>취소 사유</FieldLabel>
                    <Textarea
                      id='reason'
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder='취소 사유를 입력해주세요.'
                      required
                      rows={4}
                    />
                  </Field>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant='outline'>취소</Button>
                    </DialogClose>
                    <Button
                      type='submit'
                      onClick={handleConfirmAction}
                      disabled={isProcessing || reason.trim() === ''}
                    >
                      {isProcessing ? (
                        <span className='flex items-center gap-2'>
                          처리 중... <Spinner />
                        </span>
                      ) : (
                        '확인'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </section>
      </article>
    </main>
  );
}
