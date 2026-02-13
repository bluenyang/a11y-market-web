import { useGetProfile } from '@/api/user/queries';
import { ROLES } from '@/constants/roles';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_need-auth/_seller/seller')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useGetProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userRole !== ROLES.SELLER) {
      navigate({
        to: '/unauthorized',
      });
    }
  }, [user, navigate]);

  return <Outlet />;
}
