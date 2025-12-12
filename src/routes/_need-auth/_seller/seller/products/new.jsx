import { sellerApi } from '@/api/seller-api';
import { ImageUploadSection } from '@/components/seller/products/img-upload-section';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@iconify/react';
import { createFileRoute } from '@tanstack/react-router';
import { Archive, Image, Package } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/_seller/seller/products/new')({
  component: RouteComponent,
});

function RouteComponent() {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    categoryId: '',
    productPrice: '',
    productStock: '',
  });

  const { categories } = useSelector((state) => state.category);

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 에러 클리어
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = '상품명을 입력해주세요.';
    }

    if (!formData.productDescription.trim()) {
      newErrors.productDescription = '상품 설명을 입력해주세요.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = '카테고리를 선택해주세요.';
    }

    if (!formData.productPrice || formData.productPrice <= 0) {
      newErrors.productPrice = '올바른 가격을 입력해주세요.';
    }

    if (!formData.productStock || formData.productStock < 0) {
      newErrors.productStock = '올바른 재고를 입력해주세요.';
    }

    // 이미지 검증
    const productImages = images.filter((img) => img.sequence < 10);
    if (productImages.length === 0) {
      newErrors.images = '최소 1개의 상품 사진을 업로드해주세요.';
    }

    // 대체 텍스트 검증
    const imagesWithoutAlt = images.filter((img) => !img.altText.trim() && img.sequence < 10);
    if (imagesWithoutAlt.length > 0) {
      newErrors.imageAlt = '모든 사진에 대체 텍스트를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      // 첫 번째 에러 필드로 포커스 이동
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
      }
      setIsSubmitting(false);
      return;
    }

    // 실제 데이터 구조로 변환
    const submitData = {
      productName: formData.productName,
      productDescription: formData.productDescription,
      categoryId: formData.categoryId,
      productPrice: parseInt(formData.productPrice),
      productStock: parseInt(formData.productStock),
      imageMetadataList: images.map((img) => ({
        originalFileName: img.originalFileName,
        altText: img.altText,
        sequence: img.sequence,
      })),
    };

    try {
      const resp = await sellerApi.registerProduct(submitData, images);

      if (resp.status === 201) {
        toast.success('상품이 성공적으로 등록 신청되었습니다!');
        // 폼 초기화
        setFormData({
          productName: '',
          productDescription: '',
          categoryId: '',
          productPrice: '',
          productStock: '',
        });
        setImages([]);
        setErrors({});
      } else {
        toast.error('상품 등록 신청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      toast.error('상품 등록 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='font-kakao-big mx-auto max-w-5xl px-4 py-10'>
      <form
        onSubmit={handleSubmit}
        className='mx-auto max-w-4xl space-y-6'
        noValidate
      >
        <Field>
          {/* 기본 정보 섹션 */}
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
                        {categories.map((category) => (
                          <SelectGroup key={category.categoryId}>
                            <SelectLabel>{category.categoryName}</SelectLabel>
                            {category.subCategories.map((subCategory) => (
                              <SelectItem
                                value={subCategory.categoryId}
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
                  <Label htmlFor='productDescription'>
                    상품 설명
                    <span
                      className='text-red-500'
                      aria-label='필수'
                    >
                      *
                    </span>
                  </Label>
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
                      <Icon
                        icon='fa7-solid:won'
                        className='h-4 w-4'
                      />
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
                      aria-describedby={errors.productPrice ? 'productPrice-error' : undefined}
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
                      aria-describedby={errors.productStock ? 'productStock-error' : undefined}
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
                  <Image className='h-5 w-5' />
                  상품 사진
                </CardTitle>
                <p className='text-sm text-red-700'>
                  {'(사진은 PNG 또는 JPEG 형식이어야 합니다.)'}
                </p>
                <p className='mt-2 text-sm'>
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
              </CardContent>
            </Card>
          </FieldSet>

          {/* 상세 정보 사진 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Image className='h-5 w-5' />
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

          {/* 대체 텍스트 에러 */}
          {errors.imageAlt && (
            <div
              className='rounded-md border border-red-200 bg-red-50 p-4'
              role='alert'
            >
              <p className='text-red-600'>{errors.imageAlt}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className='flex gap-4'>
            <Button
              type='submit'
              className='flex-1'
              aria-label='상품 등록'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className='flex items-center gap-2'>
                  등록 중...
                  <Spinner />
                </span>
              ) : (
                '상품 등록'
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  aria-label='폼 초기화'
                >
                  초기화
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>작성 내용 초기화</AlertDialogTitle>
                  <AlertDialogDescription>
                    작성 중인 모든 내용이 삭제됩니다. 계속하시겠습니까?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setFormData({
                        productName: '',
                        productDescription: '',
                        categoryId: '',
                        productPrice: '',
                        productStock: '',
                      });
                      setImages([]);
                      setErrors({});
                    }}
                    disabled={isSubmitting}
                  >
                    초기화
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Field>
      </form>
    </main>
  );
}
