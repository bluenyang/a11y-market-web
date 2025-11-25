import { authApi } from '@/api/authApi';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSuccess } from '@/store/authSlice';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlertCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search) => {
    return {
      redirect: search.redirect || '/',
      error: search.error || '',
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { redirect, error } = Route.useSearch();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorType, setErrorType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await authApi.login(email, password);
      const { user, accessToken, refreshToken } = resp.data;

      dispatch(loginSuccess({ user, accessToken, refreshToken }));
      navigate({ to: redirect });
    } catch (err) {
      console.error('Login failed:', err);
      setErrorType('invalid_user');
    }
  };

  const getErrorMessage = (errType) => {
    switch (errType) {
      case 'login_required':
        return '로그인이 필요한 서비스입니다.';
      case 'unauthorized':
        return '권한이 없습니다. 다시 로그인해주세요.';
      case 'session_expired':
        return '세션이 만료되었습니다. 다시 로그인해주세요.';
      case 'invalid_user':
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      default:
        return null;
    }
  };

  useEffect(() => {
    if (error && error.length > 0) {
      setErrorType(error);
      //setErrorMsg(getErrorMessage(error));
    }
  }, [error]);

  return (
    <main className='font-kakao-big-sans mx-auto max-w-md px-4 py-10'>
      <h1 className='mb-6 text-2xl font-bold'>로그인</h1>

      <Alert
        variant='destructive'
        className={`grid border-red-500 bg-red-500/70 text-white ${errorType ? 'mb-4 grid-rows-[1fr]' : 'mb-0 grid-rows-[0fr] p-0 opacity-0'} transition-all`}
      >
        <AlertCircleIcon className={`${errorType ? '' : 'hidden'}`} />
        <AlertTitle className={`${errorType ? '' : 'hidden'}`}>
          {getErrorMessage(errorType)}
        </AlertTitle>
      </Alert>

      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <div>
          <Label
            htmlFor='email'
            className='text-sm font-medium'
          >
            이메일
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='이메일을 입력하세요'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label
            htmlFor='password'
            className='text-sm font-medium'
          >
            비밀번호
          </Label>
          <Input
            id='password'
            type='password'
            placeholder='비밀번호를 입력하세요'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type='submit'
          variant='default'
          className='w-full'
        >
          로그인
        </Button>

        <Button
          type='button'
          variant='default'
          className='w-full bg-yellow-300 text-black hover:bg-yellow-400'
          onClick={() => alert('카카오 로그인은 준비 중')}
        >
          카카오로 3초만에 로그인
        </Button>

        <Button
          type='button'
          variant='outline'
          className='w-full'
          onClick={() => navigate({ to: '/join' })}
        >
          아직 계정이 없으신가요? 회원가입
        </Button>
      </form>
    </main>
  );
}
