import { LoadingEmpty } from '@/components/main/loading-empty';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_need-auth/_seller/seller/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  navigate({
    to: '/seller/dashboard',
  });

  return <LoadingEmpty />;
}
