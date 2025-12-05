import { sellerApi } from '@/api/seller-api';
import { Link } from '@tanstack/react-router';
import { ClipboardList } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '../ui/item';
import { DashboardCard } from './dashbord-card';

export const DashboardStatSection = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState({
    sellerName: '',
    sellerId: '',
    totalRevenue: 0,
    totalOrderCount: 0,
    refundRate: 0.0,
    confirmedRate: 0.0,
  });

  useEffect(() => {
    (async () => {
      try {
        const resp = await sellerApi.getDashboardStats();
        setData(resp.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    })();
  }, []);

  const format = (num) => {
    return num.toLocaleString();
  };

  return (
    <section className='mb-4 flex flex-col gap-4'>
      <Item
        variant='outline'
        className='my-4 rounded-xl p-8 shadow-sm transition-shadow hover:shadow-md'
      >
        <ItemContent>
          <ItemTitle>
            <h1 className='text-2xl'>{`${data.sellerName}`}</h1>
          </ItemTitle>
          <ItemDescription className='text-gray-600'>{user?.userEmail}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Link
            asChild
            to='/seller/products'
          >
            <Button
              variant='outline'
              size='lg'
              className='px-4 py-2 text-base font-bold transition-all hover:cursor-pointer hover:shadow-md'
            >
              <ClipboardList className='size-6' />
              상품 관리
            </Button>
          </Link>
        </ItemActions>
      </Item>
      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard
          title='총 매출액'
          value={`${format(data.totalRevenue)}원`}
        />
        <DashboardCard
          title='총 주문 수'
          value={`${format(data.totalOrderCount)}건`}
        />
        <DashboardCard
          title='구매 확정률'
          value={`${data.confirmedRate.toFixed(2)}%`}
        />
        <DashboardCard
          title='취소/환불 비율'
          value={`${data.refundRate.toFixed(2)}%`}
        />
      </div>
    </section>
  );
};
