// src/routes/_needAuth/_mypage/mypage/cancel.jsx
import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function MemberCancelPage() {
  const [detailReason, setDetailReason] = useState('');
  const [password, setPassword] = useState('');

  const maxLength = 2000;

  const withdrawReasons = [
    '이용빈도 낮음',
    '재가입',
    '콘텐츠/제품정보/상품 부족',
    '개인정보 보호',
    '회원 혜택/쇼핑혜택 부족',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 실제 탈퇴 API 연동
  };

  return (
    <div className='mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10'>
      {/* 상단 타이틀 */}
      <header className='space-y-2 text-center'>
        <h1 className='font-kakao-big text-3xl text-slate-900'>회원 탈퇴 신청</h1>
        <p className='font-kakao-little text-sm text-slate-500'>
          회원 탈퇴 시 모든 정보가 삭제되어 다시 복구할 수 없습니다.
        </p>
      </header>

      {/* 본문 폼 */}
      <form
        onSubmit={handleSubmit}
        className='space-y-8'
      >
        {/* 안내 박스 */}
        <section className='space-y-4'>
          <h2 className='font-kakao-big text-xl text-slate-900'>회원 탈퇴</h2>
          <p className='font-kakao-little text-sm text-slate-600'>
            회원 탈퇴 신청에 앞서 아래 내용을 반드시 확인해주세요.
          </p>

          <Card className='border-slate-200 bg-slate-50'>
            <CardContent className='space-y-4 p-6'>
              <div>
                <p className='font-kakao-little mb-1 text-sm font-semibold text-slate-900'>
                  회원 탈퇴 시 처리내용
                </p>
                <ul className='font-kakao-little list-disc space-y-1 pl-4 text-xs text-slate-600'>
                  <li>A11Y MARKET 계정, 주문 및 결제 정보가 삭제됩니다.</li>
                  <li>
                    일부 전자상거래 관련 법령에 따라 일정 기간 동안 결제/환불 및 거래 기록이 보관될
                    수 있습니다.
                  </li>
                  <li>
                    탈퇴 이후에는 동일한 아이디로 재가입이 불가하거나, 이전 이용 기록이 복구되지
                    않습니다.
                  </li>
                </ul>
              </div>

              <div className='h-px w-full bg-slate-200' />

              <div>
                <p className='font-kakao-little mb-1 text-sm font-semibold text-slate-900'>
                  회원 탈퇴 시 게시글 관리
                </p>
                <ul className='font-kakao-little list-disc space-y-1 pl-4 text-xs text-slate-600'>
                  <li>
                    탈퇴 후에도 게시판에 작성한 리뷰/댓글 등 일부 콘텐츠는 관련 법령에 따라 일정
                    기간 동안 보관될 수 있습니다.
                  </li>
                  <li>게시글 삭제를 원하시는 경우, 탈퇴 신청 전 직접 삭제해주시기 바랍니다.</li>
                </ul>
              </div>

              <div className='h-px w-full bg-slate-200' />

              <div>
                <p className='font-kakao-little mb-1 text-sm font-semibold text-slate-900'>
                  회원 탈퇴 후 재가입 규정
                </p>
                <ul className='font-kakao-little list-disc space-y-1 pl-4 text-xs text-slate-600'>
                  <li>탈퇴 후 재가입 시, 기존 적립금·쿠폰·구매 이력 등은 복구되지 않습니다.</li>
                  <li>일부 이벤트 또는 혜택은 재가입 회원에게 제공되지 않을 수 있습니다.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className='flex items-center justify-between pt-1'>
            <label className='flex items-center gap-2'>
              <Checkbox
                id='confirm-guide'
                required
              />
              <span className='font-kakao-little text-xs text-slate-700'>
                안내 사항을 모두 확인했습니다.
                <span className='ml-1 text-red-500'>필수</span>
              </span>
            </label>
            <span className='font-kakao-little text-[11px] text-slate-400'>고객센터 1234-5678</span>
          </div>
        </section>

        {/* 탈퇴 사유 체크박스 */}
        <section className='space-y-3'>
          <div className='flex items-baseline gap-1'>
            <h2 className='font-kakao-big text-base text-slate-900'>
              A11Y MARKET에서 탈퇴하려는 이유가 무엇인가요? (복수선택 가능)
            </h2>
            <span className='font-kakao-little text-xs text-red-500'>필수</span>
          </div>

          <Card className='border-slate-200 bg-white'>
            <CardContent className='grid gap-3 p-4 sm:grid-cols-2'>
              {withdrawReasons.map((label) => (
                <label
                  key={label}
                  className='flex items-center gap-2'
                >
                  <Checkbox
                    id={`reason-${label}`}
                    value={label}
                  />
                  <span className='font-kakao-little text-sm text-slate-800'>{label}</span>
                </label>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 상세 사유 + 비밀번호 확인 */}
        <section className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-baseline justify-between gap-2'>
              <h2 className='font-kakao-big text-base text-slate-900'>
                A11Y MARKET 서비스 이용 중 어떤 부분이 불편하셨나요?
              </h2>
              <span className='font-kakao-little text-xs text-slate-400'>선택</span>
            </div>
            <p className='font-kakao-little text-xs text-slate-500'>
              A11Y MARKET에 떠나는 이유를 자세히 알려주시면, 소중한 의견을 반영해 더 좋은 서비스를
              만들겠습니다.
            </p>

            <div className='space-y-1'>
              <Textarea
                id='detail-reason'
                maxLength={maxLength}
                rows={5}
                value={detailReason}
                onChange={(e) => setDetailReason(e.target.value)}
                placeholder='선택하신 항목에 대한 자세한 이유를 남겨주시면 서비스 개선에 큰 도움이 됩니다.'
                className='font-kakao-little w-full resize-none border border-slate-200 bg-slate-50 text-sm text-slate-800 focus-visible:border-slate-400 focus-visible:ring-slate-400'
              />
              <div className='flex justify-end'>
                <span className='font-kakao-little text-[11px] text-slate-400'>
                  {detailReason.length} / {maxLength}
                </span>
              </div>
            </div>
          </div>

          <FieldGroup className='space-y-2'>
            <Field>
              <Label
                htmlFor='password'
                className='font-kakao-little text-xs font-medium text-slate-800'
              >
                비밀번호 확인
              </Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='비밀번호를 입력해주세요'
                required
                className='mt-1 h-10 bg-white text-sm text-slate-800'
              />
            </Field>
          </FieldGroup>
        </section>

        {/* 하단 버튼 */}
        <div className='flex justify-center gap-3 pt-2'>
          <Button
            type='button'
            variant='outline'
            className='font-kakao-little h-10 min-w-[120px] border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50'
          >
            취소하기
          </Button>
          <Button
            type='submit'
            className='font-kakao-little h-10 min-w-[120px] bg-slate-900 text-sm text-slate-50 hover:bg-slate-800'
          >
            탈퇴신청
          </Button>
        </div>
      </form>
    </div>
  );
}

export const Route = createFileRoute('/_needAuth/_mypage/mypage/cancel')({
  component: MemberCancelPage,
});
