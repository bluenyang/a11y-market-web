// import A11yButton from '@/components/accessibility/a11y-button';
import { A11yMenu } from '@/components/accessibility/a11y-menu';
import Footer from '@/components/layout/footer';
import TopBar from '@/components/layout/top-bar';
import { Spinner } from '@/components/ui/spinner';
import { useA11yEffect } from '@/hooks/use-a11y-effect';
import { useAuthInit } from '@/hooks/use-auth-init';
import useA11yStorage from '@/hooks/user-a11y-storage';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useSelector } from 'react-redux';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  useAuthInit();
  useA11yStorage();
  useA11yEffect();

  const isLoading = useSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-lg'>로딩 중...</p>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <Outlet />
      {/* <A11yButton /> */}
      <A11yMenu />
      <Footer />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}
