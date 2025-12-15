import { sellerApi } from '@/api/seller-api';
import { LoadingEmpty } from '@/components/main/loading-empty';
import { ProductCard } from '@/components/main/product-card';
import { Badge } from '@/components/ui/badge';
import { formatPhoneNumber } from '@/lib/phone-number-formatter';
import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle, Mail, Phone, Shield, ShieldCheck, ShieldPlus, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/sellers/$sellerId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { sellerId } = Route.useParams();

  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState({
    sellerName: '',
    sellerIntro: '',
    sellerPhone: '',
    sellerEmail: '',
    sellerGrade: '',
    isA11yGuarantee: false,
    products: [],
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await sellerApi.getSellerInfo(sellerId);

        if (resp.status !== 200) {
          throw new Error('Failed to fetch seller info');
        }

        setSeller((prev) => ({
          ...prev,
          ...resp.data,
        }));
      } catch (err) {
        console.error('Error fetching seller info:', err);
        toast.error('판매자 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getGradeBadge = () => {
    switch (seller.sellerGrade) {
      case 'NEWER':
        return (
          <Badge
            variant='secondary'
            className='bg-violet-500 px-2 py-1 text-sm text-white dark:bg-violet-600 [&>svg]:size-4'
          >
            <Shield />
            신규 판매자
          </Badge>
        );
      case 'REGULAR':
        return (
          <Badge
            variant='secondary'
            className='bg-yellow-500 px-2 py-1 text-sm text-white dark:bg-yellow-600 [&>svg]:size-4'
          >
            <ShieldPlus />
            일반 판매자
          </Badge>
        );
      case 'TRUSTED':
        return (
          <Badge
            variant='secondary'
            className='bg-blue-500 px-2 py-1 text-sm text-white dark:bg-blue-600 [&>svg]:size-4'
          >
            <ShieldCheck />
            신뢰 판매자
          </Badge>
        );
      default:
        return null;
    }
  };

  const getA11yGuaranteeBadge = () => {
    if (seller.isA11yGuarantee) {
      return (
        <Badge
          variant='secondary'
          className='bg-green-500 px-2 py-1 text-sm text-white dark:bg-green-600 [&>svg]:size-4'
        >
          <CheckCircle />
          A11y 보증 판매자
        </Badge>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <main className='flex-1 bg-gray-50'>
        <LoadingEmpty />
      </main>
    );
  }

  return (
    <main className='flex-1 bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* 판매자 정보 헤더 */}
        <div className='mb-8 rounded-lg bg-white p-6 shadow-sm md:p-8'>
          <div className='flex items-start gap-6'>
            <div className='flex size-24 shrink-0 items-center justify-center rounded-full bg-blue-100'>
              <Store
                className='size-12 text-blue-600'
                aria-hidden='true'
              />
            </div>

            <div className='flex-1'>
              <h1 className='mb-2 text-3xl'>{seller.sellerName}</h1>
              <span className='mb-4 flex items-center gap-2'>
                {getGradeBadge()}
                {getA11yGuaranteeBadge()}
              </span>
              <p className='mb-6 text-gray-700'>{seller.sellerIntro}</p>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className='mt-6 grid gap-4 border-t pt-6 md:grid-cols-2'>
            <div className='flex items-center gap-3'>
              <Phone
                className='size-5 text-gray-600'
                aria-hidden='true'
              />
              <div>
                <p className='text-sm text-gray-600'>전화</p>
                <p>{formatPhoneNumber(seller.sellerPhone)}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Mail
                className='size-5 text-gray-600'
                aria-hidden='true'
              />
              <div>
                <p className='text-sm text-gray-600'>이메일</p>
                <p>{seller.sellerEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 판매 상품 목록 */}
        <div className='rounded-lg bg-white p-6 shadow-sm md:p-8'>
          <h2 className='mb-6 text-2xl'>판매 상품</h2>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {seller.products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
