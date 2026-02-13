import type { ProductImageWithFile } from '@/api/product/types';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Upload, X } from 'lucide-react';

interface ImageUploadSectionProps {
  images: ProductImageWithFile[];
  onImagesChange: (images: ProductImageWithFile[]) => void;
  sectionType: 'product' | 'detail';
  disabled?: boolean;
}

export function ImageUploadSection({
  images,
  onImagesChange,
  sectionType,
  disabled,
}: ImageUploadSectionProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const startSequence = sectionType === 'product' ? 0 : 10;
    const existingCount = images.filter((img) =>
      sectionType === 'product' ? img.sequence < 10 : img.sequence >= 10,
    ).length;

    const newImages = files.map((file, index) => ({
      originalFileName: file.name,
      altText: '',
      sequence: startSequence + existingCount + index,
      isNew: true,
      file,
    }));

    onImagesChange([...images, ...newImages]);
  };

  const handleRemoveImage = (sequence: number) => {
    const filtered = images.filter((img) => img.sequence !== sequence);
    onImagesChange(filtered);
  };

  const handleAltTextChange = (sequence: number, altText: string) => {
    const updated = images.map((img) => (img.sequence === sequence ? { ...img, altText } : img));
    onImagesChange(updated);
  };

  const handleSetMainImage = (sequence: number) => {
    const updated = images.map((img) => {
      if (img.sequence === sequence) {
        return { ...img, sequence: 0 };
      } else if (img.sequence === 0) {
        return { ...img, sequence: sequence }; // Swap with old main image
      }
      return img;
    });
    onImagesChange(updated);
  };

  const getImageUrl = (image: ProductImageWithFile) => {
    if (image.previewUrl) {
      return image.previewUrl;
    } else {
      return URL.createObjectURL(image.file);
    }
  };

  const sectionImages = images
    .filter((img) => (sectionType === 'product' ? img.sequence < 10 : img.sequence >= 10))
    .sort((a, b) => a.sequence - b.sequence);

  const maxImages = sectionType === 'product' ? 10 : Infinity;
  const canAddMore = sectionImages.length < maxImages;

  const sectionId = `${sectionType}-images`;
  const inputId = `${sectionType}-image-input`;

  return (
    <div className='space-y-4'>
      <Field className='gap-0'>
        <Label
          htmlFor={inputId}
          className='mb-2 block'
        >
          {sectionType === 'product' ? '상품 사진' : '상세 정보 사진'}
          <span className='ml-2 text-gray-500'>
            {sectionType === 'product'
              ? `(최대 10개, 현재 ${sectionImages.length}개)`
              : `(${sectionImages.length}개)`}
          </span>
        </Label>

        {canAddMore && (
          <Button
            type='button'
            variant='outline'
            onClick={() => document.getElementById(inputId)?.click()}
            className='w-full'
            aria-label={`${sectionType === 'product' ? '상품' : '상세 정보'} 사진 추가`}
            disabled={disabled}
          >
            <Upload className='mr-2 h-4 w-4' />
            사진 업로드
          </Button>
        )}

        <input
          id={inputId}
          type='file'
          accept='image/*'
          multiple
          onChange={handleFileSelect}
          className='sr-only'
          aria-describedby={`${sectionId}-description`}
          disabled={disabled}
        />

        <p
          id={`${sectionId}-description`}
          className='sr-only'
        >
          {sectionType === 'product'
            ? '대표 사진을 포함하여 최대 10개의 상품 사진을 업로드할 수 있습니다. 첫 번째 사진이 대표 사진으로 설정됩니다.'
            : '상품의 상세 정보를 설명하는 사진을 업로드하세요. 개수 제한이 없습니다.'}
        </p>
      </Field>

      {sectionImages.length > 0 && (
        <div
          className='grid grid-cols-1 gap-4 md:grid-cols-2'
          role='list'
          aria-label={`${sectionType === 'product' ? '상품' : '상세 정보'} 사진 목록`}
        >
          {sectionImages.map((image) => (
            <Card
              key={image.sequence}
              role='listitem'
            >
              <CardContent className='p-4'>
                <div className='space-y-3'>
                  <div className='relative aspect-video overflow-hidden rounded-md bg-gray-100'>
                    <ImageWithFallback
                      src={getImageUrl(image)}
                      alt={
                        image.altText ||
                        `${sectionType === 'product' ? '상품' : '상세'} 사진 ${image.sequence + 1}`
                      }
                      className='h-full w-full object-cover'
                    />
                    {sectionType === 'product' && image.sequence === 0 && (
                      <div
                        className='absolute top-2 left-2 flex items-center gap-1 rounded-md bg-yellow-500 px-2 py-1 text-white'
                        aria-label='대표 사진'
                      >
                        <Star
                          className='h-3 w-3'
                          fill='currentColor'
                        />
                        <span className='text-xs'>대표</span>
                      </div>
                    )}
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-2 right-2'
                      onClick={() => handleRemoveImage(image.sequence)}
                      aria-label={`사진 ${image.sequence + 1} 삭제`}
                      disabled={disabled}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>

                  <div className='space-y-2'>
                    <div>
                      <Label
                        htmlFor={`alt-${image.sequence}`}
                        className='text-xs'
                      >
                        {'대체 텍스트 (필수)'}
                      </Label>
                      <Input
                        id={`alt-${image.sequence}`}
                        type='text'
                        value={image.altText}
                        onChange={(e) => handleAltTextChange(image.sequence, e.target.value)}
                        placeholder='이미지를 설명하는 텍스트를 입력하세요'
                        className='mt-1'
                        aria-required='true'
                        aria-label={`사진 ${image.sequence + 1}의 대체 텍스트`}
                        disabled={disabled}
                      />
                    </div>

                    <div className='flex items-center justify-between text-xs text-gray-500'>
                      <span>{image.originalFileName || 'No filename'}</span>
                      <span>순서: {image.sequence}</span>
                    </div>

                    {sectionType === 'product' && image.sequence !== 0 && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => handleSetMainImage(image.sequence)}
                        className='w-full'
                        aria-label={`사진 ${image.sequence + 1}을 대표 사진으로 설정`}
                        disabled={disabled}
                      >
                        <Star className='mr-1 h-3 w-3' />
                        대표 사진으로 설정
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
