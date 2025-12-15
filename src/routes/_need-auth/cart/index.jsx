// src/routes/cart.jsx
import { cartApi } from '@/api/cart-api';
import { CartGroup } from '@/components/cart/cart-group';
import { LoadingEmpty } from '@/components/main/loading-empty';
import { Alert, AlertTitle } from '@/components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Item } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { Icon } from '@iconify/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlertCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/cart/')({
  component: CartPage,
});

function CartPage() {
  const [cartGroups, setCartGroups] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [fetching, setFetching] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitType, setSubmitType] = useState('none');
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      setFetching(true);
      try {
        const resp = await cartApi.getCartItems();

        if (resp.status !== 200) {
          throw new Error('Failed to fetch cart items');
        }

        setCartGroups(resp.data);
        // setTotalPrice(resp.data?.total || 0);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
        toast.error('장바구니 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setFetching(false);
      }
    };
    fetchCartData();
  }, []);

  useEffect(() => {
    if (!cartGroups.items) return;

    let total = 0;

    cartGroups.items.forEach((group) => {
      group.items.forEach((item) => {
        if (selectedItems.has(item.cartItemId)) {
          total += item.productPrice * item.quantity;
        }
      });
    });

    setTotalPrice(total);
  }, [cartGroups, selectedItems]);

  const handleOrder = async (type) => {
    setSubmitType(type);

    const selectedIds = Array.from(selectedItems);

    const options = {
      selectedItems: selectedIds,
      orderAllItems: type === 'all',
    };

    navigate({
      to: '/order/checkout',
      search: (old) => ({
        ...old,
        type: 'CART',
        cartItemIds:
          type === 'all'
            ? cartGroups.items
                .flatMap((group) => group.items.map((item) => item.cartItemId))
                .join(',')
            : selectedIds.join(','),
      }),
    });
  };

  const handleOnDeleteGroup = (sellerId) => {
    const updatedGroups = cartGroups.items.filter((group) => group.sellerId !== sellerId);
    setCartGroups((prev) => ({ ...prev, items: updatedGroups }));
  };

  const handleUpdateQuantity = (cartItemId, newQty) => {
    setCartGroups((prev) => {
      const newGroups = { ...prev };
      newGroups.items = newGroups.items.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item,
        ),
      }));
      return newGroups;
    });
  };

  if (fetching) {
    return (
      <div className='flex h-fit flex-col items-center justify-center py-8'>
        <LoadingEmpty />
      </div>
    );
  }

  const getContent = () => {
    if (!cartGroups.items || cartGroups.items.length === 0) {
      return (
        <div className='flex h-fit flex-col items-center justify-center py-8'>
          <Empty>
            <EmptyHeader>
              <EmptyMedia
                variant='icon'
                className='mb-0 flex size-24 rounded-full bg-neutral-200 dark:bg-neutral-800'
              >
                <Icon
                  icon='mdi:cart'
                  className='mt-1.5 ml-1 size-16'
                />
              </EmptyMedia>
              <EmptyTitle className='text-3xl font-bold'>장바구니가 비어있습니다</EmptyTitle>
              <EmptyDescription className='text-lg'>
                아직 장바구니에 담긴 상품이 없습니다. 마음에 드는 상품을 담아보세요!
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className='flex gap-4'>
                <Button
                  variant='default'
                  className='h-10 w-40 text-lg font-bold transition-all hover:-translate-y-0.5 hover:shadow-md'
                  onClick={() => {
                    navigate({ to: '/products' });
                  }}
                >
                  쇼핑하러 가기
                </Button>
                <Button
                  variant='outline'
                  className='h-10 w-40 text-lg font-bold transition-all hover:-translate-y-0.5 hover:shadow-md'
                  onClick={() => {
                    navigate({ to: '/' });
                  }}
                >
                  메인으로
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        </div>
      );
    } else {
      return (
        <>
          <section className='flex flex-col gap-8 py-8'>
            {cartGroups.items.map((groupData) => (
              <CartGroup
                key={groupData.sellerId}
                groupData={groupData}
                onGroupDelete={handleOnDeleteGroup}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                onChangeQuantity={handleUpdateQuantity}
              />
            ))}
          </section>
          <section className='w-full'>
            <Alert
              variant='destructive'
              className={`border-red-500 bg-red-500/70 text-white ${err ? `mb-8 grid-rows-[1fr]` : `mb-0 grid-rows-[0fr] p-0 opacity-0`} transition-all`}
            >
              <AlertCircleIcon className={`${err ? `` : `hidden`}`} />
              <AlertTitle className={`${err ? `` : `hidden`}`}>{err}</AlertTitle>
            </Alert>
          </section>
          <section className='w-full'>
            <Card className='bg-card text-card-foreground p-4'>
              <Item className='flex flex-col items-end gap-4'>
                <div className='flex flex-col items-end gap-2'>
                  <span className='text-muted-foreground text-sm'>선택된 상품</span>
                  <span className='text-lg font-bold'>{selectedItems.size.toLocaleString()}개</span>
                  <span className='text-muted-foreground text-sm'>총 상품 금액</span>
                  <span className='text-2xl font-bold'>
                    {totalPrice ? totalPrice.toLocaleString() : 0}원
                  </span>
                </div>
              </Item>
            </Card>
            <Item className='mb-8 flex flex-col justify-center gap-4 md:flex-row md:items-center'>
              <Button
                variant='outline'
                className='w-full px-16 py-6 text-lg font-bold md:w-auto'
                disabled={selectedItems.size === 0 || submitType !== 'none'}
                onClick={() => {
                  handleOrder('partial');
                  // navigate({
                  //   to: '/order/checkout',
                  //   search: (old) => ({
                  //     ...old,
                  //     from: 'cart',
                  //     itemIds: Array.from(selectedItems).join(','),
                  //   }),
                  // });
                }}
              >
                {submitType === 'partial' ? (
                  <span className='flex items-center gap-2'>
                    선택상품 주문
                    <Spinner />
                  </span>
                ) : (
                  '선택상품 주문하기'
                )}
              </Button>
              <Button
                variant='default'
                className='w-full px-16 py-6 text-lg font-bold md:w-auto'
                disabled={submitType !== 'none'}
                onClick={() => {
                  handleOrder('all');
                  // navigate({
                  //   to: '/order/checkout',
                  //   search: (old) => ({
                  //     ...old,
                  //     from: 'cart',
                  //     itemIds: Array.from(
                  //       cartGroups.items.flatMap((group) =>
                  //         group.items.map((item) => item.cartItemId),
                  //       ),
                  //     ).join(','),
                  //   }),
                  // });
                }}
              >
                {submitType === 'all' ? (
                  <span className='flex items-center gap-2'>
                    전체상품 주문
                    <Spinner />
                  </span>
                ) : (
                  '전체상품 주문하기'
                )}
              </Button>
            </Item>
          </section>
        </>
      );
    }
  };
  return (
    <main className='font-kakao-big mx-auto max-w-4xl font-bold'>
      <header className='flex flex-col justify-center gap-4 border-b px-40 py-4'>
        <h1 className='text-center text-2xl'>장바구니</h1>
        <Breadcrumb className='flex justify-center'>
          <BreadcrumbList>
            <BreadcrumbItem className='text-foreground'>01 장바구니</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className='text-muted-foreground'>02 주문결제</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className='text-muted-foreground'>03 주문완료</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {getContent()}
    </main>
  );
}
