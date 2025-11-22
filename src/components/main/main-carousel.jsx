import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { useRef, useState } from 'react';

export const MainCarousel = ({ data }) => {
  const autoPlay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const fade = useRef(Fade());

  const [api, setApi] = useState();
  const apiButtonStyles =
    'absolute opacity-80 top-1/2 size-12 -translate-y-1/2 rounded-full bg-neutral-50 text-neutral-700 shadow-lg hover:opacity-100 hover:bg-white dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-500';
  const buttonStyles =
    'px-12 py-6 text-lg font-bold shadow-[2px_4px_1px_1px_rgba(0,0,0,0.1)] transition-transform dark:hover:bg-neutral-600 hover:-translate-y-1 hover:shadow-[4px_6px_2px_2px_rgba(0,0,0,0.15)]';

  return (
    <div className='flex w-full flex-col items-center justify-between lg:w-[80%] lg:flex-row-reverse'>
      <div
        className='relative w-screen md:w-fit'
        aria-label='메인 배너 컨테이너'
      >
        <Carousel
          plugins={[autoPlay.current, fade.current]}
          opts={{
            align: 'center',
            loop: true,
          }}
          className='w-full max-w-lg'
          onMouseEnter={autoPlay.current.stop}
          onMouseLeave={autoPlay.current.play}
          setApi={setApi}
          aria-label='메인 배너 컨텐츠'
        >
          <CarouselContent
            aria-label='메인 배너 캐러셀'
            tabIndex={0}
          >
            {data.map((item, _) => (
              <CarouselItem key={item.id}>
                <div className='p-1'>
                  <Card className='bg-neutral-400'>
                    <CardContent className='flex aspect-3/2 items-center justify-center p-6'>
                      <span className='text-4xl font-semibold'>{item.title}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Button
          variant='outline'
          size='icon'
          className={cn(apiButtonStyles, 'left-4')}
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
          className={cn(apiButtonStyles, 'right-4')}
          onClick={() => api?.scrollNext()}
          aria-label='다음 상품 보기'
        >
          <Icon
            icon='mdi:chevron-right'
            className='size-8'
          />
        </Button>
      </div>
      <div className='mt-6 flex flex-col gap-8 text-center lg:mt-0 lg:text-left'>
        <h2 className='mb-2 text-4xl font-extrabold'>당신에게 꼭 맞는 상품을 쉽게 찾는 쇼핑</h2>
        <p
          className='text-xl font-bold text-neutral-600 dark:text-neutral-300'
          aria-label='부제'
        >
          빠르고 간편하게
        </p>
        <div className='flex flex-col gap-8 sm:flex-row sm:justify-center lg:justify-start'>
          <Button
            variant='outline'
            size='lg'
            className={cn(buttonStyles)}
            aria-label='카테고리 보러가기 버튼'
          >
            카테고리 보러가기
          </Button>
          <Button
            variant='outline'
            size='lg'
            className={cn(buttonStyles)}
            aria-label='오늘의 할인 상품 버튼'
          >
            오늘의 할인 상품
          </Button>
        </div>
      </div>
    </div>
  );
};
