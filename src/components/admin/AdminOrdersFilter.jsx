import { useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';

export default function AdminOrdersFilter({ onFilterChange }) {
  const [searchField, setSearchField] = useState('userName');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const handleSearch = () => onFilterChange({ searchField, searchKeyword, orderStatus, dateRange });
  const resetFilters = () => {
    setSearchField('userName');
    setSearchKeyword('');
    setOrderStatus(null);
    setDateRange({ from: null, to: null });
    onFilterChange({
      searchField: '',
      searchKeyword: '',
      orderStatus: null,
      dateRange: { from: null, to: null },
    });
  };

  return (
    <div className='my-8 w-full rounded-xl border bg-white p-6 shadow-sm'>
      <div className='mb-4 flex flex-wrap items-end gap-8'>
        <div className='flex items-center'>
          {/* 검색조건 */}
          <div className='flex w-36 flex-col gap-1'>
            <label className='ml-2 text-sm font-semibold'>검색 조건</label>
            <Select
              value={searchField}
              onValueChange={setSearchField}
            >
              <SelectTrigger className='w-34'>
                {
                  {
                    userName: '주문자명',
                    receiverName: '수령자명',
                    userPhone: '주문자 전화번호',
                    receiverPhone: '수령자 전화번호',
                    orderId: '주문번호',
                  }[searchField]
                }
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='userName'>주문자명</SelectItem>
                <SelectItem value='receiverName'>수령자명</SelectItem>
                <SelectItem value='userPhone'>주문자 전화번호</SelectItem>
                <SelectItem value='receiverPhone'>수령자 전화번호</SelectItem>
                <SelectItem value='orderId'>주문번호</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 검색어 */}
          <div className='flex w-64 flex-col gap-1'>
            <label className='ml-2 text-sm font-semibold'>검색어</label>
            <input
              className='w-full rounded border p-2'
              placeholder='검색어를 입력하세요'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* 주문일자 */}
        <div className='flex w-64 flex-col gap-1'>
          <label className='ml-2 text-sm font-semibold'>주문일자</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-between'
              >
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, 'yyyy-MM-dd')} ~ ${format(dateRange.to, 'yyyy-MM-dd')}`
                  : '기간 선택'}
                <CalendarIcon className='ml-2 h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
              <Calendar
                locale={ko}
                mode='range'
                selected={dateRange.from && dateRange.to ? dateRange : undefined}
                onSelect={setDateRange}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 주문 상태 */}
        <div className='flex w-48 flex-col gap-1'>
          <label className='ml-2 text-sm font-semibold'>주문 상태</label>
          <Select
            value={orderStatus ?? undefined}
            onValueChange={setOrderStatus}
            placeholder='전체'
          >
            <SelectTrigger className='w-36'>{orderStatus ?? '전체'}</SelectTrigger>
            <SelectContent>
              <SelectItem value='결제대기'>결제대기</SelectItem>
              <SelectItem value='결제완료'>결제완료</SelectItem>
              <SelectItem value='주문승인'>주문승인</SelectItem>
              <SelectItem value='주문거부'>주문거부</SelectItem>
              <SelectItem value='배송중'>배송중</SelectItem>
              <SelectItem value='배송완료'>배송완료</SelectItem>
              <SelectItem value='주문취소'>주문취소</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex justify-end gap-3'>
        <Button
          className='bg-black text-white'
          onClick={handleSearch}
        >
          검색
        </Button>
        <Button
          className='border border-black bg-white text-black hover:text-white'
          onClick={resetFilters}
        >
          초기화
        </Button>
      </div>
    </div>
  );
}
