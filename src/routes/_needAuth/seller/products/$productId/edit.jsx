// src/routes/_needAuth/seller/products/$productId/edit.jsx
import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field, FieldGroup } from '@/components/ui/field';

function SellerProductEditPage() {
  const { productId } = Route.useParams();

  // 실제로는 서버에서 불러와서 초기값 세팅
  const [form, setForm] = useState({
    name: '',
    summary: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    status: 'on', // on: 판매중, pause: 일시중지, hidden: 비공개 등
  });

  const [images, setImages] = useState([
    { id: 1, label: '대표 이미지', isMain: true },
    { id: 2, label: '보조 이미지 1', isMain: false },
  ]);

  const [options, setOptions] = useState([{ id: 1, name: '색상', values: '블랙, 화이트' }]);

  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({
      ...prev,
      status: value,
    }));
  };

  // 이미지 관리
  const handleAddImage = () => {
    setImages((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: '새 이미지',
        isMain: false,
      },
    ]);
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSetMainImage = (id) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isMain: img.id === id,
      })),
    );
  };

  // 옵션 관리
  const handleOptionChange = (id, field, value) => {
    setOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)));
  };

  const handleAddOptionRow = () => {
    setOptions((prev) => [...prev, { id: Date.now(), name: '', values: '' }]);
  };

  const handleRemoveOptionRow = (id) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: 상품 수정 API 연동
  };

  return (
    <main className='mx-auto mt-20 max-w-6xl px-4 py-10 text-[#333333]'>
      {/* 상단 제목 */}
      <header className='mb-6'>
        <h1 className='font-kakao-big text-xl font-semibold'>상품 수정</h1>
        <p className='mt-1 text-xs text-gray-500'>
          상품 정보를 수정하고 상태를 변경할 수 있습니다. 
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className='grid gap-6 md:grid-cols-[minmax(0,2.3fr)_minmax(260px,1fr)]'>
          {/* ===== 왼쪽: 정보 / 이미지 / 옵션 ===== */}
          <div className='space-y-6'>
            {/* 기본 정보 카드 */}
            <section className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='font-kakao-big mb-4 text-sm font-semibold'>기본 정보</h2>

              <div className='space-y-4'>
                {/* 상품명 */}
                <FieldGroup className='gap-4 md:grid md:grid-cols-2'>
                  <Field>
                    <Label
                      htmlFor='name'
                      className='font-kakao-big text-xs'
                    >
                      상품명 *
                    </Label>
                    <Input
                      id='name'
                      value={form.name}
                      onChange={handleFormChange('name')}
                      className='mt-1 h-9 text-xs'
                      placeholder='상품명을 입력하세요'
                      required
                    />
                  </Field>

                  <Field>
                    <Label
                      htmlFor='summary'
                      className='font-kakao-big text-xs'
                    >
                      한 줄 설명
                    </Label>
                    <Input
                      id='summary'
                      value={form.summary}
                      onChange={handleFormChange('summary')}
                      className='mt-1 h-9 text-xs'
                      placeholder='상품 특징을 간단히 입력하세요'
                    />
                  </Field>
                </FieldGroup>

                {/* 브랜드 / 카테고리 */}
                <FieldGroup className='gap-4 md:grid md:grid-cols-2'>
                  <Field>
                    <Label
                      htmlFor='brand'
                      className='font-kakao-big text-xs'
                    >
                      브랜드
                    </Label>
                    <Input
                      id='brand'
                      value={form.brand}
                      onChange={handleFormChange('brand')}
                      className='mt-1 h-9 text-xs'
                      placeholder='브랜드명을 입력하세요'
                    />
                  </Field>

                  <Field>
                    <Label
                      htmlFor='category'
                      className='font-kakao-big text-xs'
                    >
                      카테고리
                    </Label>
                    <select
                      id='category'
                      value={form.category}
                      onChange={handleFormChange('category')}
                      className='mt-1 h-9 w-full rounded border border-gray-300 bg-white px-3 text-xs'
                    >
                      <option value=''>카테고리 선택</option>
                      <option value='보조공학기기'>보조공학기기</option>
                      <option value='생활용품'>생활용품</option>
                      <option value='기타'>기타</option>
                    </select>
                  </Field>
                </FieldGroup>

                {/* 가격 / 재고 */}
                <FieldGroup className='gap-4 md:grid md:grid-cols-2'>
                  <Field>
                    <Label
                      htmlFor='price'
                      className='font-kakao-big text-xs'
                    >
                      판매가 *
                    </Label>
                    <div className='mt-1 flex items-center gap-2'>
                      <Input
                        id='price'
                        type='number'
                        min='0'
                        value={form.price}
                        onChange={handleFormChange('price')}
                        className='h-9 text-xs'
                        placeholder='0'
                        required
                      />
                      <span className='text-[11px] text-gray-500'>원</span>
                    </div>
                  </Field>

                  <Field>
                    <Label
                      htmlFor='stock'
                      className='font-kakao-big text-xs'
                    >
                      재고 수량 *
                    </Label>
                    <div className='mt-1 flex items-center gap-2'>
                      <Input
                        id='stock'
                        type='number'
                        min='0'
                        value={form.stock}
                        onChange={handleFormChange('stock')}
                        className='h-9 text-xs'
                        placeholder='0'
                        required
                      />
                      <span className='text-[11px] text-gray-500'>개</span>
                    </div>
                  </Field>
                </FieldGroup>
              </div>
            </section>

            {/* 이미지 관리 카드 */}
            <section className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='font-kakao-big mb-4 text-sm font-semibold'>이미지 관리</h2>

              <div className='flex flex-wrap gap-4'>
                {/* 새 이미지 추가 박스 */}
                <button
                  type='button'
                  onClick={handleAddImage}
                  className='flex h-28 w-28 items-center justify-center rounded border border-dashed border-gray-300 bg-[#fafafa] text-xs text-gray-500'
                >
                  +
                </button>

                {/* 기존 이미지들 */}
                {images.map((img) => (
                  <div
                    key={img.id}
                    className='flex h-28 w-28 flex-col justify-between rounded border border-gray-300 bg-[#fdfdfd] p-2 text-[11px]'
                  >
                    <div className='h-14 rounded bg-gray-200' />
                    <div className='mt-1 flex flex-col gap-1'>
                      <span className='truncate text-gray-700'>{img.label}</span>
                      <div className='flex items-center justify-between'>
                        <button
                          type='button'
                          className={`rounded px-2 py-0.5 text-[10px] ${
                            img.isMain
                              ? 'bg-black text-white'
                              : 'border border-gray-300 text-gray-600'
                          }`}
                          onClick={() => handleSetMainImage(img.id)}
                        >
                          대표
                        </button>
                        <button
                          type='button'
                          className='text-[10px] text-red-500'
                          onClick={() => handleRemoveImage(img.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className='mt-3 text-[11px] text-gray-500'>
                첫 번째 이미지는 대표 이미지로 사용됩니다. 이미지 업로드 기능은 이후에 서버와
                연동됩니다.
              </p>
            </section>

            {/* 옵션 관리 카드 */}
            <section className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='font-kakao-big text-sm font-semibold'>옵션 관리</h2>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='font-kakao-big h-8 px-3 text-xs'
                  onClick={handleAddOptionRow}
                >
                  옵션 추가
                </Button>
              </div>

              <div className='space-y-3'>
                {options.map((opt) => (
                  <FieldGroup
                    key={opt.id}
                    className='items-end gap-3 rounded-2xl bg-[#fafafa] p-3 md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_auto]'
                  >
                    <Field>
                      <Label
                        htmlFor={`opt-name-${opt.id}`}
                        className='font-kakao-big text-xs'
                      >
                        옵션명
                      </Label>
                      <Input
                        id={`opt-name-${opt.id}`}
                        value={opt.name}
                        onChange={(e) => handleOptionChange(opt.id, 'name', e.target.value)}
                        className='mt-1 h-8 text-xs'
                        placeholder='예: 색상'
                      />
                    </Field>

                    <Field>
                      <Label
                        htmlFor={`opt-values-${opt.id}`}
                        className='font-kakao-big text-xs'
                      >
                        옵션 값
                      </Label>
                      <Input
                        id={`opt-values-${opt.id}`}
                        value={opt.values}
                        onChange={(e) => handleOptionChange(opt.id, 'values', e.target.value)}
                        className='mt-1 h-8 text-xs'
                        placeholder='쉼표(,)로 구분 — 예: 블랙, 화이트'
                      />
                    </Field>

                    <div className='flex justify-end'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='mt-4 h-8 px-2 text-xs text-red-500'
                        onClick={() => handleRemoveOptionRow(opt.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </FieldGroup>
                ))}

                {options.length === 0 && (
                  <p className='text-[11px] text-gray-500'>
                    아직 등록된 옵션이 없습니다. 상단 &quot;옵션 추가&quot; 버튼을 눌러 옵션을
                    추가해 주세요.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* ===== 오른쪽: 상태 관리 ===== */}
          <aside className='space-y-6'>
            <section className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='font-kakao-big mb-4 text-sm font-semibold'>상태 관리</h2>

              <FieldGroup className='space-y-2'>
                <Field>
                  <label className='flex items-center justify-between rounded-2xl border px-3 py-2 text-xs'>
                    <div>
                      <span className='font-kakao-big'>판매중</span>
                      <p className='mt-0.5 text-[11px] text-gray-500'>
                        현재 상품을 판매중 상태로 유지합니다.
                      </p>
                    </div>
                    <input
                      type='radio'
                      name='status'
                      value='on'
                      checked={form.status === 'on'}
                      onChange={() => handleStatusChange('on')}
                    />
                  </label>
                </Field>

                <Field>
                  <label className='flex items-center justify-between rounded-2xl border px-3 py-2 text-xs'>
                    <div>
                      <span className='font-kakao-big'>일시중지</span>
                      <p className='mt-0.5 text-[11px] text-gray-500'>
                        상품 노출을 잠시 중단하지만 정보는 유지합니다.
                      </p>
                    </div>
                    <input
                      type='radio'
                      name='status'
                      value='pause'
                      checked={form.status === 'pause'}
                      onChange={() => handleStatusChange('pause')}
                    />
                  </label>
                </Field>

                <Field>
                  <label className='flex items-center justify-between rounded-2xl border px-3 py-2 text-xs'>
                    <div>
                      <span className='font-kakao-big'>추가 준비중</span>
                      <p className='mt-0.5 text-[11px] text-gray-500'>
                        신규 옵션/이미지 등을 수정 중인 상태입니다.
                      </p>
                    </div>
                    <input
                      type='radio'
                      name='status'
                      value='prepare'
                      checked={form.status === 'prepare'}
                      onChange={() => handleStatusChange('prepare')}
                    />
                  </label>
                </Field>

                <Field>
                  <label className='flex items-center justify-between rounded-2xl border px-3 py-2 text-xs'>
                    <div>
                      <span className='font-kakao-big text-red-500'>삭제 예정</span>
                      <p className='mt-0.5 text-[11px] text-gray-500'>
                        상품을 비공개로 전환하고 삭제 예정 상태로 표시합니다.
                      </p>
                    </div>
                    <input
                      type='radio'
                      name='status'
                      value='deleted'
                      checked={form.status === 'deleted'}
                      onChange={() => handleStatusChange('deleted')}
                    />
                  </label>
                </Field>
              </FieldGroup>
            </section>

            {/* 하단 저장 버튼 */}
            <section className='rounded-3xl border border-gray-200 bg-[#fafafa] p-4 shadow-sm'>
              <div className='flex flex-col gap-2'>
                <Button
                  type='submit'
                  className='font-kakao-big h-9 w-full'
                >
                  수정 내용 저장
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='font-kakao-big h-9 w-full'
                >
                  취소
                </Button>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </main>
  );
}

// TanStack Router – /seller/products/:productId/edit 경로
export const Route = createFileRoute('/_needAuth/seller/products/$productId/edit')({
  component: SellerProductEditPage,
});