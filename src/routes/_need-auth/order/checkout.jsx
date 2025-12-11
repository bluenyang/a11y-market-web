import { addressApi } from '@/api/address-api';
import { orderApi } from '@/api/order-api';
import { AddressSelector } from '@/components/address/address-selector';
import { ErrorEmpty } from '@/components/main/error-empty';
import { LoadingEmpty } from '@/components/main/loading-empty';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_need-auth/order/checkout')({
  component: orderCheckoutPage,
  validateSearch: (search) => ({
    type: search.type || 'CART',
    cartItemIds: search.cartItemIds,
    productId: search.productId || null,
    quantity: search.quantity ? Number(search.quantity) : 1,
  }),
});

function orderCheckoutPage() {
  const { type, cartItemIds, productId, quantity } = Route.useSearch();

  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const navigate = useNavigate();

  // 결제 전 정보 조회
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await orderApi.getCheckoutInfoV2(
          type === 'CART' ? (cartItemIds ? cartItemIds.split(',') : []) : null,
          type === 'DIRECT'
            ? {
                productId: productId,
                quantity: quantity,
              }
            : null,
        );

        setCheckout(resp.data);
        setOrderItems(resp.data.items);

        const { data, status } = await addressApi.getAddressList();
        if (status !== 200) {
          throw new Error('Failed to fetch address list');
        }

        const defaultAddress = data.find((addr) => addr.isDefault);
        setSelectedAddress(defaultAddress);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOrder = async () => {
    try {
      setLoading(true);

      const data = await orderApi.createOrder(
        selectedAddress.addressId,
        orderItems.map((item) => item.cartItemId),
      );

      if (data?.status === 'ERROR') {
        setError(new Error(data.message || '주문 생성에 실패했습니다.'));
        return;
      }

      navigate({
        to: '/order/complete',
        search: {
          orderId: data.orderId,
        },
      });
    } catch (err) {
      setError(err);
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
          message={
            error?.message ||
            '결제 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          }
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
              <BreadcrumbItem className='text-muted-foreground'>
                <Link
                  to='/cart'
                  className='hover:underline'
                >
                  01 장바구니
                </Link>
              </BreadcrumbItem>
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
            defaultAddressId={selectedAddress?.addressId}
            onSelectAddress={(address) => {
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
                      <TableCell className='max-w-40 truncate px-8'>
                        {`${item.productName}`}
                      </TableCell>
                      <TableCell className='text-center'>{item.productQuantity}</TableCell>
                      <TableCell className='text-center'>{`${item.productPrice?.toLocaleString('ko-KR')}원`}</TableCell>
                      <TableCell className='text-center'>{`${item.productTotalPrice?.toLocaleString('ko-KR')}원`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* 금액 정보 */}
        <div className='grid gap-4 md:grid-cols-2'>
          <section>
            <Card className='h-full w-full gap-2'>
              <CardHeader>
                <CardTitle className='font-bold'>결제 수단</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue='tosspay'
                  className='flex flex-col gap-2'
                >
                  <Card className='py-0 transition-colors has-data-[state=checked]:border-l-4 has-data-[state=checked]:border-blue-500'>
                    <CardContent className='flex items-center gap-4 py-4'>
                      <RadioGroupItem
                        value='tosspay'
                        id='tosspay'
                      />
                      <Label htmlFor='tosspay'>{'토스페이 (Toss Pay)'}</Label>
                    </CardContent>
                  </Card>
                  <Card className='py-0 transition-colors has-data-[state=checked]:border-l-4 has-data-[state=checked]:border-blue-500'>
                    <CardContent className='flex items-center gap-4 py-4'>
                      <RadioGroupItem
                        value='kakaoPay'
                        id='kakaoPay'
                      />
                      <Label htmlFor='kakaoPay'>{'카카오페이 (Kakao Pay)'}</Label>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </CardContent>
            </Card>
          </section>

          <section className='flex flex-col gap-4'>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>결제 금액 정보</CardTitle>
                <CardDescription>결제하실 금액을 확인해 주세요.</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-2'>
                <span>{`총 상품 금액: ${checkout?.totalAmount.toLocaleString('ko-KR')}원`}</span>
                <span>{`배송비: ${checkout?.shippingFee.toLocaleString('ko-KR')}원`}</span>
                <span className='text-lg font-bold'>
                  {`총 결제 금액: ${checkout?.finalAmount.toLocaleString('ko-KR')}원`}
                </span>
              </CardContent>
            </Card>

            {/* 주문 버튼 */}
            <div className='flex h-fit w-full flex-col gap-2'>
              <Button
                variant='default'
                className='w-full py-6 text-lg'
                onClick={handleOrder}
                disabled={loading}
                aria-label='결제하기 버튼'
              >
                {loading ? '결제 처리중...' : '결제하기'}
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
          </section>
        </div>
      </main>
    );
  }
}
