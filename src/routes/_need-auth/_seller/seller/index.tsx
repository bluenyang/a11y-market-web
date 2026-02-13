import { LoadingEmpty } from '@/components/main/loading-empty';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_need-auth/_seller/seller/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      to: '/seller/dashboard',
      replace: true,
    });
  }, [navigate]);

  return <LoadingEmpty />;
}
