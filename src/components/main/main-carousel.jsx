import { mainApi } from '@/api/main-api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { ChevronLeftIcon, ChevronRightIcon, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ImageWithFallback } from '../image-with-fallback';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';

const MINIO_ENDPOINT = import.meta.env.VITE_MINIO_ENDPOINT;

export const MainCarousel = ({ data }) => {
  const autoPlay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const fade = useRef(Fade());

  const navigate = useNavigate();

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [bannerData, setBannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await mainApi.getEventBanners();
        setBannerData(response.data);
      } catch (error) {
        console.error('배너 데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const apiButtonStyles =
    'absolute opacity-80 top-1/2 size-12 -translate-y-1/2 rounded-full bg-neutral-50 text-neutral-700 shadow-lg hover:opacity-100 hover:bg-white dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-500';

  const handleBannerClick = (url) => {
    navigate({
      to: url,
    });
  };

  const handleDotClick = (index) => {
    api?.scrollTo(index);
  };

  const getImageUrl = (path) => {
    return path.startsWith('http') ? path : `${MINIO_ENDPOINT}${path}`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section
      className='relative w-full bg-gray-900'
      aria-label='이벤트 배너'
    >
      <div className='container mx-auto px-4 py-0'>
        <Carousel
          setApi={setApi}
          plugins={[autoPlay.current, fade.current]}
          opts={{
            align: 'start',
            loop: true,
          }}
          className='w-full'
        >
          <CarouselContent>
            {bannerData.map((banner, index) => (
              <CarouselItem key={index}>
                <div className='relative h-64 overflow-hidden rounded-lg md:h-80'>
                  <Button
                    onClick={() => handleBannerClick(banner.eventUrl)}
                    className='group relative h-full w-full cursor-pointer p-0'
                    aria-label={`${banner.eventTitle} - ${banner.eventDescription}`}
                  >
                    {/* 배너 이미지 */}
                    <ImageWithFallback
                      src={getImageUrl(banner.eventImageUrl)}
                      alt={banner.eventTitle}
                      className='h-full w-full object-cover'
                    />

                    {/* 텍스트 오버레이 */}
                    <div className='absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/60 via-black/30 to-transparent'>
                      <div className='px-4 text-center text-white'>
                        <h2 className='mb-4 text-3xl md:text-5xl'>{banner.eventTitle}</h2>
                        <p className='text-lg md:text-xl'>{banner.eventDescription}</p>
                        <span className='mt-6 inline-block rounded-lg bg-white px-6 py-3 text-gray-900 transition-transform group-hover:scale-105'>
                          자세히 보기
                        </span>
                      </div>
                    </div>
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <Button
            variant='outline'
            size='icon'
            className={cn(apiButtonStyles, 'left-4 bg-white/90 hover:bg-white')}
            onClick={() => api?.scrollPrev()}
            aria-label='이전 상품 보기'
          >
            <ChevronLeftIcon className='size-8' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className={cn(apiButtonStyles, 'right-4')}
            onClick={() => api?.scrollNext()}
            aria-label='다음 상품 보기'
          >
            <ChevronRightIcon className='size-8' />
          </Button>

          {/* 이전/다음 버튼 */}
          {/* <CarouselPrevious
            className='left-4 size-12 rounded-lg bg-white/90 hover:bg-white [&_svg]:h-16 [&_svg]:w-16'
            aria-label='이전 배너'
          />
          <CarouselNext
            className='right-4 size-12 rounded-lg bg-white/90 hover:bg-white [&_svg]:h-16 [&_svg]:w-16'
            aria-label='다음 배너'
          /> */}

          {/* 인디케이터 및 자동재생 컨트롤 */}
          <div className='absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform items-center gap-4'>
            <div
              className='flex gap-2'
              role='tablist'
              aria-label='배너 선택'
            >
              {bannerData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`size-2 rounded-full transition-all ${
                    index === current ? 'w-8 bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`${index + 1}번 배너로 이동`}
                  aria-selected={index === current}
                  role='tab'
                />
              ))}
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setIsAutoPlay(!isAutoPlay);
                isAutoPlay ? autoPlay.current.stop() : autoPlay.current.reset();
              }}
              className='size-8 bg-white/90 p-0 hover:bg-white'
              aria-label={isAutoPlay ? '자동 재생 정지' : '자동 재생 시작'}
            >
              {isAutoPlay ? <Pause className='size-4' /> : <Play className='size-4' />}
            </Button>
          </div>
        </Carousel>
      </div>

      {/* 현재 슬라이드 정보 (스크린 리더용) */}
      <div
        className='sr-only'
        aria-live='polite'
        aria-atomic='true'
      >
        {count}개 배너 중 {current + 1}번째: {bannerData[current]?.eventTitle}
      </div>
    </section>
  );
};
