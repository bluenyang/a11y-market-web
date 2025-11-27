// mypage/order/index.jsx

import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getMyOrders } from '@/api/orderApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import OrderPagination from '@/components/order/OrderPagination';
import OrderCard from '@/components/order/OrderCard';
import { Search } from 'lucide-react';

export const Route = createFileRoute('/_needAuth/_mypage/mypage/order/')({
  component: OrderHistoryPage,
});

const ITEMS_PER_PAGE = 5;

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortType, setSortType] = useState('LATEST');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();

        console.log('getMyOrders 응답:', data);
        setOrders(data);
      } catch (err) {
        setError('주문 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  console.log(orders.map(o => o.status));
  console.log(Object.keys(orders[0] || {}));

  // 필터 (개발 중)
  const filteredOrders = orders
    .filter((order) => {
      if (statusFilter === 'ALL') return true;
      return order.orderStatus === statusFilter;
    })
    .filter((order) => {
      if (!searchKeyword) return true;
      return order.orderId?.includes(searchKeyword) || order.receiverName?.includes(searchKeyword) ||  order.orderItems?.some(item =>
      item.productName?.includes(searchKeyword)
  )
    });

  // 정렬
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortType === 'OLDEST') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortType === 'PRICE_HIGH') {
      return b.totalPrice - a.totalPrice;
    }
    if (sortType === 'PRICE_LOW') {
      return a.totalPrice - b.totalPrice;
    }

    // 기본: 최신순
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // 페이지네이션
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = sortedOrders.slice(startIndex, endIndex);

  return (
    <Card className='p-6'>
      {/* 진행 상태 요약 */}
      <div className='mb-6 rounded-xl border bg-white p-6'>
        <p className='mb-4 text-lg font-bold'>진행중인 주문 (최근 3개월)</p>

        <div className='flex items-center justify-between text-center'>
          {[
            { label: '입금대기', key: 'PENDING' },
            { label: '결제완료', key: 'PAID' },
            { label: '상품 준비중', key: 'ACCEPTED' },
            { label: '배송중', key: 'SHIPPED' },
            { label: '배송완료', key: 'DELIVERED' },
            { label: '취소/환불', key: 'CANCELLED' },
          ].map((item, index, arr) => (
            <div
              key={item.key}
              className='flex items-center gap-14'
            >
              <div className='flex flex-col gap-4'>
                <span className='text-md'>{item.label}</span>
                <span className='text-xl font-bold text-blue-600'>
                  {orders.filter((o) => o.orderStatus === item.key).length}
                </span>
              </div>

              {index !== arr.length - 1 && <span className='text-2xl text-gray-300'>{'>'}</span>}
            </div>
          ))}
        </div>
      </div>

      <CardContent className='space-y-6'>
        <h1 className='text-2xl font-bold'>주문 내역</h1>

        {/* 필터 + 검색 */}
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex gap-3'>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className='rounded-md border px-4 py-2'
            >
              <option value='ALL'>전체</option>
              <option value='PENDING'>입금대기</option>
              <option value='PAID'>결제완료</option>
              <option value='ACCEPTED'>상품 준비중</option>
              <option value='SHIPPED'>배송중</option>
              <option value='DELIVERED'>배송완료</option>
              <option value='CANCELLED'>취소</option>
            </select>

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className='rounded-md border px-4 py-2'
            >
              <option value='LATEST'>최신순</option>
              <option value='OLDEST'>오래된순</option>
              <option value='PRICE_HIGH'>금액높은순</option>
              <option value='PRICE_LOW'>금액낮은순</option>
            </select>
          </div>

          <div className='relative w-full sm:w-72'>
            <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-500' />
            <input
              type='text'
              placeholder='상품명 / 주문번호 검색'
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className='w-full rounded-md border py-2 pr-4 pl-10'
            />
          </div>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className='space-y-4'>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <Skeleton
                key={i}
                className='h-[140px] w-full rounded-xl'
              />
            ))}
          </div>
        )}

        {/* 에러 상태 */}
        {error && <div className='py-10 text-center text-red-500'>{error}</div>}

        {/* 정상 상태 */}
        {!loading &&
          !error &&
          currentOrders.map((order) => {
            return (
              <div
                key={order.orderId}
                className='space-y-4 rounded-xl border-2 border-gray-400 bg-white p-6'
              >
                <div className='flex justify-between'>
                  <p className='text-lg font-bold'>주문 날짜: {order.createdAt?.slice(0, 10)}</p>

                  <p className='font-semibold'>총 주문 금액: {order.totalPrice ?? '금액 없음'}원</p>
                </div>

                <p className='text-sm text-gray-500'>
                  주문 ID:{' '}
                  <span aria-label={`주문 ID 전체: ${order.orderId}`}>
                    {order.orderId.slice(0, 8)}...
                  </span>{' '}
                  | 수령인: {order.receiverName} | 배송지: {order.receiverAddr1}
                </p>

                <OrderCard order={order} />
              </div>
            );
          })}

        {/* 페이지네이션 */}
        {!loading && !error &&  (
          <OrderPagination
            currentPage={currentPage}
            totalPages={Math.ceil(sortedOrders.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
