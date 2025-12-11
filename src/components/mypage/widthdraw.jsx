import { userApi } from '@/api/user-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logout } from '@/store/auth-slice';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';
import { Spinner } from '../ui/spinner';

export const Widthdraw = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { status } = await userApi.withdrawAccount(password);

      if (status !== 204) {
        new Error('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
      }

      navigate({ to: '/' });
      dispatch(logout());
      toast.success('회원 탈퇴가 완료되었습니다.');
    } catch (err) {
      console.error('회원 탈퇴 오류:', err);
      toast.error('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10'>
      {/* 상단 타이틀 */}
      <header className='space-y-2 text-center'>
        <h1 className='text-3xl'>회원 탈퇴 신청</h1>
        <p className='text-base'>회원 탈퇴 시 모든 정보가 삭제되어 다시 복구할 수 없습니다.</p>
      </header>

      {/* 본문 폼 */}
      <form
        onSubmit={handleSubmit}
        className='space-y-8'
      >
        {/* 안내 박스 */}
        <section className='space-y-4'>
          <h2 className='text-2xl'>회원 탈퇴</h2>
          <p className='text-base'>회원 탈퇴 신청에 앞서 아래 내용을 반드시 확인해주세요.</p>

          <Card className=''>
            <CardContent className='space-y-4 px-8 text-base'>
              <p className='mb-1 font-semibold'>회원 탈퇴 시 처리내용</p>
              <ul className='list-disc space-y-1 [&>li]:ml-8'>
                <li>A11Y MARKET 계정이 삭제됩니다.</li>
                <li>
                  일부 전자상거래 관련 법령에 따라 일정 기간 동안 결제/환불 및 거래 기록이 보관될 수
                  있습니다.
                </li>
                <li>
                  탈퇴 이후에는 동일한 아이디로 재가입이 가능하나, 이전 이용 기록이 복구되지
                  않습니다.
                </li>
              </ul>

              <Separator />

              <p className='mb-1 font-semibold'>회원 탈퇴 후 재가입 규정</p>
              <ul className='list-disc space-y-1 [&>li]:ml-8'>
                <li>탈퇴 후 재가입 시, 기존 구매 이력 등은 복구되지 않습니다.</li>
                <li>일부 이벤트 또는 혜택은 재가입 회원에게 제공되지 않을 수 있습니다.</li>
              </ul>
            </CardContent>
          </Card>

          <div className='flex items-center justify-between pt-1'>
            <label className='flex items-center gap-2'>
              <Checkbox
                id='confirm-guide'
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(!!checked)}
                required
              />
              <span className=''>
                안내 사항을 모두 확인했습니다.
                <span className='ml-1 text-red-500'>필수</span>
              </span>
            </label>
            <span className='text-[11px]'>고객센터 1234-5678</span>
          </div>
        </section>

        <section>
          <FieldGroup className='space-y-2'>
            <Field>
              <Label
                htmlFor='password'
                className='font-medium'
              >
                비밀번호 확인 (카카오 로그인 사용자는 제외)
              </Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='비밀번호를 입력해주세요'
                className='mt-1 h-10'
                autoComplete='current-password'
              />
            </Field>
          </FieldGroup>
        </section>

        {/* 하단 버튼 */}
        <div className='flex justify-center gap-3 pt-2'>
          <Button
            type='button'
            variant='outline'
            className='h-10 min-w-[120px]'
          >
            취소하기
          </Button>
          <Button
            variant='destructive'
            type='submit'
            className='h-10 min-w-[120px]'
            disabled={!isChecked || isLoading}
          >
            {isLoading ? (
              <span className='flex items-center gap-2'>
                처리 중...
                <Spinner />
              </span>
            ) : (
              '회원 탈퇴'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
