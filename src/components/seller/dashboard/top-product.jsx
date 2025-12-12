import { sellerApi } from '@/api/seller-api';
import { Badge } from '@/components/ui/badge';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ChartColumnBig } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/** 판매 상위 상품 목데이터 */
const MOCK_TOP_PRODUCTS = [
  { name: '저염 갓김치 500g', sold: 120 },
  { name: '접이식 지팡이', sold: 95 },
  { name: '무설탕 건강즙', sold: 80 },
  { name: '확대 독서용 돋보기', sold: 54 },
];

export const DashboardTopProduct = () => {
  const [topProducts, setTopProducts] = useState([]);

  const format = (number) => new Intl.NumberFormat('ko-KR').format(number);

  useEffect(() => {
    (async () => {
      try {
        const resp = await sellerApi.getTopProducts(4);

        const formattedData = resp.data.map((item) => ({
          name: item.productName,
          sold: item.totalQuantitySold,
        }));
        setTopProducts(formattedData);
      } catch (error) {
        console.error('Failed to fetch top products:', error);
      }
    })();
  }, []);

  return (
    <section className='bg-card mb-10 rounded-2xl border p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-sm font-semibold'>판매 상위 상품</h2>
        <Badge
          variant='outline'
          className='text-[11px]'
        >
          판매 수량 기준
        </Badge>
      </div>

      <div className='h-64'>
        {topProducts.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia
                variant='icon'
                className='mb-0 flex size-24 rounded-full bg-neutral-200 dark:bg-neutral-800'
              >
                <ChartColumnBig className='size-12' />
              </EmptyMedia>
              <EmptyTitle className='w-full text-3xl font-bold'>판매 데이터가 없습니다.</EmptyTitle>
              <EmptyDescription className='text-lg'>판매된 상품이 없습니다.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ResponsiveContainer
            width='100%'
            height='100%'
          >
            <BarChart
              data={topProducts}
              margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='name'
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor='end'
              />
              <YAxis />
              <Tooltip
                formatter={(value) => `${format(value)}개`}
                labelFormatter={(label) => `상품: ${label}`}
              />
              <Bar
                dataKey='sold'
                fill='#4b5563'
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};
