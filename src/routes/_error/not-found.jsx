import { ErrorEmpty } from '@/components/main/error-empty';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_error/not-found')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ErrorEmpty
      prevPath={'/'}
      message='404: 요청하신 페이지를 찾을 수 없습니다.'
    />
  );
}
