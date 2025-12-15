import { adminApi } from '@/api/admin-api';
import { ProductRowSheet } from '@/components/admin/product-row-sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getProductStatusLabel, getProductStatusStyle } from '@/lib/product-status-mapping';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/_admin/admin/products/')({
  component: RouteComponent,
});

function RouteComponent() {
  // hooks
  const [productData, setProductData] = useState([]);
  const [searchField, setSearchField] = useState('product');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [orderStatus, setOrderStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const status = orderStatus === 'ALL' ? '' : orderStatus;

      const resp = await adminApi.getAllProducts(searchKeyword || '', status || '', page - 1, 20);

      const { totalCount: fetchedTotalCount, products } = resp.data;
      setTotalCount(fetchedTotalCount);
      setProductData(products);
    } catch (err) {
      console.error('Failed to fetch product data:', err);
      toast.error(err.message || '상품 데이터를 불러오는 데 실패했습니다.');
    }
  };

  const handleStatusChange = (productId, newStatus) => {
    setProductData((prevData) =>
      prevData.map((product) =>
        product.productId === productId ? { ...product, productStatus: newStatus } : product,
      ),
    );
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const resetFilters = () => {
    setSearchKeyword('');
    setOrderStatus('ALL');
    setSearchField('product');
  };

  return (
    <div className='max-w-8xl mx-auto w-full px-4 pt-4'>
      <div className='mb-6 text-center text-3xl font-semibold'>상품 관리</div>

      <h3 className='my-6 text-center'>상품 정보를 조회하고 관리할 수 있습니다.</h3>

      <div className='my-8 w-full rounded-xl border p-6 shadow-sm'>
        <div className='mb-4 flex items-end gap-8'>
          <div className='flex w-full items-center'>
            {/* 검색조건 */}
            <div className='flex w-36 flex-col gap-1'>
              <Label
                htmlFor='searchField'
                className='ml-2 text-sm font-semibold'
              >
                검색 조건
              </Label>
              <Select
                id='searchField'
                value={searchField}
                onValueChange={setSearchField}
              >
                <SelectTrigger className='w-34'>
                  {
                    {
                      product: '상품명 및 내용',
                    }[searchField]
                  }
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='product'>상품명 및 내용</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 검색어 */}
            <div className='flex flex-1 flex-col gap-1'>
              <Label
                htmlFor='searchKeyword'
                className='ml-2 text-sm font-semibold'
              >
                검색어
              </Label>
              <Input
                id='searchKeyword'
                className='w-full rounded border p-2'
                placeholder='검색어를 입력하세요'
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
          </div>

          {/* 주문 상태 */}
          <div className='flex w-48 flex-col gap-1'>
            <Label
              htmlFor='orderStatus'
              className='ml-2 text-sm font-semibold'
            >
              주문 상태
            </Label>
            <Select
              id='orderStatus'
              value={orderStatus ?? undefined}
              onValueChange={setOrderStatus}
              placeholder='전체'
            >
              <SelectTrigger className='w-36'>
                <SelectValue placeholder='전체'>
                  {orderStatus === 'ALL' ? '전체' : getProductStatusLabel(orderStatus)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>전체</SelectItem>
                <SelectItem value='PENDING'>{getProductStatusLabel('PENDING')}</SelectItem>
                <SelectItem value='APPROVED'>{getProductStatusLabel('APPROVED')}</SelectItem>
                <SelectItem value='REJECTED'>{getProductStatusLabel('REJECTED')}</SelectItem>
                <SelectItem value='PAUSED'>{getProductStatusLabel('PAUSED')}</SelectItem>
                <SelectItem value='DELETED'>{getProductStatusLabel('DELETED')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex justify-center gap-8'>
          <Button
            variant='default'
            className='w-24 text-base font-bold md:w-32 lg:w-40'
            onClick={handleSearch}
          >
            검색
          </Button>
          <Button
            variant='outline'
            className='w-24 text-base font-bold md:w-32 lg:w-40'
            onClick={resetFilters}
          >
            초기화
          </Button>
        </div>
      </div>

      <div className='mb-10 overflow-hidden rounded-2xl border shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow className='bg-neutral-200 dark:bg-neutral-700'>
              <TableHead className='w-[30%] pl-12'>상품 ID</TableHead>
              <TableHead className='w-[20%] pl-4'>상품명</TableHead>
              <TableHead className='w-[15%] text-center'>가격</TableHead>
              <TableHead className='w-[5%] text-center'>재고</TableHead>
              <TableHead className='w-[10%] text-center'>상태</TableHead>
              <TableHead className='w-[20%] text-center'>승인일자</TableHead>
              <TableHead className='w-[20%] pr-8 text-center'>상세정보</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productData.map((product) => (
              <TableRow key={product.productId}>
                <TableCell className='pl-8'>{product.productId}</TableCell>
                <TableCell className='max-w-0 truncate'>{product.productName}</TableCell>
                <TableCell className='text-center'>
                  {product.productPrice?.toLocaleString('ko-KR')}원
                </TableCell>
                <TableCell className='text-center'>{product.productStock}</TableCell>
                <TableCell className='text-center'>
                  <Badge className={getProductStatusStyle(product.productStatus)}>
                    {getProductStatusLabel(product.productStatus)}
                  </Badge>
                </TableCell>
                <TableCell className='text-center'>
                  {new Date(product.submitDate)?.toLocaleDateString('ko-KR') || 'N/A'}
                </TableCell>
                <TableCell className='pr-8 text-center'>
                  <ProductRowSheet
                    product={product}
                    onStatusChange={handleStatusChange}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
