import { sellerApi } from '@/api/seller-api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { statusLabel } from '@/constants/order-item-status';
import { Link } from '@tanstack/react-router';
import { ClipboardClock } from 'lucide-react';
import { useEffect, useState } from 'react';

export const DashboardRecentOrder = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await sellerApi.getRecentOrders(0, 3);

        const formattedData = resp.data.map((item) => ({
          id: item.orderId,
          itemId: item.orderItemId,
          product: item.productName,
          price: item.productPrice * item.productQuantity,
          status: item.orderItemStatus,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch recent orders:', error);
      }
    })();
  }, []);

  const format = (number) => new Intl.NumberFormat('ko-KR').format(number);

  return (
    <Card className='rounded-2xl'>
      <CardHeader>
        <CardTitle className='text-base'>최근 주문</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia
                variant='icon'
                className='mb-0 flex size-24 rounded-full bg-neutral-200 dark:bg-neutral-800'
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
            {data.map((order) => {
              const badge = statusLabel(order.status);
              return (
                <div
                  key={order.itemId}
                  className='flex items-center justify-between border-b py-3 last:border-none'
                >
                  <div>
                    <p className='text-sm font-medium'>{order.product}</p>
                    <p className='text-muted-foreground text-xs'>주문번호: {order.id}</p>
                  </div>

                  <div className='text-right'>
                    <p className='font-medium'>{format(order.price)}원</p>
                    <Badge
                      variant='secondary'
                      className={`mt-1 ${badge.className}`}
                    >
                      {badge.label}
                    </Badge>
                  </div>
                </div>
              );
            })}

            <div className='mt-4 text-right'>
              <Button
                asChild
                size='sm'
                variant='outline'
              >
                <Link to='/seller/orders'>전체 주문 보기</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
