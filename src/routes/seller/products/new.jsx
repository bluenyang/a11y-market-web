// src/routes/seller/products/new.jsx
import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function SellerProductNewPage() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    brand: '',
    description: '',
    salePrice: '',
    discountPrice: '',
    saleStatus: '',
    colorOption: '',
    sizeOption: '',
    stockQuantity: '',
    shippingFee: '',
    shippingMethod: '',
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSaveDraft = (event) => {
    event.preventDefault();
    // TODO: 임시저장 API 연동
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: 상품 등록 API 연동
  };

  return (
    <main
      className="mx-auto mt-20 max-w-5xl px-4 py-10 text-[#333333]"
      aria-label="판매자 상품 등록 페이지"
    >
      {/* 상단 타이틀 영역 */}
      <header
        className="mb-6"
        aria-label="상품 등록 페이지 제목 영역"
      >
        <h1 className="font-kakao-big text-xl font-semibold">
          상품 등록
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          새로운 상품을 등록하고 판매를 시작하세요.
        </p>
      </header>

      {/* 화이트 보드 카드 */}
      <section
        className="rounded-3xl border border-gray-200 bg-white shadow-sm"
        aria-label="상품 등록 폼 화이트보드"
      >
        <form
          className="divide-y divide-gray-200"
          aria-label="상품 등록 폼"
          onSubmit={handleSubmit}
        >
          {/* 1. 상품 기본정보 */}
          <div
            className="px-6 py-6"
            aria-label="상품 기본정보 섹션"
          >
            <h2
              className="font-kakao-big mb-4 text-sm font-semibold"
              aria-label="상품 기본정보 제목"
            >
              상품 기본정보
            </h2>

            <FieldGroup className="grid gap-6 md:grid-cols-2">
              {/* 상품명 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="name"
                  className="font-kakao-big text-xs"
                  aria-label="상품명 입력 레이블"
                >
                  상품명 *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  className="h-9 text-xs"
                  placeholder="상품명을 입력하세요"
                  aria-label="상품명 입력"
                  required
                />
              </Field>

              {/* 카테고리 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="category"
                  className="font-kakao-big text-xs"
                  aria-label="카테고리 선택 레이블"
                >
                  카테고리 *
                </Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={handleChange('category')}
                  className="h-9 w-full rounded border border-gray-300 bg-white px-3 text-xs"
                  aria-label="카테고리 선택"
                  required
                >
                  <option value="">카테고리 선택</option>
                  <option value="보조공학기기">보조공학기기</option>
                  <option value="생활용품">생활용품</option>
                  <option value="기타">기타</option>
                </select>
              </Field>

              {/* 브랜드 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="brand"
                  className="font-kakao-big text-xs"
                  aria-label="브랜드명 입력 레이블"
                >
                  브랜드
                </Label>
                <Input
                  id="brand"
                  type="text"
                  value={form.brand}
                  onChange={handleChange('brand')}
                  className="h-9 text-xs"
                  placeholder="브랜드명을 입력하세요"
                  aria-label="브랜드명 입력"
                />
              </Field>

              {/* 상품 이미지 업로드 자리 (아이콘 X, 추후 기능 연동) */}
              <Field className="flex flex-col gap-2">
                <span
                  className="font-kakao-big text-xs"
                  aria-label="상품 이미지 업로드 레이블"
                >
                  상품 이미지 *
                </span>
                <div
                  className="flex h-24 w-full cursor-pointer items-center justify-center rounded border border-dashed border-gray-300 bg-[#fafafa] text-[11px] text-gray-500"
                  aria-label="상품 이미지 업로드 영역"
                >
                  [이미지 업로드]
                </div>
              </Field>
            </FieldGroup>

            {/* 상세설명 - 전체 폭 */}
            <div className="mt-6">
              <Label
                htmlFor="description"
                className="font-kakao-big mb-2 block text-xs"
                aria-label="상세 설명 입력 레이블"
              >
                상세설명
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={handleChange('description')}
                className="min-h-[140px] text-xs"
                placeholder="상품 상세설명을 입력하세요"
                aria-label="상품 상세 설명 입력"
              />
            </div>
          </div>

          {/* 2. 판매정보 */}
          <div
            className="px-6 py-6"
            aria-label="판매정보 섹션"
          >
            <h2
              className="font-kakao-big mb-4 text-sm font-semibold"
              aria-label="판매정보 제목"
            >
              판매정보
            </h2>

            <FieldGroup className="grid gap-6 md:grid-cols-3">
              {/* 판매가 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="salePrice"
                  className="font-kakao-big text-xs"
                  aria-label="판매가 입력 레이블"
                >
                  판매가 *
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="salePrice"
                    type="number"
                    min="0"
                    value={form.salePrice}
                    onChange={handleChange('salePrice')}
                    className="h-9 text-xs"
                    aria-label="판매가 입력"
                    required
                  />
                  <span className="text-[11px] text-gray-500">원</span>
                </div>
              </Field>

              {/* 할인가 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="discountPrice"
                  className="font-kakao-big text-xs"
                  aria-label="할인가 입력 레이블"
                >
                  할인가
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="discountPrice"
                    type="number"
                    min="0"
                    value={form.discountPrice}
                    onChange={handleChange('discountPrice')}
                    className="h-9 text-xs"
                    aria-label="할인가 입력"
                  />
                  <span className="text-[11px] text-gray-500">원</span>
                </div>
              </Field>

              {/* 판매상태 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="saleStatus"
                  className="font-kakao-big text-xs"
                  aria-label="판매 상태 선택 레이블"
                >
                  판매상태 *
                </Label>
                <select
                  id="saleStatus"
                  value={form.saleStatus}
                  onChange={handleChange('saleStatus')}
                  className="h-9 w-full rounded border border-gray-300 bg-white px-3 text-xs"
                  aria-label="판매 상태 선택"
                  required
                >
                  <option value="">상태 선택</option>
                  <option value="on">판매중</option>
                  <option value="off">판매중지</option>
                  <option value="prepare">판매예정</option>
                </select>
              </Field>
            </FieldGroup>
          </div>

          {/* 3. 옵션 */}
          <div
            className="px-6 py-6"
            aria-label="옵션 섹션"
          >
            <h2
              className="font-kakao-big mb-4 text-sm font-semibold"
              aria-label="옵션 정보 제목"
            >
              옵션
            </h2>

            <FieldGroup className="grid gap-6 md:grid-cols-2">
              {/* 색상 옵션 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="colorOption"
                  className="font-kakao-big text-xs"
                  aria-label="색상 옵션 입력 레이블"
                >
                  색상
                </Label>
                <Input
                  id="colorOption"
                  type="text"
                  value={form.colorOption}
                  onChange={handleChange('colorOption')}
                  className="h-9 text-xs"
                  placeholder="예: 블랙, 화이트"
                  aria-label="색상 옵션 입력"
                />
                <span className="text-[11px] text-gray-500">
                  쉼표(,)로 구분하여 여러 색상을 입력할 수 있습니다.
                </span>
              </Field>

              {/* 사이즈 옵션 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="sizeOption"
                  className="font-kakao-big text-xs"
                  aria-label="사이즈 옵션 입력 레이블"
                >
                  사이즈
                </Label>
                <Input
                  id="sizeOption"
                  type="text"
                  value={form.sizeOption}
                  onChange={handleChange('sizeOption')}
                  className="h-9 text-xs"
                  placeholder="예: S, M, L"
                  aria-label="사이즈 옵션 입력"
                />
                <span className="text-[11px] text-gray-500">
                  쉼표(,)로 구분하여 여러 사이즈를 입력할 수 있습니다.
                </span>
              </Field>
            </FieldGroup>
          </div>

          {/* 4. 재고 & 배송 */}
          <div
            className="px-6 py-6"
            aria-label="재고 및 배송 섹션"
          >
            <h2
              className="font-kakao-big mb-4 text-sm font-semibold"
              aria-label="재고 및 배송 제목"
            >
              재고 &amp; 배송
            </h2>

            <FieldGroup className="grid gap-6 md:grid-cols-3">
              {/* 재고수량 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="stockQuantity"
                  className="font-kakao-big text-xs"
                  aria-label="재고 수량 입력 레이블"
                >
                  재고수량 *
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={form.stockQuantity}
                    onChange={handleChange('stockQuantity')}
                    className="h-9 text-xs"
                    aria-label="재고 수량 입력"
                    required
                  />
                  <span className="text-[11px] text-gray-500">개</span>
                </div>
              </Field>

              {/* 배송비 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="shippingFee"
                  className="font-kakao-big text-xs"
                  aria-label="배송비 입력 레이블"
                >
                  배송비
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="shippingFee"
                    type="number"
                    min="0"
                    value={form.shippingFee}
                    onChange={handleChange('shippingFee')}
                    className="h-9 text-xs"
                    aria-label="배송비 입력"
                  />
                  <span className="text-[11px] text-gray-500">원</span>
                </div>
              </Field>

              {/* 배송방법 */}
              <Field className="flex flex-col gap-2">
                <Label
                  htmlFor="shippingMethod"
                  className="font-kakao-big text-xs"
                  aria-label="배송 방법 선택 레이블"
                >
                  배송방법
                </Label>
                <select
                  id="shippingMethod"
                  value={form.shippingMethod}
                  onChange={handleChange('shippingMethod')}
                  className="h-9 w-full rounded border border-gray-300 bg-white px-3 text-xs"
                  aria-label="배송 방법 선택"
                >
                  <option value="">배송방법 선택</option>
                  <option value="택배">택배</option>
                  <option value="퀵서비스">퀵서비스</option>
                  <option value="직접배송">직접배송</option>
                </select>
              </Field>
            </FieldGroup>
          </div>

          {/* 하단 버튼 바 */}
          <div
            className="flex items-center justify-end gap-3 rounded-b-3xl bg-[#fafafa] px-6 py-4"
            aria-label="상품 등록 하단 버튼 영역"
          >
            <Button
              type="button"
              variant="outline"
              className="font-kakao-big h-9 px-4"
              onClick={handleSaveDraft}
              aria-label="상품 정보 임시 저장"
            >
              임시저장
            </Button>
            <Button
              type="submit"
              className="font-kakao-big h-9 px-6"
              aria-label="상품 등록하기"
            >
              상품등록
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}

// TanStack Router – /seller/products/new 경로
export const Route = createFileRoute('/seller/products/new')({
  component: SellerProductNewPage,
});