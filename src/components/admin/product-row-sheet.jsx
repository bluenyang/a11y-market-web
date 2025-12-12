import { adminApi } from '@/api/admin-api';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { getProductStatusLabel, getProductStatusStyle } from '@/lib/product-status-mapping';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

export const ProductRowSheet = ({ product, onStatusChange }) => {
  const [productStatus, setProductStatus] = useState(product.productStatus);

  const handleStatusChange = async () => {
    try {
      await adminApi.updateProductStatus(product.productId, productStatus);

      onStatusChange && onStatusChange(product.productId, productStatus);
      toast.success('상품 상태가 성공적으로 업데이트되었습니다.');
    } catch (err) {
      console.error('Failed to update product status:', err);
      toast.error(err.message || '상품 상태 업데이트에 실패했습니다.');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='default'
          className='font-medium'
          href={`/need-auth/admin/admin/products/${product.productId}`}
        >
          상세정보 보기
        </Button>
      </SheetTrigger>
      <SheetContent className='w-[50%] p-6 sm:max-w-full'>
        <ScrollArea className='h-full pr-4'>
          <SheetHeader>
            <h2 className='font-kakao-big text-2xl font-semibold'>상품 상세정보</h2>
          </SheetHeader>
          <div className='mt-4'>
            <FieldGroup className='gap-6'>
              <FieldSet>
                <FieldLegend>상품 정보</FieldLegend>
                <FieldDescription>
                  상품의 상세 정보를 확인하고, 상태를 변경할 수 있습니다.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel>상품 ID</FieldLabel>
                    <div className='flex items-center gap-4 text-lg font-bold'>
                      <span>{product.productId}</span>
                      <Select
                        value={productStatus}
                        onValueChange={setProductStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='상품 상태 변경'>
                            <Badge className={getProductStatusStyle(productStatus)}>
                              {getProductStatusLabel(productStatus)}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='PENDING'>
                            <Badge className={getProductStatusStyle('PENDING')}>
                              {getProductStatusLabel('PENDING')}
                            </Badge>
                          </SelectItem>
                          <SelectItem value='APPROVED'>
                            <Badge className={getProductStatusStyle('APPROVED')}>
                              {getProductStatusLabel('APPROVED')}
                            </Badge>
                          </SelectItem>
                          <SelectItem value='REJECTED'>
                            <Badge className={getProductStatusStyle('REJECTED')}>
                              {getProductStatusLabel('REJECTED')}
                            </Badge>
                          </SelectItem>
                          <SelectItem value='PAUSED'>
                            <Badge className={getProductStatusStyle('PAUSED')}>
                              {getProductStatusLabel('PAUSED')}
                            </Badge>
                          </SelectItem>
                          <SelectItem value='DELETED'>
                            <Badge className={getProductStatusStyle('DELETED')}>
                              {getProductStatusLabel('DELETED')}
                            </Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>상품명</FieldLabel>
                    <span className='rounded-lg border px-3 py-2 text-sm'>
                      {product.productName || 'N/A'}
                    </span>
                  </Field>
                  <Field>
                    <FieldLabel>판매자명</FieldLabel>
                    <span className='rounded-lg border px-3 py-2 text-sm'>
                      {product.sellerName || 'N/A'}
                    </span>
                  </Field>
                </FieldGroup>
                <FieldGroup className='flex-row gap-4'>
                  <Field>
                    <FieldLabel>가격</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        value={`${product.productPrice?.toLocaleString('ko-KR') || 'N/A'}`}
                        readOnly
                      />
                      <InputGroupAddon>
                        <Icon icon='fa7-solid:won' />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel>{'재고'}</FieldLabel>
                    <Input
                      type='number'
                      value={product.productStock || 'N/A'}
                      readOnly
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldSet>
                <FieldLegend>상품 설명</FieldLegend>
                <FieldDescription>상품에 대한 자세한 설명입니다.</FieldDescription>
                <Field>
                  <Textarea
                    className='h-20 resize-none'
                    value={product.productDescription || 'N/A'}
                    readOnly
                  />
                </Field>
              </FieldSet>
            </FieldGroup>
          </div>
          <SheetFooter className='sticky bottom-0 mt-6 flex w-full flex-row gap-4 bg-white pt-4 dark:bg-neutral-900'>
            <Button
              variant='default'
              type='submit'
              className='flex-1 font-bold'
              onClick={handleStatusChange}
              disabled={productStatus === product.productStatus}
            >
              상태 변경 저장
            </Button>
            <SheetClose asChild>
              <Button
                variant='outline'
                className='flex-1 font-bold'
              >
                닫기
              </Button>
            </SheetClose>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
