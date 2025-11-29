import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

/** /seller/dashboard : 판매자 대시보드 */
export const Route = createFileRoute('/_needAuth/seller/dashboard')({
  component: SellerDashboardPage,
});

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

/** 연도/월별 매출 추이 목데이터 */
const MOCK_SALES_BY_MONTH = {
  '2024-11': [
    { date: '11-01', sales: 180000 },
    { date: '11-05', sales: 120000 },
    { date: '11-10', sales: 240000 },
    { date: '11-15', sales: 300000 },
    { date: '11-20', sales: 150000 },
    { date: '11-25', sales: 390000 },
  ],
  '2024-12': [
    { date: '12-01', sales: 210000 },
    { date: '12-03', sales: 350000 },
    { date: '12-06', sales: 280000 },
    { date: '12-10', sales: 410000 },
  ],
};

/** 판매 상위 상품 목데이터 */
const MOCK_TOP_PRODUCTS = [
  { name: '저염 갓김치 500g', sold: 120 },
  { name: '접이식 지팡이', sold: 95 },
  { name: '무설탕 건강즙', sold: 80 },
  { name: '확대 독서용 돋보기', sold: 54 },
];

function SellerDashboardPage() {
  const data = MOCK_DASHBOARD;

  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('11');

  const currentKey = `${selectedYear}-${selectedMonth}`;
  const salesTrend = MOCK_SALES_BY_MONTH[currentKey] || [];
  const topProducts = MOCK_TOP_PRODUCTS;

  const format = (number) => new Intl.NumberFormat('ko-KR').format(number);

  return (
    <main className='font-kakao-big-sans mx-auto max-w-6xl px-4 py-8'>
      {/* 헤더 */}
      <section className='mb-10 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>판매자 대시보드</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            내 판매 정보를 한눈에 확인할 수 있습니다.
          </p>
        </div>

        <Button asChild>
          <Link to='/seller/products'>내 상품 관리</Link>
        </Button>
      </section>

      {/* 요약 카드 */}
      <section className='mb-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard
          title='총 매출액'
          value={`${format(data.totalSales)}원`}
        />
        <DashboardCard
          title='총 주문 수'
          value={`${format(data.totalOrders)}건`}
        />
        <DashboardCard
          title='판매 수량'
          value={`${format(data.totalProductsSold)}개`}
        />
        <DashboardCard
          title='취소 건수'
          value={`${format(data.totalCancelled)}건`}
        />
      </section>

      {/* 기간 필터 + 매출 추이 차트 */}
      <section className='bg-card mb-8 rounded-2xl border p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <div>
            <h2 className='text-sm font-semibold'>매출 추이</h2>
            <p className='text-muted-foreground mt-0.5 text-xs'>
              선택한 연도와 월 기준 일별 매출액입니다.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className='h-8 rounded border px-3 text-xs'
            >
              <option value='2024'>2024년</option>
              <option value='2023'>2023년</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className='h-8 rounded border px-3 text-xs'
            >
              <option value='01'>1월</option>
              <option value='02'>2월</option>
              <option value='11'>11월</option>
              <option value='12'>12월</option>
            </select>
          </div>
        </div>

        <div className='h-64'>
          <ResponsiveContainer
            width='100%'
            height='100%'
          >
            <LineChart
              data={salesTrend}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickFormatter={(value) => `${value / 1000}k`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => `${format(value)}원`}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Line
                type='monotone'
                dataKey='sales'
                stroke='#4b5563'
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 판매 상위 상품 Bar 차트 */}
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
        </div>
      </section>

      {/* 하단: 최근 주문 / 빠른 작업 */}
      <div className='grid gap-8 lg:grid-cols-2'>
        <Card className='rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-base'>최근 주문</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentOrders.map((order) => (
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

        <Card className='rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-base'>빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-3'>
            <Button
              asChild
              className='w-full justify-start'
              variant='outline'
            >
              <Link to='/seller/products/new'>상품 등록하기</Link>
            </Button>

            <Button
              asChild
              className='w-full justify-start'
              variant='outline'
            >
              <Link to='/seller/products'>내 상품 관리</Link>
            </Button>

            <Button
              asChild
              className='w-full justify-start'
              variant='outline'
            >
              <Link to='/seller/claims'>취소/반품 관리</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

/** 재사용 요약 카드 */
function DashboardCard({ title, value }) {
  return (
    <Card className='rounded-2xl'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-muted-foreground text-sm'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  );
}
