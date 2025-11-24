import { createFileRoute } from '@tanstack/react-router';
import React, { useState, Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_needAuth/_admin/admin/sellers')({
  component: RouteComponent,
});

function RouteComponent() {
  // 임시 더미 데이터
  const [sellers, setSellers] = useState([
    {
      sellerId: 1,
      name: '홍길동',
      company: '길동스토어',
      businessNumber: '123-45-67890',
      sellerIntro: '길동스토어입니다.',
    },
    {
      sellerId: 2,
      name: '이몽룡',
      company: '몽룡스토어',
      businessNumber: '987-65-43210',
      sellerIntro: '몽룡스토어입니다.',
    },
    {
      sellerId: 3,
      name: '성춘향',
      company: '춘향스토어',
      businessNumber: '111-22-33333',
      sellerIntro: '춘향스토어입니다.',
    },
  ]);

  // 승인/거절 상태 관리
  const [sellerStatus, setSellerStatus] = useState({});

  // 드롭다운 확장 관리
  const [expandedRows, setExpandedRows] = useState([]);

  // 승인 핸들러
  const handleApprove = (id) => {
    setSellerStatus((prev) => ({ ...prev, [id]: 'approved' }));
  };

  // 거절 핸들러
  const handleReject = (id) => {
    setSellerStatus((prev) => ({ ...prev, [id]: 'rejected' }));
  };

  // 취소 핸들러
  const handleCancel = (id) => {
    setSellerStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[id];
      return newStatus;
    });
  };

  // 판매자 정보 상세보기
  const toggleRow = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  return (
    <>
      <div className='font-kakao-big mb-10 text-center text-3xl font-semibold'>승인대기 판매자</div>
      <h3 className='font-kakao-big my-6 text-center'>
        신규 가입 또는 재심사가 필요 판매자의 정보를 검토하고 가입 승인 여부를 결정할 수 있습니다.
      </h3>

      <div className='max-w-8xl font-kakao-big mx-auto w-full px-4 pt-4'>
        <Table aria-label='승인대기 판매자 목록'>
          <TableHeader aria-label='승인대기 판매자 목록 첫번째 행'>
            <TableRow
              className='hover:bg-transparent'
              aria-label='승인대기 판매자 목록 머리글 행'
            >
              <TableHead className='text-center font-semibold'>판매자 이름</TableHead>
              <TableHead className='text-center font-semibold'>판매자 ID</TableHead>
              <TableHead className='font-semibold'>상호명 / 사업자등록번호</TableHead>
              <TableHead className='text-center font-semibold'>승인/거절</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sellers.map((seller) => (
              <Fragment key={seller.sellerId}>
                <TableRow
                  id={`seller-row-${seller.sellerId}`}
                  className='cursor-pointer hover:bg-gray-100'
                  onClick={() => toggleRow(seller.sellerId)}
                  aria-expanded={expandedRows.includes(seller.sellerId)}
                  aria-controls={`seller-details-${seller.sellerId}`}
                  aria-label='판매자 상세보기 토글'
                  role='row'
                >
                  <TableCell className='text-center'>{seller.name}</TableCell>
                  <TableCell className='text-center'>{seller.sellerId}</TableCell>
                  <TableCell>{`${seller.company} / ${seller.businessNumber}`}</TableCell>
                  <TableCell className='space-x-2 text-center'>
                    {!sellerStatus[seller.sellerId] ? (
                      <>
                        <Button
                          variant='default'
                          className='border border-gray-500 bg-white text-black hover:bg-gray-100'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(seller.sellerId);
                          }}
                          aria-label='판매자 신청 승인 버튼'
                        >
                          승인
                        </Button>
                        <Button
                          variant='default'
                          className='bg-black text-white hover:bg-gray-500'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(seller.sellerId);
                          }}
                          aria-label='판매자 신청 거절 버튼'
                        >
                          거절
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className='px-4 py-2 font-medium'>
                          {sellerStatus[seller.sellerId] === 'approved' ? '승인됨' : '거절됨'}
                        </span>
                        <Button
                          variant='default'
                          className='bg-black text-white hover:bg-gray-500'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(seller.sellerId);
                          }}
                          aria-label='판매자 승인/거절 취소 버튼'
                        >
                          취소
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>

                {expandedRows.includes(seller.sellerId) && (
                  <TableRow role='row'>
                    <TableCell
                      colSpan={4}
                      className='bg-gray-100'
                    >
                      <dl
                        id={`seller-details-${seller.sellerId}`}
                        role='region'
                        aria-labelledby={`seller-row-${seller.sellerId}`}
                        className='space-y-1 p-4'
                      >
                        <div className='flex gap-2'>
                          <dt className='font-semibold'>판매자명: </dt>
                          <dd>{seller.name}</dd>
                        </div>
                        <div className='flex gap-2'>
                          <dt className='font-semibold'>판매자ID: </dt>
                          <dd>{seller.sellerId}</dd>
                        </div>
                        <div className='flex gap-2'>
                          <dt className='font-semibold'>상호명: </dt>
                          <dd>{seller.company}</dd>
                        </div>
                        <div className='flex gap-2'>
                          <dt className='font-semibold'>사업자번호: </dt>
                          <dd>{seller.businessNumber}</dd>
                        </div>
                        <div className='flex gap-2'>
                          <dt className='font-semibold'>판매자 소개: </dt>
                          <dd>{seller.sellerIntro}</dd>
                        </div>
                      </dl>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
