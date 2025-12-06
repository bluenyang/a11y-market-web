import axiosInstance from '@/api/axios-instance';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Icon } from '@iconify/react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_need-auth/_mypage/mypage/')({
  component: RouteComponent,
});

function RouteComponent() {
  const orderMenuItems = [
    { label: '전체', path: '/mypage/orders' },
    { label: '배송중', path: '/mypage/orders/shipping' },
    { label: '배송완료', path: '/mypage/orders/completed' },
    { label: '취소/환불', path: '/mypage/orders/canceled' },
  ];

  const [orderList, setOrderList] = useState([]);
  const [activeOrderMenu, setActiveOrderMenu] = useState(orderMenuItems[0].path);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const resp = await axiosInstance.get('/v1/users/me/orders');
      setOrderList(resp.data);
      // setOrderList([]);
    })();
  }, []);

  return (
    <>
      <section className='flex w-full flex-col gap-4 bg-neutral-300 px-8 pt-8'>
        <h2 className='text-3xl font-bold text-neutral-800'>주문 내역</h2>
        <div className='hidden w-full flex-row items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 xl:flex 2xl:w-xl dark:border-neutral-600 dark:bg-neutral-700 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400'>
          <input
            type='text'
            placeholder='검색어를 입력하세요'
            className='h-full flex-1 bg-transparent text-xl outline-none'
            aria-label='검색어 입력'
          />
          <Link
            to='/search'
            className='ml-2 text-neutral-600 hover:text-blue-500 dark:text-neutral-300 dark:hover:text-blue-400'
            aria-label='검색하기 버튼'
          >
            <Icon
              icon='mdi:magnify'
              width={20}
              height={20}
            />
          </Link>
        </div>
        <nav className='flex w-full'>
          {orderMenuItems.map((item) => {
            const isActive = activeOrderMenu === item.path;
            return (
              <Button
                key={item.path}
                variant='ghost'
                className={`relative rounded-md px-8 py-5 text-lg font-medium transition-colors hover:bg-transparent ${isActive ? `text-neutral-900` : `text-neutral-600 hover:text-neutral-900`} `}
                onClick={() => setActiveOrderMenu(item.path)}
              >
                {isActive && (
                  <motion.span
                    layoutId='order-menu-active-bg'
                    className='absolute inset-0 border-b-4 border-neutral-900'
                    style={{ zIndex: 0 }}
                    transition={{ type: 'spring', stiffness: 530, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? `font-bold` : ``}`}>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </section>
      <section className='flex w-full flex-1 flex-col p-8'>
        {orderList.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'>
                  <Icon
                    icon='mdi:clipboard-text-history'
                    className='size-16'
                  />
                </EmptyMedia>
                <EmptyTitle className='text-3xl font-bold'>주문내역이 없습니다.</EmptyTitle>
                <EmptyDescription className='text-lg'>
                  아직 주문 내역이 없습니다. 마음에 드는 상품을 골라 주문해보세요!
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
        ) : (
          <div className='flex flex-col gap-4'>
            {orderList?.map((order) => {
              return (
                <Item
                  key={order.orderId}
                  variant='outline'
                  className='border-neutral-500'
                >
                  <ItemContent>
                    <ItemTitle className='w-full justify-between text-xl font-bold'>
                      <span>{`주문 날짜: ${new Date(order.createdAt)?.toLocaleDateString(`ko-KR`)}`}</span>
                      <span>{`총 주문 금액: ${order.totalPrice?.toLocaleString()}원`}</span>
                    </ItemTitle>
                    <ItemDescription className='mb-4 text-lg'>
                      {`주문 ID: ${order.orderId.split(`-`)[4]} | 수령인: ${order.receiverName} | 배송지: ${order.receiverAddr1}`}
                    </ItemDescription>
                    <div className='flex flex-col gap-2'>
                      {order.orderItems?.map((item) => (
                        <Item
                          key={item.orderItemId}
                          variant='outline'
                          className='shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
                        >
                          <ItemMedia>
                            <img
                              src={item.productImageUrl}
                              alt={item.productName}
                              className='aspect-3/2 h-24 rounded-md object-cover'
                            />
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>
                              <h4 className='text-primary text-xl font-bold'>{item.productName}</h4>
                            </ItemTitle>
                            <div className='flex flex-1 flex-col justify-center'>
                              <p className='text-md'>
                                {
                                  '가격: ${item.productPrice?.toLocaleString()}원 | 수량: ${item.productQuantity}'
                                }
                              </p>
                              <p className='text-md'>
                                {'총액: ${item.productTotalPrice?.toLocaleString()}원'}
                              </p>
                              <p className='text-md'>
                                {'상태: ${getOrderItemStatusLabel(item.orderItemStatus)}'}
                              </p>
                            </div>
                          </ItemContent>
                          <ItemActions>
                            <Button
                              variant='outline'
                              className='h-10 w-32 text-lg font-bold hover:cursor-pointer hover:bg-neutral-200'
                              onClick={() => {
                                navigate({ to: `/mypage/order/${item.orderItemId}` });
                              }}
                            >
                              주문 상세
                            </Button>
                          </ItemActions>
                        </Item>
                      ))}
                    </div>
                  </ItemContent>
                </Item>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
