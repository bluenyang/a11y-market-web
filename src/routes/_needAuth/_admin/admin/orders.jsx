import { createFileRoute } from '@tanstack/react-router';
import { useState, Fragment } from 'react';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import OrderItemsDialog from '@/components/admin/OrderItemsDialog';
import AdminOrdersFilter from '@/components/admin/AdminOrdersFilter';

export const Route = createFileRoute('/_needAuth/_admin/admin/orders')({
  component: RouteComponent,
});

const dummyOrders = [
  {
    orderId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    userName: '홍길동',
    userEmail: 'hong@example.com',
    userPhone: '010-1234-5678',
    receiverName: '김철수',
    receiverPhone: '010-8765-4321',
    receiverZipcode: '12345',
    receiverAddr1: '서울시 강남구',
    receiverAddr2: '역삼동 123-45',
    orderStatus: '배송중',
    totalPrice: 50000,
    createdAt: '2025-12-02T04:11:40.323Z',
    orderItems: [
      {
        orderItemId: '1',
        productId: 'p1',
        productName: '상품 A',
        productPrice: 20000,
        productQuantity: 1,
        productTotalPrice: 20000,
        productImageUrl: 'https://via.placeholder.com/50',
        orderItemStatus: 'ORDERED',
      },
      {
        orderItemId: '2',
        productId: 'p2',
        productName: '상품 B',
        productPrice: 30000,
        productQuantity: 1,
        productTotalPrice: 30000,
        productImageUrl: 'https://via.placeholder.com/50',
        orderItemStatus: 'ORDERED',
      },
    ],
  },
];

function RouteComponent() {
  const [expandedRows, setExpandedRows] = useState([]);
  const [ordersState, setOrdersState] = useState(
    dummyOrders.map((order) => ({
      ...order,
      orderStatusState: order.orderStatus,
      itemStatuses: Object.fromEntries(
        order.orderItems.map((i) => [i.orderItemId, i.orderItemStatus]),
      ),
      savedOrderStatus: order.orderStatus,
      savedItemStatuses: Object.fromEntries(
        order.orderItems.map((i) => [i.orderItemId, i.orderItemStatus]),
      ),
    })),
  );

  const toggleRow = (orderId) => {
    setExpandedRows((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId],
    );
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrdersState((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, orderStatusState: newStatus } : order,
      ),
    );
  };

  const handleSave = (orderId) => {
    setOrdersState((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              savedOrderStatus: order.orderStatusState,
              savedItemStatuses: { ...order.itemStatuses },
            }
          : order,
      ),
    );
    alert('변경사항이 저장되었습니다.');
  };

  const handleReset = (orderId) => {
    setOrdersState((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              orderStatusState: order.savedOrderStatus,
              itemStatuses: { ...order.savedItemStatuses },
            }
          : order,
      ),
    );
  };

  return (
    <div className='max-w-8xl mx-auto w-full px-4 pt-4'>
      <div className='font-kakao-big mb-6 text-center text-3xl font-semibold'>주문 관리</div>

      <h3 className='font-kakao-big my-6 text-center'>
        주문 상태, 기간 등을 기준으로 주문을 조회하고 관리할 수 있습니다.
      </h3>

      <AdminOrdersFilter/>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>주문자명</TableHead>
            <TableHead className='text-center'>주문번호</TableHead>
            <TableHead className='text-center'>주문일</TableHead>
            <TableHead className='text-center'>주문상태</TableHead>
            <TableHead className='text-center'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersState.map((order) => (
            <Fragment key={order.orderId}>
              <TableRow
                className='cursor-pointer hover:bg-gray-100'
                onClick={() => toggleRow(order.orderId)}
              >
                <TableCell className='text-center'>{order.userName}</TableCell>
                <TableCell className='text-center'>{order.orderId}</TableCell>
                <TableCell className='text-center'>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className='text-center'>
                  <div className='mt-2 flex justify-center gap-2'>
                    <Select
                      value={order.orderStatusState}
                      onValueChange={(val) => handleOrderStatusChange(order.orderId, val)}
                    >
                      <SelectTrigger>{order.orderStatusState}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value='주문접수'>주문접수</SelectItem>
                        <SelectItem value='배송준비중'>배송준비중</SelectItem>
                        <SelectItem value='배송중'>배송중</SelectItem>
                        <SelectItem value='배송완료'>배송완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  <div className='mt-2 flex justify-center gap-2'>
                    <Button onClick={() => handleSave(order.orderId)}>저장</Button>
                    <Button
                      className='border border-black bg-white text-black hover:text-white'
                      onClick={() => handleReset(order.orderId)}
                    >
                      초기화
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {expandedRows.includes(order.orderId) && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='bg-gray-100 p-4'
                  >
                    <div className='space-y-2'>
                      <div className='flex gap-2'>
                        <dt className='font-semibold'>수령인:</dt>
                        <dd>{order.receiverName}</dd>
                      </div>
                      <div className='flex gap-2'>
                        <dt className='font-semibold'>주문자 전화번호:</dt>
                        <dd>{order.userPhone}</dd>
                      </div>
                      <div className='flex gap-2'>
                        <dt className='font-semibold'>수령인 전화번호:</dt>
                        <dd>{order.receiverPhone}</dd>
                      </div>
                      <div className='flex gap-2'>
                        <dt className='font-semibold'>배송지 주소:</dt>
                        <dd>{`${order.receiverZipcode} ${order.receiverAddr1} ${order.receiverAddr2}`}</dd>
                      </div>
                      <div className='flex items-center justify-between gap-2'>
                        <div className='flex gap-2'>
                          <dt className='font-semibold'>총 결제 금액:</dt>
                          <dd>{order.totalPrice.toLocaleString()}원</dd>
                        </div>
                        {/* 주문 상품 목록 테이블 */}
                        <OrderItemsDialog orderItems={order.orderItems} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
