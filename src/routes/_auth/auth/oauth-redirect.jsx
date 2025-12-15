import { authApi } from '@/api/auth-api';
import { Spinner } from '@/components/ui/spinner';
import { loginSuccess } from '@/store/auth-slice';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const Route = createFileRoute('/_auth/auth/oauth-redirect')({
  component: RouteComponent,
  validateSearch: (search) => ({
    redirect: search.redirect || '/',
    accessToken: search.token || null,
  }),
});

function RouteComponent() {
  const { accessToken, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkLogin = async () => {
    if (accessToken) {
      try {
        const resp = await authApi.getUserInfo(accessToken);
        const { user, newAccessToken, refreshToken } = resp.data;

        dispatch(loginSuccess({ user, accessToken: newAccessToken, refreshToken }));
        navigate({ to: redirect });
      } catch (err) {
        navigate({
          to: '/login',
          search: { error: 'oauth_login_failed' },
        });
        console.error('OAuth login failed:', err);
      }
    } else {
      navigate({
        to: '/login',
        search: { error: 'invalid_access' },
      });
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <Spinner className='mb-6 size-24' />
      <h1 className='mb-4 text-2xl font-bold'>OAuth 로그인 처리 중...</h1>
      <p className='text-gray-600'>잠시만 기다려주세요.</p>
    </main>
  );
}
