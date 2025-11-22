import { Icon } from '@iconify/react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent } from '@/components/ui/carousel';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function RealtimeRanking({ data }) {
  const [api, setApi] = useState();

  const apiButtonStyles =
    'absolute top-1/2 size-12 -translate-y-1/2 rounded-full bg-neutral-50 text-neutral-700 shadow-lg hover:bg-sky-100 hover:shadow-xl hover:shadow-sky-100';
  return (
    <>
      <h2 className='mb-4 flex h-16 w-full items-center bg-neutral-300 px-16 text-2xl font-bold dark:bg-neutral-500'>
        실시간 인기 상품
      </h2>
      <div className='relative flex w-[80%] flex-col items-center justify-center px-8 pb-8'>
        <Carousel
          opts={{
            align: 'center',
            loop: false,
          }}
          className='w-full'
          setApi={setApi}
        >
          <CarouselContent className='gap-8 px-4'>
            {data?.map((item, _) => (
              <div className='p-1'>
                <Card className='overflow-hidden pt-0 transition-transform hover:-translate-y-1 hover:opacity-90 hover:shadow-lg'>
                  <CardContent className='flex aspect-square w-3xs items-center justify-center p-0'>
                    <div className='h-full w-full bg-neutral-400'></div>
                  </CardContent>
                  <CardFooter className='flex flex-col items-start gap-2 p-4'>
                    <span className='text-xl font-extrabold'>{item.title}</span>
                    <span className='text-base font-bold text-neutral-600 dark:text-neutral-300'>
                      {item.price + '원'}
                    </span>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </CarouselContent>
        </Carousel>
        <Button
          variant='outline'
          size='icon'
          className={cn(apiButtonStyles, '-left-8 md:-left-12')}
          onClick={() => api?.scrollPrev()}
          aria-label='이전 상품 보기'
        >
          <Icon
            icon='mdi:chevron-left'
            className='size-8'
          />
        </Button>
        <Button
          variant='outline'
          size='icon'
          className={cn(apiButtonStyles, '-right-8 md:-right-12')}
          onClick={() => api?.scrollNext()}
          aria-label='다음 상품 보기'
        >
          <Icon
            icon='mdi:chevron-right'
            className='size-8'
          />
        </Button>
      </div>
      <Button
        variant='default'
        className='mx-auto mt-4 w-3xs px-8 hover:opacity-80'
      >
        전체 인기 상품 보기
      </Button>
    </>
  );
}
