import { cartApi } from '@/api/cart-api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { fetchCartCount } from '@/store/cart-slice';
import { CircleCheck, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export const AddCartButton = ({ product, quantity = 1, className = '' }) => {
  const [added, setAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleAddToCart = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const resp = await cartApi.addCartItem(product.productId, quantity);
      if (resp.status === 201) {
        toast.success(`${product.productName}이(가) 장바구니에 추가되었습니다.`);
        setAdded(true);
        dispatch(fetchCartCount());
      }
    } catch (err) {
      if (err.error === 'Unauthorized') {
        toast.error('장바구니에 추가하려면 로그인이 필요합니다.');
        return;
      }
      toast.error('장바구니에 추가하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const style = cn('w-full gap-2', className);
  const addedStyle = cn('w-full gap-2 bg-green-600 hover:bg-green-700', className);

  if (added) {
    return (
      <Button
        className={addedStyle}
        aria-label={`${product.productName} 장바구니에 추가됨`}
        disabled
      >
        <CircleCheck
          className='size-4'
          aria-hidden='true'
        />
        추가됨
      </Button>
    );
  }

  return (
    <Button
      className={style}
      aria-label={`${product.productName} 장바구니에 담기`}
      onClick={handleAddToCart}
    >
      <ShoppingCart
        className='size-4'
        aria-hidden='true'
      />
      {isLoading ? <Spinner /> : '장바구니'}
    </Button>
  );
};
