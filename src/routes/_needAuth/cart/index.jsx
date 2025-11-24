// src/routes/cart.jsx
import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

// TODO: 서버 / Redux 연동 전까지는 이 mock 데이터로 UI만 확인
const mockCartData = [
  {
    sellerId: 1,
    sellerName: '판매자명',
    shippingFee: 0,
    items: [
      {
        id: 101,
        name: '상품명',
        option: '옵션 1',
        quantity: 1,
        price: 10000,
        checked: false,
      },
      {
        id: 102,
        name: '상품명',
        option: '옵션 1',
        quantity: 1,
        price: 8000,
        checked: false,
      },
    ],
  },
  {
    sellerId: 2,
    sellerName: '판매자명',
    shippingFee: 0,
    items: [
      {
        id: 201,
        name: '상품명',
        option: '옵션 1',
        quantity: 1,
        price: 12000,
        checked: false,
      },
      {
        id: 202,
        name: '상품명',
        option: '옵션 1',
        quantity: 1,
        price: 9000,
        checked: false,
      },
    ],
  },
];

function CartPage() {
  const [cartGroups, setCartGroups] = useState(mockCartData);

  // --- 체크박스 & 수량 변경 로직 ---

  const handleToggleItem = (sellerId, itemId) => {
    setCartGroups((prev) =>
      prev.map((group) =>
        group.sellerId !== sellerId
          ? group
          : {
              ...group,
              items: group.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item,
              ),
            },
      ),
    );
  };

  const handleToggleSeller = (sellerId) => {
    setCartGroups((prev) =>
      prev.map((group) => {
        if (group.sellerId !== sellerId) return group;
        const allChecked = group.items.every((item) => item.checked);
        return {
          ...group,
          items: group.items.map((item) => ({
            ...item,
            checked: !allChecked,
          })),
        };
      }),
    );
  };

  // 수량 변경은 디자인에는 안 보이지만 실제 기능용으로 남겨둠
  const handleChangeQty = (sellerId, itemId, delta) => {
    setCartGroups((prev) =>
      prev.map((group) =>
        group.sellerId !== sellerId
          ? group
          : {
              ...group,
              items: group.items.map((item) => {
                if (item.id !== itemId) return item;
                const nextQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: nextQty };
              }),
            },
      ),
    );
  };

  const handleDeleteSelected = () => {
    setCartGroups((prev) =>
      prev
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !item.checked),
        }))
        .filter((group) => group.items.length > 0),
    );
  };

  const handleDeleteAll = () => {
    if (!window.confirm('장바구니를 모두 비우시겠습니까?')) return;
    setCartGroups([]);
  };

  const handleDeleteOne = (sellerId, itemId) => {
    setCartGroups((prev) =>
      prev
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !(group.sellerId === sellerId && item.id === itemId)),
        }))
        .filter((group) => group.items.length > 0),
    );
  };

  // --- 합계 계산 ---
  const totals = (() => {
    let productTotal = 0;
    let shippingTotal = 0;

    cartGroups.forEach((group) => {
      const groupProductTotal = group.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      productTotal += groupProductTotal;
      shippingTotal += group.shippingFee;
    });

    const discountTotal = 0; // 할인 로직 추가 시 수정
    const expectedTotal = productTotal + shippingTotal - discountTotal;

    return { productTotal, shippingTotal, discountTotal, expectedTotal };
  })();

  const formatPrice = (value) => value.toLocaleString('ko-KR', { minimumFractionDigits: 0 }) + '원';

  if (!cartGroups.length) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-10'>
        <p className='mb-6 text-center text-xs text-gray-600'>
          <span className='font-semibold text-gray-900'>01 장바구니</span> &gt; 02 주문결제 &gt; 03
          주문완료
        </p>
        <div className='flex h-64 items-center justify-center border border-gray-200 text-gray-500'>
          장바구니에 담긴 상품이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl px-4 py-10 text-[#333333]'>
      {/* 상단 단계 표시 */}
      <p className='mb-6 text-center text-xs text-gray-600'>
        <span className='font-semibold text-gray-900'>01 장바구니</span> &gt; 02 주문결제 &gt; 03
        주문완료
      </p>

      {/* 판매자별 블록 */}
      {cartGroups.map((group) => {
        const groupProductTotal = group.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const groupTotal = groupProductTotal + group.shippingFee;
        const allChecked = group.items.every((item) => item.checked);

        return (
          <section
            key={group.sellerId}
            className='mb-5 overflow-hidden rounded-3xl border border-gray-200 bg-[#f4f4f4]'
          >
            {/* 판매자명 헤더 영역 */}
            <div className='flex items-center gap-3 border-b border-gray-200 px-8 py-4'>
              <input
                type='checkbox'
                checked={allChecked}
                onChange={() => handleToggleSeller(group.sellerId)}
                className='h-4 w-4 rounded-sm border-gray-400'
              />
              <span className='text-sm font-medium'>판매자명</span>
            </div>

            {/* 상품 리스트 영역 */}
            {group.items.map((item) => (
              <div
                key={item.id}
                className='flex items-center border-b border-gray-200 bg-white px-8 py-5 last:border-b-0'
              >
                {/* 체크박스 */}
                <input
                  type='checkbox'
                  checked={item.checked}
                  onChange={() => handleToggleItem(group.sellerId, item.id)}
                  className='mr-4 h-4 w-4 rounded-sm border-gray-400'
                />

                {/* 썸네일 */}
                <div className='mr-6 h-16 w-16 shrink-0 bg-gray-200' />

                {/* 상품 정보 */}
                <div className='flex-1'>
                  <p className='mb-1 text-sm font-medium'>{item.name}</p>
                  <p className='text-xs text-gray-500'>옵션 1</p>
                </div>

                {/* 수량 */}
                <div className='w-20 text-center text-xs text-gray-700'>
                  {
                    <div className='inline-flex items-center border border-gray-300'>
                      <button
                        type='button'
                        onClick={() => handleChangeQty(group.sellerId, item.id, -1)}
                        className='border-r border-gray-300 px-2 text-xs'
                      >
                        -
                      </button>
                      <span className='px-3 text-xs'>{item.quantity}</span>
                      <button
                        type='button'
                        onClick={() => handleChangeQty(group.sellerId, item.id, 1)}
                        className='border-l border-gray-300 px-2 text-xs'
                      >
                        +
                      </button>
                    </div>
                  }
                </div>

                {/* 가격 */}
                <div className='mr-6 w-32 text-right text-sm font-medium'>
                  {formatPrice(item.price * item.quantity)}
                </div>

                {/* 휴지통 아이콘 */}
                <button
                  type='button'
                  onClick={() => handleDeleteOne(group.sellerId, item.id)}
                  className='flex h-8 w-8 items-center justify-center'
                  aria-label='상품 삭제'
                >
                  <Icon
                    icon='mdi:trash'
                    className='size-8'
                  />
                </button>
              </div>
            ))}

            {/* 하단 판매자별 합계 */}
            <div className='bg-[#f4f4f4] px-8 py-4 text-center text-xs text-gray-600'>
              상품 {formatPrice(groupProductTotal)} + 배송비 {formatPrice(group.shippingFee)} ={' '}
              <span className='font-medium text-gray-800'>{formatPrice(groupTotal)}</span>
            </div>
          </section>
        );
      })}

      {/* 선택/전체 삭제 버튼 */}
      <div className='mb-8 flex gap-2'>
        <Button
          type='button'
          variant='outline'
          onClick={handleDeleteSelected}
          className='bg-[#f4f4f4] px-6 py-2 text-xs hover:bg-gray-200'
        >
          선택 삭제
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={handleDeleteAll}
          className='bg-[#f4f4f4] px-6 py-2 text-xs hover:bg-gray-200'
        >
          전체 삭제
        </Button>
      </div>

      {/* 결제 정보 박스 */}
      <div className='mb-6 border border-gray-300 bg-[#f9f9f9] px-10 py-10'>
        <div className='flex justify-end'>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between gap-8'>
              <span>총 판매가</span>
              <span className='font-medium'>+ {formatPrice(totals.productTotal)}</span>
            </div>
            <div className='flex justify-between gap-8'>
              <span>총 배송비</span>
              <span className='font-medium'>+ {formatPrice(totals.shippingTotal)}</span>
            </div>
            <div className='flex justify-between gap-8'>
              <span>총 할인금액</span>
              <span className='font-medium'>- {formatPrice(totals.discountTotal)}</span>
            </div>
            <div className='mt-2 flex justify-between gap-8 border-t border-gray-300 pt-3'>
              <span className='font-semibold'>총 결제 예상 금액</span>
              <span className='font-bold'>{formatPrice(totals.expectedTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 주문 버튼 2개 (Shadcn) */}
      <div className='flex justify-center gap-4'>
        <Button
          type='button'
          className='min-w-40 px-6 py-3 text-sm'
        >
          전체 주문하기
        </Button>
        <Button
          type='button'
          className='min-w-40 px-6 py-3 text-sm'
        >
          선택 주문하기
        </Button>
      </div>
    </div>
  );
}

// TanStack Router – /cart 경로
export const Route = createFileRoute('/_needAuth/cart/')({
  component: CartPage,
});
