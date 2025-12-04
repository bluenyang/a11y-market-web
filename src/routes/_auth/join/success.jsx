import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/_auth/join/success')({
  component: JoinSuccessPage,
});

function JoinSuccessPage() {
  const navigate = useNavigate();
  const [openA11y, setOpenA11y] = useState(false);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-6 py-14'>
      <Card className='flex min-h-[380px] w-full max-w-xl flex-col justify-between rounded-2xl border px-6 py-10 shadow-2xl'>
        <CardHeader className='pb-4'>
          <CardTitle className='font-kakao-big text-center text-2xl font-extrabold text-gray-900'>
            회원가입이 완료되었습니다!
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-6 text-center text-lg leading-relaxed text-gray-700'>
          <p>A11Y MARKET에 가입해주셔서 감사합니다.</p>
          <p>
            오른쪽 하단의 버튼을 눌러 바로 접근성 설정을 진행하면, 더 편안한 사용 환경을 구성할 수
            있어요.
          </p>
        </CardContent>

        <CardFooter className='flex flex-col gap-4 pt-6'>
          <Button
            variant='default'
            className='h-12 w-full text-base font-medium'
            onClick={() => navigate({ to: '/' })}
          >
            메인으로 가기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
