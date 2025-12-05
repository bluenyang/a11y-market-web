import { mainApi } from '@/api/main-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const MINIO_ENDPOINT = import.meta.env.VITE_MINIO_ENDPOINT;

export function RealtimeRanking() {
  const navigate = useNavigate();

  const [carouselApi, setCarouselApi] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch popular items from the API
    const fetchPopularItems = async () => {
      try {
        const resp = await mainApi.getPopularItems();
        setData(resp.data);
        console.log('Popular items fetched:', resp.data);
      } catch (error) {
        console.error('Failed to fetch popular items:', error);
      }
    };

    fetchPopularItems();
  }, []);

  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${MINIO_ENDPOINT}/${imagePath}`;
  };

  const apiButtonStyles =
    'absolute top-1/2 size-12 -translate-y-1/2 rounded-full bg-neutral-50 text-neutral-700 shadow-lg';

  return (
    <>
      <h2 className='mb-4 flex h-16 w-full items-center bg-neutral-300 px-16 text-2xl font-bold dark:bg-neutral-500'>
        인기 상품
      </h2>
      <div className='relative mx-auto flex w-[80%] flex-col items-center justify-center px-0 pb-8 md:px-8'>
        <Carousel
          opts={{
            align: 'center',
            loop: false,
          }}
          className='w-full'
          setApi={setCarouselApi}
        >
          <CarouselContent className='gap-8 px-4'>
            {data?.map((item, _) => (
              <Link
                className='p-1'
                to='/products/$productId'
                params={{ productId: item.id }} // 동적 세그먼트에 맞게 설정 추후 productId에 맞게 변경 필요
                key={item.id}
              >
                <Card className='overflow-hidden pt-0 transition-transform hover:-translate-y-1 hover:opacity-90 hover:shadow-lg'>
                  <CardContent className='flex aspect-square w-3xs items-center justify-center p-0'>
                    <div className='h-full w-full bg-neutral-400'>
                      <img
                        src={getImageUrl(item.productImageUrl)}
                        alt={item.productName}
                        className='h-full w-full object-cover'
                      />
                    </div>
                  </CardContent>
                  <CardFooter className='flex w-3xs flex-col items-start gap-2 p-4'>
                    <span className='w-56 truncate text-xl font-extrabold'>{item.productName}</span>
                    <span className='text-base font-bold text-neutral-600 dark:text-neutral-300'>
                      {item.productPrice + '원'}
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </CarouselContent>
        </Carousel>
        <Button
          variant='outline'
          size='icon'
          className={cn(apiButtonStyles, '-left-8 md:-left-12')}
          onClick={() => carouselApi?.scrollPrev()}
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
          onClick={() => carouselApi?.scrollNext()}
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
        onClick={() => {
          navigate({
            to: '/products',
            search: (old) => ({ ...old, sort: 'popular' }),
          });
        }}
      >
        전체 인기 상품 보기
      </Button>
    </>
  );
}
