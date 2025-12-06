import { ImageWithFallback } from '@/components/image-with-fallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const formattedPrice = product.productPrice.toLocaleString('ko-KR');

  const handleAddToCart = (event) => {
    event.preventDefault();
    // Implement add to cart functionality here
    alert('장바구니에 담겼습니다!');
  };

  return (
    <article
      className='group rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md'
      aria-label={`${product.productName} 상품 카드`}
    >
      <Link to={`/products/${product.productId}`}>
        <div className='relative aspect-square overflow-hidden rounded-t-lg'>
          <ImageWithFallback
            src={product.productImageUrl}
            alt={product.productName}
            className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
          <Badge
            className='absolute top-2 left-2 bg-red-500 text-white'
            aria-label={`인기 순위 ${product.ranking}`}
          >
            {product.ranking}위
          </Badge>
        </div>

        <div className='p-4'>
          <h3 className='mb-2 line-clamp-2 min-h-14 text-lg'>{product.productName}</h3>

          <div className='mb-3 flex items-center justify-between'>
            <span
              className='text-xl'
              aria-label={`가격 ${product.productPrice.toLocaleString('ko-KR')}원`}
            >
              {formattedPrice}원
            </span>
          </div>

          <Button
            className='w-full gap-2'
            aria-label={`${product.productName} 장바구니에 담기`}
            onClick={handleAddToCart}
          >
            <ShoppingCart
              className='size-4'
              aria-hidden='true'
            />
            장바구니
          </Button>
        </div>
      </Link>
    </article>
  );
};
