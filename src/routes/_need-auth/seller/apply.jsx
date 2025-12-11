// src/routes/_needAuth/seller/apply.jsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { sellerApi } from '@/api/seller-api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ROLES } from '@/constants/roles';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

function SellerApplyPage() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [submiting, setSubmiting] = useState(false);
  const [shopName, setShopName] = useState('');
  const [businessNo, setBusinessNo] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmiting(true);
    try {
      const resp = await sellerApi.applySellerAccount({
        sellerName: shopName,
        businessNumber: businessNo,
        sellerIntro: description,
      });

      if (resp.status !== 201) {
        throw new Error('판매자 가입 신청에 실패했습니다.');
      }

      toast.success('판매자 가입 신청이 완료되었습니다. 심사 후 결과를 알려드리겠습니다.');
      navigate({
        to: '/',
      });
    } catch (err) {
      console.error('Error applying for seller account:', err);
      if (err.error === 'DUPLICATED_DATA') {
        toast.error('이미 신청한 판매자 계정이 존재합니다.');
      } else {
        toast.error('판매자 가입 신청 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setSubmiting(false);
    }
  };

  if (!user || user?.userRole !== ROLES.USER) {
    toast.error('판매자 가입 신청은 일반 회원만 이용할 수 있습니다.');
    navigate({
      to: '/unauthorized',
    });
    return null;
  }

  return (
    <div className='mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8'>
      {/* 헤더 */}
      <header className='space-y-2'>
        <h1 className='font-kakao-big text-2xl text-slate-900'>판매자 가입 신청</h1>
        <p className='font-kakao-little text-sm text-slate-500'>
          판매자 상호, 사업자 등록 번호, 소개글을 입력하여 판매자 가입을 신청할 수 있습니다.
        </p>
      </header>

      {/* 신청 폼 */}
      <Card className='border-slate-200 bg-white shadow-sm'>
        <CardHeader>
          <CardTitle className='font-kakao-little text-base text-slate-900'>
            기본 정보 입력
          </CardTitle>
          <CardDescription className='font-kakao-little text-xs text-slate-500'>
            실제 사업자 정보와 일치하도록 정확하게 입력해 주세요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className='space-y-6'
            onSubmit={handleSubmit}
          >
            <FieldGroup className='space-y-4'>
              {/* 판매자 상호 */}
              <Field>
                <Label
                  htmlFor='shop-name'
                  className='font-kakao-little text-xs font-medium text-slate-700'
                >
                  판매자 상호
                </Label>
                <Input
                  id='shop-name'
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder='예) A11y 마켓 스토어'
                  className='mt-1 h-10 bg-white text-sm text-slate-900'
                  required
                />
                <p className='font-kakao-little mt-1 text-[11px] text-slate-500'>
                  사이트에 표시될 스토어 이름입니다.
                </p>
              </Field>

              {/* 사업자 등록 번호 */}
              <Field>
                <Label
                  htmlFor='business-no'
                  className='font-kakao-little text-xs font-medium text-slate-700'
                >
                  사업자 등록 번호
                </Label>
                <Input
                  id='business-no'
                  value={businessNo}
                  onChange={(e) => setBusinessNo(e.target.value)}
                  placeholder='000-00-00000'
                  className='mt-1 h-10 bg-white text-sm text-slate-900'
                  required
                />
                <p className='font-kakao-little mt-1 text-[11px] text-slate-500'>
                  하이픈(-) 포함 형식으로 입력해 주세요.
                </p>
              </Field>

              {/* 판매자 소개글 */}
              <Field>
                <Label
                  htmlFor='seller-description'
                  className='font-kakao-little text-xs font-medium text-slate-700'
                >
                  판매자 소개글
                </Label>
                <Textarea
                  id='seller-description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='판매자의 상품에 대해 간단히 소개해 주세요.'
                  rows={5}
                  className='mt-1 resize-none border border-slate-200 bg-slate-50 text-sm text-slate-900 focus-visible:border-slate-400 focus-visible:ring-slate-400'
                />
                <p className='font-kakao-little mt-1 text-[11px] text-slate-500'>
                  최대 500자 이내로 작성하는 것을 추천합니다.
                </p>
              </Field>
            </FieldGroup>

            {/* 버튼 영역 */}
            <CardFooter className='mt-4 flex justify-end gap-2 px-0'>
              <Button
                type='button'
                variant='outline'
                className='font-kakao-little h-9 border-slate-300 bg-slate-50 text-xs text-slate-700 hover:bg-slate-100'
                onClick={() => navigate({ to: '/mypage' })}
                disabled={submiting}
                aria-label='신청 취소'
              >
                취소
              </Button>
              <Button
                type='submit'
                className='font-kakao-little h-9 bg-slate-900 text-xs font-medium text-slate-50 hover:bg-slate-800'
                disabled={submiting}
                aria-label='가입 신청하기'
              >
                가입 신청하기
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/_need-auth/seller/apply')({
  component: SellerApplyPage,
});
