import { createOrder, getCheckoutInfo } from '@/api/orderAPI';
import { AddressSelector } from '@/components/address-selector';
import { ErrorEmpty } from '@/components/error-empty';
import { LoadingEmpty } from '@/components/loading-empty';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const Route = createFileRoute('/_needAuth/order/checkout')({
  component: orderCheckoutPage,
});

function orderCheckoutPage() {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { orderItems } = useSelector((state) => state.order);

  const navigate = useNavigate();

  //임시 : cart에서 받아올 값
  const orderItemIds = [
    '019A6A12-7F22-7FEC-9029-BDBB9F4AA720',
    '019A6A12-7F22-7FEC-9029-BDBB9F4AA721',
  ];
  const addressId = '019A698D-82C0-7C66-AC4A-293C84ACFA52';

  // 결제 전 정보 조회
  useEffect(() => {
    console.log('orderItems:', orderItems);

    const fetchCheckout = async () => {
      try {
        setLoading(true);
        const data = await getCheckoutInfo(orderItems.map((item) => item.cartItemId));

        if (data.status === 'OUT_OF_STOCK') {
          navigate({
            to: '/cart',
            search: (search) => ({
              ...search,
              error: '재고가 부족한 상품이 있습니다.',
            }),
          });
          return;
        }

        setCheckout(data);

        const defaultAddress = data.addresses.find(
          (addr) => addr.addressId === data.defaultAddressId,
        );

        setSelectedAddress(defaultAddress);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
    console.log(orderItems);
    console.log(checkout);
  }, []);

  const handleOrder = async () => {
    try {
      setLoading(true);

      const order = await createOrder(addressId, orderItemIds);

      window.location.href = `/order/complete?orderId=${order.orderId}`;
    } catch (error) {
      alert('주문 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  // 로딩 상태
  if (loading && !checkout) {
    return (
      <main
        className='font-kakao-big flex min-h-screen items-center justify-center'
        role='status'
        aria-live='polite'
      >
        <LoadingEmpty />
      </main>
    );
  } else if (error || (!loading && !checkout)) {
    return (
      <main className='font-kakao-big flex items-center justify-center py-24'>
        <ErrorEmpty
          prevPath='/cart'
          message='결제 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        />
      </main>
    );
  } else {
    return (
      <main className='font-kakao-big mx-auto flex max-w-4xl flex-col justify-center space-y-6 p-6'>
        <header className='flex flex-col justify-center gap-4 py-4'>
          <h1 className='text-center text-2xl font-bold'>주문결제</h1>
          <Breadcrumb className='flex justify-center'>
            <BreadcrumbList>
              <BreadcrumbItem className='text-muted-foreground'>01 장바구니</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='text-foreground'>02 주문결제</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='text-muted-foreground'>03 주문완료</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <Separator className='' />
        {/* 배송지 선택 */}
        <section>
          <AddressSelector
            addresses={checkout.addresses}
            defaultAddressId={checkout.defaultAddressId}
            onSelectAddress={(addressId) => {
              const address = checkout.addresses.find((addr) => addr.addressId === addressId);
              setSelectedAddress(address);
            }}
          />
        </section>

        {/* 주문 상품 정보 */}
        <section>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>주문 상품 정보</CardTitle>
              <CardDescription>주문하실 상품을 확인해 주세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className='px-8'>
                  <TableRow>
                    <TableHead className='w-2/5 text-center'>상품명</TableHead>
                    <TableHead className='w-1/5 text-center'>수량</TableHead>
                    <TableHead className='w-1/5 text-center'>가격</TableHead>
                    <TableHead className='w-1/5 text-center'>합계</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='px-8'>
                  {orderItems.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className='max-w-40 truncate px-8'>{`${item.productName}`}</TableCell>
                      <TableCell className='text-center'>{item.quantity}</TableCell>
                      <TableCell className='text-center'>{`${item.productPrice?.toLocaleString('ko-KR')}원`}</TableCell>
                      <TableCell className='text-center'>{`${(item.productPrice * item.quantity).toLocaleString('ko-KR')}원`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* 금액 정보 */}
        <section
          className='space-y-2 rounded-lg border p-4'
          aria-label='결제 금액 정보'
        >
          <p>총 상품 금액: {checkout?.totalAmount}원</p>
          <p>배송비: {checkout?.shippingFee}원</p>
          <p className='text-lg font-bold'>총 결제 금액: {checkout?.finalAmount}원</p>
        </section>

        {/* 주문 버튼 */}
        <div className='flex h-fit w-full flex-col gap-2'>
          <Button
            variant='default'
            className='w-full py-6 text-lg'
            onClick={handleOrder}
            disabled={loading}
            aria-label='주문 실행 버튼'
          >
            {loading ? '주문 처리중...' : '주문하기'}
          </Button>
          <Button
            variant='outline'
            className='w-full py-6 text-lg'
            onClick={() => navigate({ to: '/cart' })}
            disabled={loading}
            aria-label='장바구니로 돌아가기 버튼'
          >
            장바구니로 돌아가기
          </Button>
        </div>
      </main>
    );
  }
}
