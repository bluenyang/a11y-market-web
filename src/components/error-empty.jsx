import { Icon } from '@iconify/react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export const ErrorEmpty = ({ prevPath, message }) => {
  const navigate = useNavigate();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Icon
            icon='mdi:error-outline'
            className='size-16'
          />
        </EmptyMedia>
        <EmptyTitle className='text-3xl font-bold'>오류가 발생했습니다</EmptyTitle>
        <EmptyDescription className='text-lg'>
          {message || '문제가 발생했습니다. 잠시 후 다시 시도해주세요.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className='flex gap-4'>
          <Button
            variant='default'
            className='h-10 w-40 text-lg font-bold transition-all hover:-translate-y-0.5 hover:shadow-md'
            onClick={() => {
              navigate({ to: prevPath });
            }}
          >
            이전으로
          </Button>
          <Button
            variant='outline'
            className='h-10 w-40 text-lg font-bold transition-all hover:-translate-y-0.5 hover:shadow-md'
            onClick={() => {
              navigate({ to: '/' });
            }}
          >
            메인으로
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
