import { ROLES } from '@/constants/roles';
import { store } from '@/store/store';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/products')({
  beforeLoad: ({ location }) => {
    const { user } = store.getState().auth;

    if (user?.userRole !== ROLES.SELLER) {
      throw redirect({
        to: '/unauthorized',
        search: {
          error: 'access_denied',
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
