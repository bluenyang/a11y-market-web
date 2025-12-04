import { LoadingEmpty } from '@/components/main/loading-empty';
import { store } from '@/store/store';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_need-auth')({
  beforeLoad: async ({ location }) => {
    const { user, isAuthenticated, isLoading } = store.getState().auth;

    if (isLoading) return <LoadingEmpty />;
    if (!isAuthenticated || !user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
          error: 'login_required',
        },
      });
    }
  },

  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
