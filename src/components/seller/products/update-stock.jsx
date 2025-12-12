import { sellerApi } from '@/api/seller-api';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const UpdateStock = ({ productId, currentStock, onStockUpdate, variant, className }) => {
  const [newStock, setNewStock] = useState(currentStock);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStockUpdate = async () => {
    setLoading(true);
    try {
      await sellerApi.updateProductStock(productId, newStock);

      onStockUpdate && onStockUpdate(productId, newStock);
      toast.success('재고가 성공적으로 업데이트되었습니다.');
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to update product stock:', err);
      toast.error(err.message || '재고 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          className={className}
        >
          재고 업데이트
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>재고 업데이트</AlertDialogTitle>
          <div className='mt-4'>
            <Field>
              <FieldLabel htmlFor='stock-input'>새 재고 수량</FieldLabel>
              <Input
                id='stock-input'
                type='number'
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
              />
            </Field>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant='outline'
            onClick={() => setNewStock(currentStock)}
            aira-label={isSuccess ? '닫기' : '취소'}
          >
            {isSuccess ? '닫기' : '취소'}
          </AlertDialogCancel>
          <Button
            onClick={handleStockUpdate}
            disabled={loading}
            variant='default'
            className={isSuccess ? 'bg-green-500 hover:bg-green-500' : ''}
            aria-label={isSuccess ? '업데이트 완료' : '재고 업데이트'}
          >
            {isSuccess ? (
              <>
                <CheckCircle />
                <span className='ml-2'>완료</span>
              </>
            ) : loading ? (
              <>
                <Spinner />
              </>
            ) : (
              <>
                <span>업데이트</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
