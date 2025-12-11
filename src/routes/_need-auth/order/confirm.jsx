import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

// TODO: 백엔드 연동 전까지 사용할 임시 주문 데이터
const mockOrder = {
  orderId: 'ORD-2024-0156',
  date: '2024-01-15',
  productName: '무선 블루투스 이어폰 외 1개',
  amount: 89000,
  status: '배송완료',
};

function PurchaseConfirmPage() {
  //  /mypage/order/confirm?orderId=... 에서 넘어온 orderId 를 search 로 받음
  const { orderId } = Route.useSearch();

  const [agreeAll, setAgreeAll] = useState(false);
  const [detailReason, setDetailReason] = useState('');
  const [password, setPassword] = useState('');

  // 실제 연동 시에는 orderId 로 백엔드에서 주문 정보 조회 예정
  const currentOrder = {
    ...mockOrder,
    orderId: orderId ?? mockOrder.orderId,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreeAll) {
      // 필수 동의 체크 안 했을 때는 일단 아무 것도 안 함
      return;
    }

    // TODO: 이후에 구매 확정 API 연동
  };

  return (
    <div className='mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8'>
      {/* 상단 헤더 */}
      <header className='space-y-2'>
        <h1 className='font-kakao-big text-2xl text-slate-900'>구매 확정</h1>
        <p className='font-kakao-little text-sm text-slate-500'>
          구매 확정 시 교환/반품 가능 기간이 지나면 환불이 어려울 수 있습니다. 아래 내용을 확인 후
          신중하게 선택해 주세요.
        </p>
      </header>

      {/* 주문 정보 요약 카드 */}
      <Card className='shadow-sm'>
        <CardHeader className='pb-3'>
          <CardTitle className='font-kakao-little text-sm text-slate-900'>주문 정보</CardTitle>
          <CardDescription className='font-kakao-little text-xs text-slate-500'>
            구매를 확정할 주문의 기본 정보를 다시 한 번 확인해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className='font-kakao-little space-y-3 text-xs text-slate-800'>
          <FieldGroup className='grid gap-3 md:grid-cols-2'>
            <Field>
              <Label className='mb-1 block text-[11px] font-medium text-slate-500'>주문번호</Label>
              <Input
                readOnly
                value={currentOrder.orderId}
                className='h-9 text-xs text-slate-800'
              />
            </Field>
            <Field>
              <Label className='mb-1 block text-[11px] font-medium text-slate-500'>주문일</Label>
              <Input
                readOnly
                value={currentOrder.date}
                className='h-9 text-xs text-slate-800'
              />
            </Field>
            <Field className='md:col-span-2'>
              <Label className='mb-1 block text-[11px] font-medium text-slate-500'>주문 상품</Label>
              <Input
                readOnly
                value={currentOrder.productName}
                className='h-9 text-xs text-slate-800'
              />
            </Field>
            <Field>
              <Label className='mb-1 block text-[11px] font-medium text-slate-500'>결제 금액</Label>
              <Input
                readOnly
                value={`₩${currentOrder.amount.toLocaleString(`ko-KR`)}`}
                className='h-9 text-xs text-slate-800'
              />
            </Field>
            <Field>
              <Label className='mb-1 block text-[11px] font-medium text-slate-500'>현재 상태</Label>
              <Input
                readOnly
                value={currentOrder.status}
                className='h-9 text-xs text-slate-800'
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* 구매 확정 안내 카드 */}
      <Card className='border-slate-200 shadow-sm'>
        <CardHeader className='pb-3'>
          <CardTitle className='font-kakao-little text-sm text-slate-900'>
            구매 확정 전 꼭 확인해 주세요
          </CardTitle>
          <CardDescription className='font-kakao-little text-xs text-slate-500'>
            아래 사항을 모두 확인하신 후 구매를 확정해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className='font-kakao-little space-y-2 text-xs leading-relaxed text-slate-700'>
          <ul className='list-disc space-y-1 pl-4'>
            <li>구매 확정 이후에는 단순 변심에 의한 교환/반품이 어려울 수 있습니다.</li>
            <li>상품 하자 및 오배송의 경우, 판매자 정책에 따라 별도 문의 후 처리됩니다.</li>
            <li>구매 확정 시 적립금/포인트가 즉시 지급될 수 있으며, 취소 시 회수될 수 있습니다.</li>
            <li>배송 상태 및 수령 상품에 이상이 없는지 다시 한 번 확인해 주세요.</li>
          </ul>
        </CardContent>
      </Card>

      {/* 동의 확인 */}
      <form
        onSubmit={handleSubmit}
        className='space-y-6'
      >
        <div className='space-y-2 border-t border-slate-100 pt-4'>
          <label className='flex items-start gap-2'>
            <Checkbox
              id='agree-all'
              checked={agreeAll}
              onCheckedChange={(checked) => setAgreeAll(!!checked)}
              className='mt-0.5'
            />
            <span className='font-kakao-little text-xs text-slate-700'>
              위 안내 사항을 모두 확인하였으며, 수령한 상품과 배송 상태에 이상이 없음을 확인합니다.
              구매를 확정합니다. <span className='text-rose-500'>(필수)</span>
            </span>
          </label>
        </div>

        {/* 하단 버튼 영역 */}
        <div className='flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            className='font-kakao-little h-10 border-slate-300 text-xs text-slate-700 hover:bg-slate-100'
          >
            돌아가기
          </Button>
          <Button
            type='submit'
            disabled={!agreeAll}
            className='font-kakao-little h-10 text-xs font-medium text-slate-50 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500'
          >
            구매 확정하기
          </Button>
        </div>
      </form>
    </div>
  );
}

//  search 에서 orderId 를 받음
export const Route = createFileRoute('/_need-auth/order/confirm')({
  component: PurchaseConfirmPage,
  validateSearch: (search) => ({
    orderId: typeof search.orderId === 'string' ? search.orderId : undefined,
  }),
});
