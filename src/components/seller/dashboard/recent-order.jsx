import { sellerApi } from '@/api/seller-api';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

/** 요약 정보 목데이터 (나중에 API 연동) */
const MOCK_DASHBOARD = {
  totalSales: 3564000,
  totalOrders: 142,
  totalProductsSold: 512,
  totalCancelled: 7,
  recentOrders: [
    { id: 'O-4532', product: '저염 갓김치 500g', price: 8900, status: '결제완료' },
    { id: 'O-4533', product: '접이식 지팡이', price: 15900, status: '배송중' },
    { id: 'O-4534', product: '무설탕 건강즙', price: 12900, status: '배송완료' },
  ],
};

export const DashboardRecentOrder = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await sellerApi.getRecentOrders(0, 3);
        console.log('Recent Orders Response:', resp.data);

        const formattedData = resp.data.map((item) => ({
          id: item.orderId,
          product: item.productName,
          price: item.productPrice * item.productQuantity,
          status: item.orderStatus,
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
        {data.map((order) => (
          <div
            key={order.id}
            className='flex items-center justify-between border-b py-3 last:border-none'
          >
            <div>
              <p className='text-sm font-medium'>{order.product}</p>
              <p className='text-muted-foreground text-xs'>주문번호: {order.id}</p>
            </div>

            <div className='text-right'>
              <p className='font-medium'>{format(order.price)}원</p>
              <Badge
                variant='outline'
                className='mt-1'
              >
                {order.status}
              </Badge>
            </div>
          </div>
        ))}

        <div className='mt-4 text-right'>
          <Button
            asChild
            size='sm'
            variant='outline'
          >
            <Link to='/seller/orders'>전체 주문 보기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
