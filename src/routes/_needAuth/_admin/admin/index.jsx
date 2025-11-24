import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_needAuth/_admin/admin/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  // 임시 더미 데이터
  const pendingSellers = [
    { id: 1, name: '판매자 A' },
    { id: 2, name: '판매자 B' },
    { id: 3, name: '판매자 C' },
  ];

  const pendingProducts = [
    { id: 1, name: '상품 A', seller: '판매자 A' },
    { id: 2, name: '상품 B', seller: '판매자 B' },
    { id: 3, name: '상품 C', seller: '판매자 C' },
    { id: 4, name: '상품 D', seller: '판매자 A' },
  ];

  const pendingAccessibility = [
    { id: 1, seller: '판매자 B' },
    { id: 2, seller: '판매자 C' },
  ];

  return (
    <>
      <div className='font-kakao-big mb-10 text-center text-3xl font-semibold'>관리자페이지</div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Card className='bg-white shadow-md'>
          <CardContent>
            <div className='font-kakao-big mb-2 text-lg font-medium'>승인 대기 판매자</div>
            <div className='font-kakao-big text-gray-600'>
              {`현재 미승인 상품 수는 ${pendingProducts.length}개 입니다.`}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant='default'
              className='w-full'
              onClick={() => navigate({ to: '/admin/sellers' })}
            >
              판매자 관리
            </Button>
          </CardFooter>
        </Card>

        <Card className='bg-white shadow-md'>
          <CardContent>
            <div className='font-kakao-big mb-2 text-lg font-medium'>미승인 상품</div>
            <div className='font-kakao-big text-gray-600'>
              {`현재 미승인 상품 수는 ${pendingProducts.length}개 입니다.`}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant='default'
              className='w-full'
              onClick={() => navigate({ to: '/admin/products' })}
            >
              상품 승인 관리
            </Button>
          </CardFooter>
        </Card>

        <Card className='bg-white shadow-md'>
          <CardContent>
            <div className='font-kakao-big mb-2 text-lg font-medium'>접근성 인증 대기 판매자</div>
            <div className='font-kakao-big text-gray-600'>
              {`현재 접근성 인증 대기 판매자는 ${pendingAccessibility.length}명 입니다.`}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant='default'
              className='w-full'
              onClick={() => navigate({ to: '/admin/accessibility' })}
            >
              접근성 인증 관리
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
