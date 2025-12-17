// src/routes/_needAuth/seller/orders.jsx
import { sellerApi } from '@/api/seller-api';
import { InfoRow, OrderSummaryCard } from '@/components/seller/order-summary-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { statusLabel } from '@/constants/order-item-status';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ClipboardClock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function SellerOrdersPage() {
  const [orderData, setOrderData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  // const [openDateFrom, setOpenDateFrom] = useState(false);
  // const [dateFrom, setDateFrom] = useState('');
  // const [openDateTo, setOpenDateTo] = useState(false);
  // const [dateTo, setDateTo] = useState('');
  // const [keyword, setKeyword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [orderSummary, setOrderSummary] = useState({
    newOrders: 0,
    acceptedOrders: 0,
    shippingOrders: 0,
    completedOrders: 0,
    claimedOrders: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await sellerApi.getReceivedOrders(
          page - 1,
          20,
          statusFilter === 'all' ? null : statusFilter,
        );
        const { orderItems, totalOrderCount } = data;

        setTotalOrderCount(totalOrderCount);
        setOrderData(orderItems);

        const summaryResp = await sellerApi.getOrderSummary();
        setOrderSummary((prev) => ({ ...prev, ...summaryResp.data }));
      } catch (err) {
        console.error('Failed to fetch received orders:', err);
      }
    })();
  }, [page, statusFilter]);

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderItemId = selectedOrder.orderItemId;

      await sellerApi.updateOrderItemStatus(orderItemId, selectedOrder.orderItemStatus);

      // 상태 업데이트 후, 주문 데이터 업데이트
      setOrderData((prevOrders) =>
        prevOrders.map((order) =>
          order.orderItemId === orderItemId
            ? { ...order, orderItemStatus: selectedOrder.orderItemStatus }
            : order,
        ),
      );

      toast.success('주문 상태가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('Failed to update order item status:', error);
      toast.error(error.message || '주문 상태 업데이트에 실패했습니다.');
    }
  };

  const getBadge = (status) => {
    return <Badge className={statusLabel(status).className}>{statusLabel(status).label}</Badge>;
  };

  return (
    <main className='font-kakao-big mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6'>
      {/* 헤더 */}
      <header className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div className='space-y-1'>
          <h1 className='font-kakao-big text-2xl'>주문 접수 및 관리 </h1>
          <p className='font-kakao-little text-sm'>
            접수된 주문을 확인하고, 상품 준비 및 배송 정보를 관리할 수 있습니다.
          </p>
        </div>
        <div className='flex w-48 flex-col items-center gap-2'>
          {/* 이전으로 */}
          <Button
            variant='default'
            className='font-kakao-little h-9 w-full px-4 text-base'
            type='button'
            onClick={() => navigate({ to: '/seller/dashboard' })}
          >
            대시보드로 돌아가기
          </Button>
          {/* 관리 방법 보기 */}
          {/* <Button
            variant='outline'
            className='font-kakao-little h-9 w-full px-4 text-base'
            type='button'
          >
            관리 방법 보기
          </Button> */}
        </div>
      </header>

      {/* 상단 요약 카드 */}
      <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        <OrderSummaryCard
          label='신규 주문'
          value={orderSummary.newOrders}
          description='주문접수 상태의 주문 수'
        />
        <OrderSummaryCard
          label='주문 접수됨'
          value={orderSummary.acceptedOrders}
          description='포장/출고 준비 중인 주문 수'
        />
        <OrderSummaryCard
          label='배송 중'
          value={orderSummary.shippingOrders}
          description='택배사에 전달된 배송 건'
        />
        <OrderSummaryCard
          label='배송 완료'
          value={orderSummary.completedOrders}
          description='배송이 완료된 주문 수'
        />
        <OrderSummaryCard
          label='취소/반품 요청'
          value={orderSummary.claimedOrders}
          description='배송이 완료된 주문 수'
        />
      </section>

      {/* 주문 목록 + 검색 */}
      <Card className='shadow-sm'>
        {/* 검색 영역 */}
        <CardHeader className='border-b py-3'>
          <div className='space-y-3'>
            <FieldGroup className='grid items-end gap-3 md:grid-cols-4'>
              {/* 주문 상태 필터 */}
              <Field>
                <FieldLabel
                  htmlFor='filter-status'
                  className='font-kakao-little text-xs font-medium'
                >
                  주문 상태
                </FieldLabel>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger
                    id='filter-status'
                    className='focus-visible: mt-1 h-9 text-sm focus-visible:ring-slate-400'
                  >
                    <SelectValue placeholder='전체' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>전체</SelectItem>
                    <SelectItem value='ORDERED'>{getBadge('ORDERED')}</SelectItem>
                    <SelectItem value='PAID'>{getBadge('PAID')}</SelectItem>
                    <SelectItem value='REJECTED'>{getBadge('REJECTED')}</SelectItem>
                    <SelectItem value='ACCEPTED'>{getBadge('ACCEPTED')}</SelectItem>
                    <SelectItem value='SHIPPING'>{getBadge('SHIPPING')}</SelectItem>
                    <SelectItem value='SHIPPED'>{getBadge('SHIPPED')}</SelectItem>
                    <SelectItem value='CONFIRMED'>{getBadge('CONFIRMED')}</SelectItem>
                    <SelectItem value='CANCEL_PENDING'>{getBadge('CANCEL_PENDING')}</SelectItem>
                    <SelectItem value='CANCELED'>{getBadge('CANCELED')}</SelectItem>
                    <SelectItem value='CANCEL_REJECTED'>{getBadge('CANCEL_REJECTED')}</SelectItem>
                    <SelectItem value='RETURN_PENDING'>{getBadge('RETURN_PENDING')}</SelectItem>
                    <SelectItem value='RETURNED'>{getBadge('RETURNED')}</SelectItem>
                    <SelectItem value='RETURN_REJECTED'>{getBadge('RETURN_REJECTED')}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/* 기간(시작) */}
              {/* <Field>
                <div className='flex flex-col gap-3'>
                  <FieldLabel
                    htmlFor='date-from'
                    className='px-1'
                  >
                    {'기간 설정 (시작)'}
                  </FieldLabel>
                  <Popover
                    open={openDateFrom}
                    onOpenChange={setOpenDateFrom}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        id='date-from'
                        className='w-48 justify-between font-normal'
                      >
                        {dateFrom ? dateFrom.toLocaleDateString() : 'Select date'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto overflow-hidden p-0'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={dateFrom}
                        captionLayout='dropdown'
                        onSelect={(date) => {
                          setDateFrom(date);
                          setOpenDateFrom(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </Field> */}

              {/* 기간(종료) */}
              {/* <Field>
                <div className='flex flex-col gap-3'>
                  <FieldLabel
                    htmlFor='date-to'
                    className='px-1'
                  >
                    {'기간 설정 (종료)'}
                  </FieldLabel>
                  <Popover
                    open={openDateTo}
                    onOpenChange={setOpenDateTo}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        id='date-to'
                        className='w-48 justify-between font-normal'
                      >
                        {dateTo ? dateTo.toLocaleDateString() : 'Select date'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto overflow-hidden p-0'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={dateTo}
                        captionLayout='dropdown'
                        onSelect={(date) => {
                          setDateTo(date);
                          setOpenDateTo(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </Field> */}

              {/* 검색어 */}
              {/* <Field>
                <Label
                  htmlFor='order-keyword'
                  className='font-kakao-little text-xs font-medium'
                >
                  주문 검색
                </Label>
                <div className='mt-1 flex gap-2'>
                  <Input
                    id='order-keyword'
                    placeholder='주문번호 / 주문자명 / 상품명'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className='h-9 flex-1 text-sm'
                  />
                  <Button
                    type='button'
                    className='font-kakao-little h-9 px-4 text-xs text-slate-50 '
                  >
                    검색
                  </Button>
                </div>
              </Field> */}
            </FieldGroup>
          </div>
        </CardHeader>

        {/* 주문 목록 테이블 */}
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            {orderData.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia
                    variant='icon'
                    className='mb-0 flex size-24 rounded-full'
                  >
                    <ClipboardClock className='size-12' />
                  </EmptyMedia>
                  <EmptyTitle className='text-3xl font-bold'>최근 주문 내역이 없습니다.</EmptyTitle>
                  <EmptyDescription className='text-lg'>
                    최근에 접수된 주문이 없습니다.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <>
                <Table className='text-xs md:text-sm'>
                  <TableHeader className='border-b-4'>
                    <TableRow className='font-kakao-little font-medium md:text-xs'>
                      <TableHead className='px-4 py-2'>주문ID</TableHead>
                      <TableHead className='px-4 py-2 text-center'>주문일</TableHead>
                      <TableHead className='px-4 py-2 text-center'>주문자</TableHead>
                      <TableHead className='px-4 py-2'>주문 상품</TableHead>
                      <TableHead className='px-4 py-2 text-center'>수량</TableHead>
                      <TableHead className='px-4 py-2 text-center'>결제 금액</TableHead>
                      <TableHead className='px-4 py-2 text-center'>상태</TableHead>
                      <TableHead className='px-4 py-2 text-center'>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData.map((o) => {
                      const badge = statusLabel(o.orderItemStatus);
                      return (
                        <TableRow
                          key={o.orderItemId}
                          className={`border-t ${
                            o.orderItemId === selectedOrder?.orderItemId
                              ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800'
                              : ''
                          }`}
                        >
                          <TableCell className='px-4 py-2 align-middle text-blue-600 md:text-xs dark:text-blue-300'>
                            {o.orderItemId}
                          </TableCell>
                          <TableCell className='px-4 py-2 text-center align-middle md:text-xs'>
                            {new Date(o.orderedAt)?.toLocaleDateString('ko-KR')}
                          </TableCell>
                          <TableCell className='px-4 py-2 text-center align-middle md:text-xs'>
                            {o.buyerName}
                          </TableCell>
                          <TableCell className='truncate px-4 py-2 align-middle md:max-w-[260px]'>
                            {o.productName}
                          </TableCell>
                          <TableCell className='truncate px-4 py-2 text-center align-middle'>
                            {o.productQuantity}
                          </TableCell>
                          <TableCell className='px-4 py-2 text-center align-middle md:text-xs'>
                            ₩{(o.productPrice * o.productQuantity)?.toLocaleString('ko-KR')}
                          </TableCell>
                          <TableCell className='px-4 py-2 text-center align-middle'>
                            <Badge className={badge.className}>{badge.label}</Badge>
                          </TableCell>
                          <TableCell className='px-4 py-2 text-center align-middle'>
                            <Button
                              size='xs'
                              variant='outline'
                              className='h-7 rounded-md px-3'
                              type='button'
                              onClick={() => setSelectedOrder(o)}
                            >
                              상세
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </CardContent>

        {/* 하단 Pagination – 아직 기능 없이 UI만 */}
        <CardFooter className='border-t px-4 py-3'>
          <div className='flex w-full items-center justify-between text-base md:text-xs'>
            <span>{`총 ${totalOrderCount}건 중 ${(page - 1) * 20 + 1}-${Math.min(page * 20, totalOrderCount)}건 표시`}</span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
                </PaginationItem>
                {[...Array(Math.ceil(totalOrderCount / 20)).keys()].map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      isActive={page === num + 1}
                      onClick={() => setPage(num + 1)}
                    >
                      {num + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, Math.ceil(totalOrderCount / 20)))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardFooter>
      </Card>

      {selectedOrder && (
        // 하단: 주문 상세 + 배송 처리
        <section className='space-y-4'>
          {/* 섹션 헤더 */}
          <div className='flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between'>
            <h2 className='font-kakao-little text-sm font-semibold'>주문 / 배송 처리 상세</h2>
            <p className='font-kakao-little text-xs'>
              선택한 주문의 기본 정보와 배송 상태, 송장 정보를 한 번에 관리합니다.
            </p>
          </div>

          {/* 좌: 주문 정보 / 우: 배송 처리 */}
          <div className='grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'>
            {/* 왼쪽: 주문 기본 정보 카드 */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='font-kakao-little text-sm'>주문 기본 정보</CardTitle>
                <CardDescription className='font-kakao-little text-xs'>
                  결제 금액과 주문자, 주문 상품 정보를 확인할 수 있습니다.
                </CardDescription>
              </CardHeader>

              <CardContent className='space-y-4'>
                {/* 주문 정보 박스 */}
                <div className='space-y-2 rounded-lg border p-4'>
                  <InfoRow
                    label='주문번호'
                    value={selectedOrder?.orderId || '-'}
                  />
                  <InfoRow
                    label='주문일'
                    value={
                      selectedOrder?.orderedAt
                        ? new Date(selectedOrder.orderedAt).toLocaleDateString('ko-KR')
                        : '-'
                    }
                  />
                  <InfoRow
                    label='주문자'
                    value={selectedOrder?.buyerName || '-'}
                  />
                  <InfoRow
                    label='주문 상품'
                    value={selectedOrder?.productName || '-'}
                  />
                  <InfoRow
                    label='결제 금액'
                    value={
                      selectedOrder
                        ? `₩${(selectedOrder.productPrice * selectedOrder.productQuantity).toLocaleString('ko-KR')}`
                        : `-`
                    }
                  />
                </div>

                {/* 상태 요약 박스 */}
                <div className='/60 flex items-center justify-between rounded-lg border px-4 py-3'>
                  <div className='space-y-0.5'>
                    <p className='font-kakao-little text-xs font-medium'>현재 주문 상태</p>
                    <p className='font-kakao-little'>
                      주문의 진행 상황을 확인하고 우측에서 배송 상태를 변경할 수 있습니다.
                    </p>
                  </div>
                  <Badge className={statusLabel(selectedOrder?.orderItemStatus).className}>
                    {statusLabel(selectedOrder?.orderItemStatus).label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 오른쪽: 배송 처리 카드 */}
            <Card className='shadow-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='font-kakao-little text-sm'>배송 처리</CardTitle>
                <CardDescription className='font-kakao-little text-xs'>
                  배송 상태, 택배사, 송장번호를 입력하고 알림 발송 여부를 설정할 수 있습니다.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  className='space-y-4'
                  onSubmit={handleShippingSubmit}
                >
                  <FieldGroup className='grid gap-4'>
                    {/* 배송 상태 */}
                    <Field>
                      <Label
                        htmlFor='shipping-status'
                        className='font-kakao-little text-xs font-medium'
                      >
                        배송 상태
                      </Label>
                      <Select
                        value={selectedOrder?.orderItemStatus || ''}
                        disabled={selectedOrder?.orderItemStatus === 'CONFIRMED'}
                        onValueChange={(value) => {
                          setSelectedOrder((prev) => ({
                            ...prev,
                            orderItemStatus: value,
                          }));
                        }}
                      >
                        <SelectTrigger
                          id='shipping-status'
                          className='focus-visible: mt-1 h-9 text-sm focus-visible:ring-slate-400'
                        >
                          <SelectValue placeholder='배송 상태 선택' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value='ORDERED'
                            disabled
                          >
                            {getBadge('ORDERED')}
                          </SelectItem>
                          <SelectItem value='PAID'>{getBadge('PAID')}</SelectItem>
                          <SelectItem value='REJECTED'>{getBadge('REJECTED')}</SelectItem>
                          <SelectItem value='ACCEPTED'>{getBadge('ACCEPTED')}</SelectItem>
                          <SelectItem value='SHIPPING'>{getBadge('SHIPPING')}</SelectItem>
                          <SelectItem value='SHIPPED'>{getBadge('SHIPPED')}</SelectItem>
                          <SelectItem
                            value='CONFIRMED'
                            disabled
                          >
                            {getBadge('CONFIRMED')}
                          </SelectItem>
                          <SelectItem
                            value='CANCEL_PENDING'
                            disabled
                          >
                            {getBadge('CANCEL_PENDING')}
                          </SelectItem>
                          <SelectItem value='CANCELED'>{getBadge('CANCELED')}</SelectItem>
                          <SelectItem value='CANCEL_REJECTED'>
                            {getBadge('CANCEL_REJECTED')}
                          </SelectItem>
                          <SelectItem value='RETURN_PENDING'>
                            {getBadge('RETURN_PENDING')}
                          </SelectItem>
                          <SelectItem value='RETURNED'>{getBadge('RETURNED')}</SelectItem>
                          <SelectItem value='RETURN_REJECTED'>
                            {getBadge('RETURN_REJECTED')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </FieldGroup>

                  {/* 버튼 */}
                  <div className='mt-3 flex flex-col gap-2'>
                    <Button
                      type='submit'
                      className='font-kakao-little h-9 text-xs font-medium'
                    >
                      배송 정보 저장
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      className='font-kakao-little mt-1 h-9 text-xs'
                    >
                      취소
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </main>
  );
}

export const Route = createFileRoute('/_need-auth/_seller/seller/orders')({
  component: SellerOrdersPage,
});
