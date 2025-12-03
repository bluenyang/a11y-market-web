import { ErrorEmpty } from '@/components/error-empty';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_error/invalid-path')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className='flex h-full w-full items-center justify-center px-4 py-8'>
      <ErrorEmpty
        prevPath='/'
        message='잘못된 경로로 접근하셨습니다.'
      />
    </main>
  );
}
