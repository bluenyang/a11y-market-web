// src/routes/_needAuth/seller/claims.jsx
import React, { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field, FieldGroup } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';

// 임시 데이터 (백엔드 연동 전 UI 확인용)
const mockRequests = [
  {
    id: 'CR-2024-001',
    type: '취소',
    orderNo: 'ORD-2024-0156',
    customerName: '김고객',
    productName: '무선 블루투스 이어폰',
    date: '2024-01-15',
    status: '접수',
    amount: 89000,
  },
  {
    id: 'RR-2024-002',
    type: '반품',
    orderNo: 'ORD-2024-0142',
    customerName: '이구매',
    productName: '스마트 워치',
    date: '2024-01-14',
    status: '처리중',
    amount: 159000,
  },
  {
    id: 'EX-2024-003',
    type: '교환',
    orderNo: 'ORD-2024-0138',
    customerName: '박교환',
    productName: '운동화 (사이즈 변경)',
    date: '2024-01-13',
    status: '완료',
    amount: 0,
  },
];

function CancelReturnPage() {
  const [typeFilter, setTypeFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState(mockRequests[0]?.id ?? null);

  const selectedRequest = mockRequests.find((r) => r.id === selectedId) ?? mockRequests[0];

  const filteredRequests = useMemo(() => {
    return mockRequests.filter((r) => {
      if (typeFilter !== '전체' && r.type !== typeFilter) return false;
      if (statusFilter !== '전체' && r.status !== statusFilter) return false;
      if (
        keyword &&
        !`${r.id}${r.orderNo}${r.customerName}${r.productName}`
          .toLowerCase()
          .includes(keyword.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [typeFilter, statusFilter, keyword]);

  const pendingCount = mockRequests.filter(
    (r) => r.status === '접수' || r.status === '처리대기',
  ).length;
  const completedCount = mockRequests.filter((r) => r.status === '완료').length;
  const refundWaitingCount = mockRequests.filter(
    (r) => r.type !== '교환' && r.status !== '완료',
  ).length;

  return (
    <div className='mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6'>
      {/* 헤더 */}
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight text-slate-900'>
          취소/반품/교환 관리
        </h1>
        <p className='text-sm text-slate-500'>
          고객의 취소, 반품, 교환 요청을 확인하고 처리할 수 있습니다.
        </p>
      </header>

      {/* 상단 요약 카드 */}
      <section className='grid gap-4 md:grid-cols-3'>
        <SummaryCard
          label='대기 중인 요청'
          value={pendingCount}
          badgeClass='bg-amber-50 text-amber-700 border-amber-200'
        />
        <SummaryCard
          label='처리 완료'
          value={completedCount}
          badgeClass='bg-emerald-50 text-emerald-700 border-emerald-200'
        />
        <SummaryCard
          label='환불 대기'
          value={refundWaitingCount}
          badgeClass='bg-rose-50 text-rose-700 border-rose-200'
        />
      </section>

      {/* 요청 목록 + 검색  */}
      <section className='rounded-xl border border-slate-200 bg-white shadow-sm'>
        {/* 검색 영역 */}
        <div className='border-b border-slate-100 bg-slate-50 px-4 py-3'>
          <div className='space-y-3'>
            {/* 유형 / 상태 / 기간(시작/종료) */}
            <FieldGroup className='grid items-end gap-3 md:grid-cols-4'>
              <Field>
                <Label
                  htmlFor='filter-type'
                  className='text-xs font-medium text-slate-600'
                >
                  요청 유형
                </Label>
                <select
                  id='filter-type'
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className='mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400'
                >
                  <option value='전체'>전체</option>
                  <option value='취소'>취소</option>
                  <option value='반품'>반품</option>
                  <option value='교환'>교환</option>
                </select>
              </Field>

              <Field>
                <Label
                  htmlFor='filter-status'
                  className='text-xs font-medium text-slate-600'
                >
                  처리 상태
                </Label>
                <select
                  id='filter-status'
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400'
                >
                  <option value='전체'>전체</option>
                  <option value='접수'>접수</option>
                  <option value='처리중'>처리중</option>
                  <option value='완료'>완료</option>
                </select>
              </Field>

              <Field>
                <Label
                  htmlFor='date-from'
                  className='text-xs font-medium text-slate-600'
                >
                  기간 설정 (시작)
                </Label>
                <Input
                  id='date-from'
                  type='date'
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className='mt-1 h-9 bg-white text-sm text-slate-800'
                />
              </Field>

              <Field>
                <Label
                  htmlFor='date-to'
                  className='text-xs font-medium text-slate-600'
                >
                  기간 설정 (종료)
                </Label>
                <Input
                  id='date-to'
                  type='date'
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className='mt-1 h-9 bg-white text-sm text-slate-800'
                />
              </Field>
            </FieldGroup>

            <FieldGroup className='flex flex-col gap-2 pt-1 md:flex-row md:items-end'>
              <Field className='flex-1'>
                <Label
                  htmlFor='keyword'
                  className='text-xs font-medium text-slate-600'
                >
                  검색어
                </Label>
                <Input
                  id='keyword'
                  placeholder='주문번호 / 고객명 / 상품명'
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className='mt-1 h-9 bg-white text-sm text-slate-800'
                />
              </Field>

              <Button
                type='button'
                className='mt-1 h-9 bg-slate-900 px-6 text-xs font-medium text-slate-50 hover:bg-slate-800 md:mt-0'
              >
                검색
              </Button>
            </FieldGroup>
          </div>
        </div>

        {/* 목록 테이블 */}
        <div className='overflow-x-auto'>
          <table className='min-w-full text-xs md:text-sm'>
            <thead className='border-b border-slate-100 bg-white'>
              <tr className='text-left text-[11px] font-medium text-slate-500 md:text-xs'>
                <th className='px-4 py-2'>요청번호</th>
                <th className='px-4 py-2'>유형</th>
                <th className='px-4 py-2'>주문번호</th>
                <th className='px-4 py-2'>고객명</th>
                <th className='px-4 py-2'>상품명</th>
                <th className='px-4 py-2'>요청일</th>
                <th className='px-4 py-2'>상태</th>
                <th className='px-4 py-2 text-right'>금액</th>
                <th className='px-4 py-2 text-center'>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r) => (
                <tr
                  key={r.id}
                  className={`border-t border-slate-100 text-slate-700 hover:bg-slate-50 ${
                    r.id === selectedRequest?.id ? 'bg-slate-50' : ''
                  }`}
                >
                  <td className='px-4 py-2 align-middle text-[11px] text-blue-600 md:text-xs'>
                    {r.id}
                  </td>
                  <td className='px-4 py-2 align-middle'>
                    <TypeBadge type={r.type} />
                  </td>
                  <td className='px-4 py-2 align-middle text-[11px] md:text-xs'>{r.orderNo}</td>
                  <td className='px-4 py-2 align-middle text-[11px] md:text-xs'>
                    {r.customerName}
                  </td>
                  <td className='truncate px-4 py-2 align-middle md:max-w-[220px]'>
                    {r.productName}
                  </td>
                  <td className='px-4 py-2 align-middle text-[11px] md:text-xs'>{r.date}</td>
                  <td className='px-4 py-2 align-middle'>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className='px-4 py-2 text-right align-middle text-[11px] md:text-xs'>
                    {r.amount === 0 ? '₩0' : `₩${r.amount.toLocaleString('ko-KR')}`}
                  </td>
                  <td className='px-4 py-2 text-center align-middle'>
                    <Button
                      size='xs'
                      variant='outline'
                      className='h-7 rounded-md border-slate-300 bg-slate-50 px-3 text-[11px] text-slate-700 hover:bg-slate-100'
                      type='button'
                      onClick={() => setSelectedId(r.id)}
                    >
                      처리
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 하단 페이지 정보 */}
        <div className='flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-[11px] text-slate-500 md:flex-row md:text-xs'>
          <span>총 {mockRequests.length}건 중 1-10건 표시</span>
          <div className='flex items-center gap-1'>
            <Button
              size='icon'
              variant='outline'
              className='h-7 w-7 border-slate-300 bg-slate-50 text-[11px]'
            >
              이전
            </Button>
            <Button
              size='icon'
              className='h-7 w-7 bg-slate-900 text-[11px] text-slate-50 hover:bg-slate-800'
            >
              1
            </Button>
            <Button
              size='icon'
              variant='outline'
              className='h-7 w-7 border-slate-300 bg-slate-50 text-[11px]'
            >
              2
            </Button>
            <Button
              size='icon'
              variant='outline'
              className='h-7 w-7 border-slate-300 bg-slate-50 text-[11px]'
            >
              다음
            </Button>
          </div>
        </div>
      </section>

      {/* 하단: 좌측 처리 폼 */}
      <section className='grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]'>
        {/* 왼쪽: 요청 처리 폼 전체 */}
        <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='mb-4'>
            <h2 className='text-sm font-semibold text-slate-800'>요청 처리 상세</h2>
            <p className='mt-1 text-xs text-slate-500'>
              선택한 요청의 기본 정보와 반송/환불 정보를 확인하고 처리하세요.
            </p>
          </div>

          <div className='grid gap-6 lg:grid-cols-2'>
            {/* 기본 정보 */}
            <div className='space-y-3'>
              <h3 className='text-xs font-medium text-slate-600'>기본 정보</h3>
              <div className='rounded-lg border border-slate-200 bg-slate-50/70 p-4'>
                <FieldGroup className='grid gap-4'>
                  <Field>
                    <Label
                      htmlFor='request-id'
                      className='text-xs font-medium text-slate-600'
                    >
                      요청번호
                    </Label>
                    <Input
                      id='request-id'
                      value={selectedRequest?.id ?? ''}
                      readOnly
                      className='mt-1 h-9 bg-white text-sm text-slate-800'
                    />
                  </Field>

                  <Field>
                    <Label
                      htmlFor='request-type'
                      className='text-xs font-medium text-slate-600'
                    >
                      요청 유형
                    </Label>
                    <select
                      id='request-type'
                      defaultValue={selectedRequest?.type}
                      className='mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400'
                    >
                      <option value='취소'>취소</option>
                      <option value='반품'>반품</option>
                      <option value='교환'>교환</option>
                    </select>
                  </Field>

                  <Field>
                    <Label
                      htmlFor='request-status'
                      className='text-xs font-medium text-slate-600'
                    >
                      처리 상태
                    </Label>
                    <select
                      id='request-status'
                      defaultValue={selectedRequest?.status}
                      className='mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400'
                    >
                      <option value='접수'>접수</option>
                      <option value='처리중'>처리중</option>
                      <option value='완료'>완료</option>
                    </select>
                  </Field>

                  <Field>
                    <Label
                      htmlFor='request-order'
                      className='text-xs font-medium text-slate-600'
                    >
                      주문번호
                    </Label>
                    <Input
                      id='request-order'
                      value={selectedRequest?.orderNo ?? ''}
                      readOnly
                      className='mt-1 h-9 bg-white text-sm text-slate-800'
                    />
                  </Field>

                  <Field>
                    <Label
                      htmlFor='request-customer'
                      className='text-xs font-medium text-slate-600'
                    >
                      고객명
                    </Label>
                    <Input
                      id='request-customer'
                      value={selectedRequest?.customerName ?? ''}
                      readOnly
                      className='mt-1 h-9 bg-white text-sm text-slate-800'
                    />
                  </Field>
                </FieldGroup>
              </div>
            </div>

            {/* 반송 / 환불 정보 */}
            <div className='space-y-3'>
              <h3 className='text-xs font-medium text-slate-600'>반송/환불 정보</h3>
              <div className='rounded-lg border border-slate-200 bg-slate-50/70 p-4'>
                <FieldGroup className='grid gap-4'>
                  <Field>
                    <Label
                      htmlFor='return-reason'
                      className='text-xs font-medium text-slate-600'
                    >
                      반송 사유
                    </Label>
                    <select
                      id='return-reason'
                      className='mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400'
                      defaultValue='단순 변심'
                    >
                      <option>단순 변심</option>
                      <option>상품 불량/하자</option>
                      <option>배송 문제</option>
                      <option>기타</option>
                    </select>
                  </Field>

                  <Field>
                    <Label
                      htmlFor='refund-amount'
                      className='text-xs font-medium text-slate-600'
                    >
                      환불 금액
                    </Label>
                    <Input
                      id='refund-amount'
                      type='text'
                      defaultValue={
                        selectedRequest?.amount
                          ? `₩${selectedRequest.amount.toLocaleString('ko-KR')}`
                          : '₩0'
                      }
                      className='mt-1 h-9 bg-white text-sm text-slate-800'
                    />
                  </Field>

                  <Field>
                    <Label
                      htmlFor='refund-method'
                      className='text-xs font-medium text-slate-600'
                    >
                      환불 방법
                    </Label>
                    <select
                      id='refund-method'
                      className='mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400'
                      defaultValue='원결제수단 취소'
                    >
                      <option>원결제수단 취소</option>
                      <option>적립금 환불</option>
                      <option>계좌이체 환불</option>
                    </select>
                  </Field>
                </FieldGroup>
              </div>
            </div>
          </div>

          {/* 메모 */}
          <div className='mt-6'>
            <Label
              htmlFor='request-memo'
              className='text-xs font-medium text-slate-600'
            >
              처리 메모
            </Label>
            <textarea
              id='request-memo'
              rows={3}
              placeholder='처리 과정에서 특이사항이나 메모를 입력해주세요.'
              className='mt-1 w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400'
            />
          </div>
        </div>

        {/*  알림 설정 + 액션 버튼  */}
        <div className='flex flex-col gap-4'>
          <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
            <h3 className='text-xs font-medium text-slate-700'>알림 설정</h3>
            <p className='mt-1 text-xs text-slate-500'>
              처리 상태 변경 시 발송할 알림 채널을 선택하세요.
            </p>
            <div className='mt-3 space-y-2 text-xs text-slate-700'>
              <label className='flex items-center gap-2'>
                <Checkbox
                  defaultChecked
                  id='notify-all'
                />
                <span>알림 사용</span>
              </label>
              <label className='flex items-center gap-2'>
                <Checkbox
                  defaultChecked
                  id='notify-kakao'
                />
                <span>카카오톡 알림 발송</span>
              </label>
              <label className='flex items-center gap-2'>
                <Checkbox
                  defaultChecked
                  id='notify-email'
                />
                <span>이메일 알림 발송</span>
              </label>
              <label className='flex items-center gap-2'>
                <Checkbox id='notify-sms' />
                <span>SMS 알림 발송</span>
              </label>
            </div>
          </div>

          <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
            <h3 className='text-xs font-medium text-slate-700'>요청 처리</h3>
            <p className='mt-1 text-xs text-slate-500'>
              입력한 정보로 요청을 저장하거나 즉시 처리 완료할 수 있습니다.
            </p>
            <div className='mt-4 flex flex-col gap-2'>
              <Button
                type='button'
                className='h-9 bg-slate-900 text-xs font-medium text-slate-50 hover:bg-slate-800'
              >
                수정 내용 저장
              </Button>
              <Button
                type='button'
                className='h-9 bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-500'
              >
                처리 완료
              </Button>
              <Button
                type='button'
                variant='outline'
                className='mt-1 h-9 border-slate-300 bg-slate-50 text-xs text-slate-700 hover:bg-slate-100'
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, badgeClass }) {
  return (
    <div className='flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm'>
      <div className='space-y-1'>
        <p className='text-xs font-medium text-slate-500'>{label}</p>
        <p className='text-xl font-semibold text-slate-900'>{value}</p>
      </div>
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold ${badgeClass}`}
      >
        {value}
      </div>
    </div>
  );
}

function TypeBadge({ type }) {
  const map = {
    취소: 'bg-amber-50 text-amber-700 border-amber-200',
    반품: 'bg-rose-50 text-rose-700 border-rose-200',
    교환: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
        map[type] ?? 'border-slate-200 bg-slate-50 text-slate-700'
      }`}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    접수: 'bg-amber-50 text-amber-700 border-amber-200',
    처리중: 'bg-sky-50 text-sky-700 border-sky-200',
    완료: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
        map[status] ?? 'border-slate-200 bg-slate-50 text-slate-700'
      }`}
    >
      {status}
    </span>
  );
}

export const Route = createFileRoute('/_needAuth/seller/claims')({
  component: CancelReturnPage,
});
