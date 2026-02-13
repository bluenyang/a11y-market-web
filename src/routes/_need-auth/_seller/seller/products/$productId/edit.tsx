import { useGetCategories } from '@/api/category/queries';
import { useGetProductDetails } from '@/api/product/queries';
import type { ProductImageMetadata, ProductImageWithFile } from '@/api/product/types';
import { useUpdateProduct } from '@/api/seller/mutations';
import type { ProductUpdateRequest } from '@/api/seller/types';
import { ImageUploadSection } from '@/components/seller/products/img-upload-section';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlertCircleIcon, Archive, DollarSign, Image as ImageIcon, Package } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/_seller/seller/products/$productId/edit')({
  component: SellerProductEditPage,
});

function SellerProductEditPage() {
  // hooks
  const { productId } = Route.useParams();
  const { data: categories = [] } = useGetCategories();
  const navigate = useNavigate();

  const {
    data: product = {
      productName: '',
      productDescription: '',
      categoryId: '',
      productPrice: 0,
      productStock: 0,
      productStatus: 'APPROVED',
    },
  } = useGetProductDetails(productId);
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const [images, setImages] = useState<ProductImageWithFile[]>([]);
  const [formData, setFormData] = useState<ProductUpdateRequest['request']>({
    productName: product.productName,
    productDescription: product.productDescription,
    categoryId: product.categoryId,
    productPrice: product.productPrice,
    productStock: product.productStock,
    productStatus: product.productStatus,
    imageMetadataList: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // variables and constants
  const statusOptions = [
    {
      value: 'APPROVED',
      label: '판매중',
      desc: '현재 상품을 판매중 상태로 유지합니다.',
      activeStyle: 'bg-blue-100 text-blue-600 dark:text-blue-400 dark:bg-blue-900',
      inactiveStyle: 'bg-transparent text-blue-600 dark:text-blue-400',
    },
    {
      value: 'PAUSED',
      label: '일시중지',
      desc: '상품 노출을 잠시 중단하지만 정보는 유지합니다.',
      activeStyle: 'bg-yellow-100 text-yellow-600 dark:text-yellow-400 dark:bg-yellow-900',
      inactiveStyle: 'bg-transparent text-yellow-600 dark:text-yellow-400',
    },
    {
      value: 'DELETED',
      label: '삭제됨',
      desc: '상품을 비공개로 전환하고 삭제된 상태로 표시합니다. 상품의 정보는 유지됩니다.',
      activeStyle: 'bg-red-100 text-red-600 dark:text-red-400 dark:bg-red-900',
      inactiveStyle: 'bg-transparent text-red-600 dark:text-red-400',
    },
  ];

  // helper functions
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.productName) {
      newErrors.productName = '상품명을 입력해주세요.';
    }

    if (!formData.productDescription) {
      newErrors.productDescription = '상품 설명을 입력해주세요.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = '카테고리를 선택해주세요.';
    }

    if (formData.productPrice < 0) {
      newErrors.productPrice = '가격은 0 이상이어야 합니다.';
    }

    if (formData.productStock < 0) {
      newErrors.productStock = '재고는 0 이상이어야 합니다.';
    }

    if (images.length === 0) {
      newErrors.images = '최소 하나의 상품 사진을 업로드해주세요.';
    }

    // 대체 텍스트 검증
    const imagesWithoutAlt = images.filter((img) => !img.altText?.trim() && img.sequence < 10);
    if (imagesWithoutAlt.length > 0) {
      newErrors.imageAlt = '모든 사진에 대체 텍스트를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 에러 클리어
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      productStatus: value === 'APPROVED' ? 'APPROVED' : 'PENDING',
    }));
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      toast.error('폼에 오류가 있습니다. 수정 후 다시 시도해주세요.');
      setIsSubmitting(false);

      console.error('Validation errors:', errors);
      return;
    }

    try {
      const imageMetadataList: ProductImageMetadata[] = images.map((img) => ({
        originalFileName: img.originalFileName || '',
        imageId: img.imageId || '',
        sequence: img.sequence,
        altText: img.altText || '',
        isNew: img.isNew || false,
      }));

      const submitData: ProductUpdateRequest = {
        request: {
          ...formData,
          imageMetadataList: imageMetadataList,
        },
        images: images.map((img) => img.file).filter((file) => file !== undefined),
      };

      await updateProduct({ productId, productData: submitData });
      toast.success('상품이 성공적으로 수정되었습니다.');

      navigate({
        to: '/seller/products',
      });
    } catch (error) {
      toast.error('상품 수정 중에 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='font-kakao-big mx-auto max-w-6xl px-4 py-10'>
      {/* 상단 제목 */}
      <header className='mb-6'>
        <h1 className='text-xl font-semibold'>상품 수정</h1>
        <p className='mt-1 text-xs text-gray-500'>
          상품 정보를 수정하고 상태를 변경할 수 있습니다.
        </p>
      </header>

      {Object.keys(errors).length > 0 && (
        <Alert
          variant='destructive'
          className='mb-4 items-center has-[>svg]:grid-cols-[calc(var(--spacing)*6)_1fr] [&>svg]:row-span-2 [&>svg]:size-6'
        >
          <AlertCircleIcon />
          <AlertTitle className='text-base font-bold'>
            수정된 상품 정보에 오류가 있습니다.
          </AlertTitle>
          <AlertDescription>
            <p className='p-0'>다음 항목을 확인해주세요.</p>
            <ul className='list-disc pl-5 text-sm'>
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className='grid gap-6 md:grid-cols-[minmax(0,2.3fr)_minmax(260px,1fr)]'>
            {/* ===== 왼쪽: 정보 / 이미지 / 옵션 ===== */}
            <div className='space-y-6'>
              {/* 기본 정보 카드 */}
              <section className='rounded-3xl border p-6 shadow-sm'>
                <h2 className='mb-4 text-sm font-semibold'>기본 정보</h2>

                <div className='space-y-4'>
                  {/* 상품명 */}
                  <FieldSet>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Package className='h-5 w-5' />
                          기본 정보
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        {/* 상품명 */}
                        <Field className='gap-0'>
                          <FieldLabel htmlFor='productName'>
                            상품명
                            <span
                              className='text-red-500'
                              aria-label='필수'
                            >
                              *
                            </span>
                          </FieldLabel>
                          <Input
                            id='productName'
                            name='productName'
                            type='text'
                            value={formData.productName}
                            onChange={handleInputChange}
                            placeholder='상품명을 입력하세요'
                            aria-required='true'
                            aria-invalid={!!errors.productName}
                            aria-describedby={errors.productName ? 'productName-error' : undefined}
                            className='mt-1'
                            disabled={isSubmitting}
                          />
                          {errors.productName && (
                            <p
                              id='productName-error'
                              className='mt-1 text-sm text-red-500'
                              role='alert'
                            >
                              {errors.productName}
                            </p>
                          )}
                        </Field>

                        {/* 카테고리 */}

                        <FieldGroup className='gap-4'>
                          <Field className='gap-0'>
                            <FieldLabel htmlFor='parentCategoryId'>
                              카테고리
                              <span
                                className='text-red-500'
                                aria-label='필수'
                              >
                                *
                              </span>
                            </FieldLabel>
                            <Select
                              value={formData.categoryId}
                              onValueChange={(value) => {
                                setFormData((prev) => ({ ...prev, categoryId: value }));
                                // 에러 클리어
                                if (errors.categoryId) {
                                  setErrors((prev) => ({ ...prev, categoryId: '' }));
                                }
                              }}
                            >
                              <SelectTrigger
                                aria-required='true'
                                aria-invalid={!!errors.categoryId}
                                aria-describedby={
                                  errors.categoryId ? 'categoryId-error' : 'category-description'
                                }
                                className='mt-1'
                                disabled={isSubmitting}
                              >
                                <SelectValue placeholder='카테고리 선택' />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category: any) => (
                                  <SelectGroup key={category.categoryId}>
                                    <SelectLabel>{category.categoryName}</SelectLabel>
                                    {category.subCategories.map((subCategory: any) => (
                                      <SelectItem
                                        value={String(subCategory.categoryId)}
                                        key={subCategory.categoryId}
                                      >
                                        {subCategory.categoryName}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>

                          {errors.categoryId && (
                            <p
                              id='categoryId-error'
                              className='text-sm text-red-500'
                              role='alert'
                            >
                              {errors.categoryId}
                            </p>
                          )}
                        </FieldGroup>

                        {/* 상품 설명 */}
                        <Field className='gap-0'>
                          <FieldLabel htmlFor='productDescription'>
                            상품 설명{' '}
                            <span
                              className='text-red-500'
                              aria-label='필수'
                            >
                              *
                            </span>
                          </FieldLabel>
                          <Textarea
                            id='productDescription'
                            name='productDescription'
                            value={formData.productDescription}
                            onChange={handleInputChange}
                            placeholder='상품에 대한 상세한 설명을 입력하세요'
                            rows={6}
                            aria-required='true'
                            aria-invalid={!!errors.productDescription}
                            aria-describedby={
                              errors.productDescription ? 'productDescription-error' : undefined
                            }
                            disabled={isSubmitting}
                            className='mt-1'
                          />
                          {errors.productDescription && (
                            <p
                              id='productDescription-error'
                              className='mt-1 text-sm text-red-500'
                              role='alert'
                            >
                              {errors.productDescription}
                            </p>
                          )}
                        </Field>

                        {/* 가격과 재고 */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                          <Field className='gap-0'>
                            <Label
                              htmlFor='productPrice'
                              className='flex items-center gap-1'
                            >
                              <DollarSign className='h-4 w-4' />
                              가격
                              <span
                                className='text-red-500'
                                aria-label='필수'
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              id='productPrice'
                              name='productPrice'
                              type='number'
                              min='0'
                              step='1'
                              value={formData.productPrice}
                              onChange={handleInputChange}
                              placeholder='0'
                              aria-required='true'
                              aria-invalid={!!errors.productPrice}
                              aria-describedby={
                                errors.productPrice ? 'productPrice-error' : undefined
                              }
                              disabled={isSubmitting}
                              className='mt-1'
                            />
                            {errors.productPrice && (
                              <p
                                id='productPrice-error'
                                className='mt-1 text-sm text-red-500'
                                role='alert'
                              >
                                {errors.productPrice}
                              </p>
                            )}
                          </Field>

                          <Field className='gap-0'>
                            <Label
                              htmlFor='productStock'
                              className='flex items-center gap-1'
                            >
                              <Archive className='h-4 w-4' />
                              재고
                              <span
                                className='text-red-500'
                                aria-label='필수'
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              id='productStock'
                              name='productStock'
                              type='number'
                              min='0'
                              step='1'
                              value={formData.productStock}
                              onChange={handleInputChange}
                              placeholder='0'
                              aria-required='true'
                              aria-invalid={!!errors.productStock}
                              aria-describedby={
                                errors.productStock ? 'productStock-error' : undefined
                              }
                              disabled={isSubmitting}
                              className='mt-1'
                            />
                            {errors.productStock && (
                              <p
                                id='productStock-error'
                                className='mt-1 text-sm text-red-500'
                                role='alert'
                              >
                                {errors.productStock}
                              </p>
                            )}
                          </Field>
                        </div>
                      </CardContent>
                    </Card>
                  </FieldSet>

                  {/* 상품 사진 섹션 */}
                  <FieldSet>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <ImageIcon className='h-5 w-5' />
                          상품 사진
                        </CardTitle>
                        <p className='mt-2 text-sm text-gray-500'>
                          첫 번째 사진이 대표 사진으로 설정됩니다. 최대 10개까지 업로드 가능합니다.
                        </p>
                      </CardHeader>
                      <CardContent>
                        <ImageUploadSection
                          images={images}
                          onImagesChange={setImages}
                          sectionType='product'
                        />
                        {errors.images && (
                          <p
                            className='mt-2 text-sm text-red-500'
                            role='alert'
                          >
                            {errors.images}
                          </p>
                        )}
                        {errors.imageAlt && (
                          <p
                            className='mt-2 text-sm text-red-500'
                            role='alert'
                          >
                            {errors.imageAlt}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </FieldSet>

                  {/* 상세 정보 사진 섹션 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2'>
                        <ImageIcon className='h-5 w-5' />
                        상세 정보 사진
                      </CardTitle>
                      <p className='mt-2 text-sm text-gray-500'>
                        {'상품의 상세 정보를 설명하는 사진을 업로드하세요. (선택사항)'}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ImageUploadSection
                        images={images}
                        onImagesChange={setImages}
                        sectionType='detail'
                        disabled={isSubmitting}
                      />
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>

            {/* ===== 오른쪽: 상태 관리 ===== */}
            <aside className='space-y-6'>
              <section className='rounded-3xl border p-6 shadow-sm'>
                <h2 className='mb-4 text-sm font-semibold'>상태 관리</h2>
                <RadioGroup
                  value={formData.productStatus}
                  onValueChange={handleStatusChange}
                >
                  {statusOptions.map((option) => (
                    <Item
                      variant='outline'
                      className={`items-start ${formData.productStatus === option.value ? option.activeStyle : option.inactiveStyle}`}
                      key={option.value}
                    >
                      <ItemContent className='flex flex-row items-center gap-3'>
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className='border-neutral-400'
                        />
                        <Label
                          htmlFor={option.value}
                          className='flex cursor-pointer flex-col items-start'
                        >
                          <span className='font-medium'>{option.label}</span>
                          <p className='text-sm text-gray-500 dark:text-neutral-300'>
                            {option.desc}
                          </p>
                        </Label>
                      </ItemContent>
                    </Item>
                  ))}
                </RadioGroup>
              </section>

              {/* 하단 저장 버튼 */}
              <section className='rounded-3xl border p-4 shadow-sm'>
                <div className='flex flex-col gap-2'>
                  <Button
                    type='submit'
                    className='h-9 w-full'
                  >
                    수정 내용 저장
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-9 w-full'
                    onClick={() => navigate({ to: '/seller/products' })}
                  >
                    취소
                  </Button>
                </div>
              </section>
            </aside>
          </div>
        </FieldGroup>
      </form>
    </main>
  );
}
