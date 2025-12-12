// src/components/seller/order-summary-section.jsx
import { Card } from '@/components/ui/card';

export function OrderSummaryCard({ label, value, description }) {
  return (
    <Card className='relative flex h-[120px] flex-col justify-between rounded-xl border px-5 py-3 shadow-sm'>
      {/* 위쪽: 라벨 + 설명 */}
      <div className='mt-1 space-y-1 pr-12'>
        <p className='font-kakao-little text-sm font-medium text-slate-500'>{label}</p>
        {description && <p className='font-kakao-little text-sm text-slate-400'>{description}</p>}
      </div>

      {/* 아래쪽 숫자  */}
      <div className='pr-12 pb-1'>
        <p className='font-kakao-big text-lg leading-none text-slate-900'>{value}</p>
        <div className='mt-2 h-px w-12' />
      </div>

      {/*동그라미 배지 */}
      <div
        className={`absolute top-1/2 right-5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border text-sm font-semibold`}
      >
        {value}
      </div>
    </Card>
  );
}

/** 주문 상태 배지 */
export function OrderStatusBadge({ status }) {
  const map = {
    주문접수: 'bg-amber-50 text-amber-700 border-amber-200',
    상품준비중: 'bg-sky-50 text-sky-700 border-sky-200',
    배송중: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    배송완료: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    취소: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={`font-kakao-little inline-flex items-center rounded-full border px-2 py-0.5 text-sm font-medium ${
        map[status] ?? 'border-slate-200 bg-slate-50 text-slate-700'
      }`}
    >
      {status}
    </span>
  );
}

/** 주문 정보 행 */
export function InfoRow({ label, value }) {
  return (
    <div className='flex items-center justify-between gap-3 text-xs'>
      <span className='font-kakao-little text-sm text-slate-500'>{label}</span>
      <span className='font-kakao-little text-sm text-slate-800'>{value}</span>
    </div>
  );
}
