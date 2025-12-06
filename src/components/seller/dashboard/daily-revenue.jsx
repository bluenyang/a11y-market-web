import { sellerApi } from '@/api/seller-api';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/** 연도/월별 매출 추이 목데이터 */
const MOCK_SALES_BY_MONTH = {
  '2025-11': [
    { date: '11-01', sales: 180000 },
    { date: '11-05', sales: 120000 },
    { date: '11-10', sales: 240000 },
    { date: '11-15', sales: 300000 },
    { date: '11-20', sales: 150000 },
    { date: '11-25', sales: 390000 },
  ],
  '2025-12': [{ date: '12-03', sales: 350000 }],
};

export const DashboardDailyRevenue = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('11');

  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await sellerApi.getDailyRevenue(selectedYear, selectedMonth);

        const formattedData = resp.data.map((item) => ({
          date: new Date(item.orderDate).toLocaleDateString('ko-KR'),
          sales: item.dailyRevenue,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('일별 매출 데이터 조회 실패:', error);
      }
    })();
  }, [selectedYear, selectedMonth]);

  const format = (number) => new Intl.NumberFormat('ko-KR').format(number);

  return (
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
            <option value='2024'>2025년</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='h-8 rounded border px-3 text-xs'
          >
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
            data={data}
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
  );
};
