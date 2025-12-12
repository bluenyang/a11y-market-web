// components/order/OrderCard.jsx

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { statusLabel } from '@/constants/order-item-status';
import { useNavigate } from '@tanstack/react-router';
import { ClipboardList } from 'lucide-react';
import { ImageWithFallback } from '../image-with-fallback';
import { Button } from '../ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../ui/item';

export default function OrderCard({ order }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>주문 번호: {order.orderId}</h3>
          <span className='text-sm text-neutral-700'>
            {`주문일: ${new Date(order.createdAt).toLocaleDateString('ko-KR')}`}
          </span>
        </div>
      </CardHeader>
      <CardContent className='space-y-2'>
        {order.orderItems?.map((item) => {
          const badge = statusLabel(item.orderItemStatus);
          return (
            <Item
              key={item.orderItemId}
              className='border-border cursor-pointer space-y-2 rounded-lg border p-4 hover:shadow-md'
            >
              <ItemMedia>
                <ImageWithFallback
                  src={item.productImageUrl}
                  alt={item.productName}
                  className='aspect-3/2 h-16 rounded-md object-cover'
                  onClick={() => {
                    navigate({
                      to: `/products/${item.productId}`,
                    });
                  }}
                />
              </ItemMedia>
              <ItemContent className='min-w-0 space-y-2'>
                <ItemTitle
                  className='flex w-full items-center gap-4 text-lg font-bold'
                  onClick={() => {
                    navigate({
                      to: `/products/${item.productId}`,
                    });
                  }}
                >
                  <ClipboardList className='shrink-0' />
                  <span className='min-w-0 flex-1 truncate'>
                    {`상품 이름: ${item.productName}`}
                  </span>
                  <Badge className={`${badge.className} shrink-0`}>{badge.label}</Badge>
                </ItemTitle>
                <ItemDescription>
                  {`상품 수: ${item.productQuantity}개 | 총 금액: ${item.productTotalPrice.toLocaleString('ko-KR')}원`}
                </ItemDescription>
              </ItemContent>
              <ItemContent>
                <ItemActions>
                  <Button
                    variant='outline'
                    className='h-8 w-32 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md'
                    onClick={() => {
                      navigate({
                        to: `/mypage/orders/${item.orderItemId}`,
                      });
                    }}
                  >
                    상세 보기
                  </Button>
                </ItemActions>
              </ItemContent>
            </Item>
          );
        })}
      </CardContent>
      <CardFooter>
        <div className='flex w-full justify-between'>
          <span className='text-lg font-bold'>{`총 상품 수: ${order.orderItems.length}개`}</span>
          <span className='text-lg font-bold'>
            {`총 주문 금액: ${order.totalPrice.toLocaleString('ko-KR')}원`}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
