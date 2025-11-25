// src/routes/cart.jsx
import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/api/axiosInstance';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CartGroup } from '@/components/cart-group';
import { Card } from '@/components/ui/card';
import { Item } from '@/components/ui/item';

function CartPage() {
  const [cartGroups, setCartGroups] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  // --- 체크박스 & 수량 변경 로직 ---

  useEffect(() => {
    const fetchCartData = async () => {
      const resp = await axiosInstance.get('/v1/cart/me');
      setCartGroups(resp.data);
      setTotalPrice(resp.data.total || 0);
    };

    fetchCartData();
  }, []);

  const getContent = () => {
    if (!cartGroups.items || cartGroups.items.length === 0) {
      return (
        <div className='mx-40 flex h-fit flex-col items-center justify-center py-8'>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <Icon
                  icon='mdi:cart'
                  className='h-8 w-8'
                />
              </EmptyMedia>
              <EmptyTitle>장바구니가 비어있습니다.</EmptyTitle>
              <EmptyDescription>
                아직 장바구니에 담긴 상품이 없습니다. 마음에 드는 상품을 담아보세요!
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className='flex gap-2'>
                <Button
                  variant='default'
                  onClick={() => {
                    navigate({ to: '/products' });
                  }}
                >
                  쇼핑하러 가기
                </Button>
                <Button
                  variant='outline'
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
        <div className='mx-40 flex py-8'>
          {cartGroups.items.map((groupData) => (
            <CartGroup
              key={groupData.sellerId}
              groupData={groupData}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          ))}
        </div>
      );
    }
  };
  return (
    <main className='font-kakao-big font-bold'>
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
      <section className='min-h-[60vh]'>
        {getContent()}
        <Card className='mx-40 bg-neutral-100 p-4'>
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
        <Item className='mx-40 mb-8 flex justify-center gap-4'>
          <Button
            variant='outline'
            className='px-16 py-6 text-lg font-bold'
            disabled={selectedItems.size === 0}
            onClick={() => {
              navigate({
                to: '/_needAuth/order/new',
                search: (old) => ({
                  ...old,
                  from: 'cart',
                  itemIds: Array.from(selectedItems).join(','),
                }),
              });
            }}
          >
            선택상품 주문하기
          </Button>
          <Button
            variant='default'
            className='px-16 py-6 text-lg font-bold'
            disabled={selectedItems.size === 0}
            onClick={() => {
              navigate({
                to: '/_needAuth/order/new',
                search: (old) => ({
                  ...old,
                  from: 'cart',
                  itemIds: Array.from(selectedItems).join(','),
                }),
              });
            }}
          >
            전체상품 주문하기
          </Button>
        </Item>
      </section>
    </main>
  );
}

// TanStack Router – /cart 경로
export const Route = createFileRoute('/_needAuth/cart/')({
  component: CartPage,
});
