export const ORDER_ITEM_STATUS = {
  ORDERED: 'ORDERED',
  PAID: 'PAID',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED',
  SHIPPED: 'SHIPPED',
  CONFIRMED: 'CONFIRMED',
  CANCEL_PENDING: 'CANCEL_PENDING',
  CANCELED: 'CANCELED',
  CANCEL_REJECTED: 'CANCEL_REJECTED',
  RETURN_PENDING: 'RETURN_PENDING',
  RETURNED: 'RETURNED',
  RETURN_REJECTED: 'RETURN_REJECTED',
};

export const statusLabel = (status) => {
  switch (status) {
    case ORDER_ITEM_STATUS.ORDERED:
      return {
        className: 'bg-violet-500',
        label: '결제 대기 중',
      };
    case ORDER_ITEM_STATUS.PAID:
      return {
        className: 'bg-blue-500',
        label: '결제 완료',
      };
    case ORDER_ITEM_STATUS.REJECTED:
      return {
        className: 'bg-red-500',
        label: '주문 거절',
      };
    case ORDER_ITEM_STATUS.ACCEPTED:
      return {
        className: 'bg-purple-500',
        label: '주문 승인',
      };
    case ORDER_ITEM_STATUS.SHIPPED:
      return {
        className: 'bg-yellow-500',
        label: '배송 중',
      };
    case ORDER_ITEM_STATUS.CONFIRMED:
      return {
        className: 'bg-green-700',
        label: '배송 완료',
      };
    case ORDER_ITEM_STATUS.CANCEL_PENDING:
      return {
        className: 'bg-yellow-700',
        label: '취소 요청 중',
      };
    case ORDER_ITEM_STATUS.CANCELED:
      return {
        className: 'bg-red-500',
        label: '주문 취소',
      };
    case ORDER_ITEM_STATUS.CANCEL_REJECTED:
      return {
        className: 'bg-red-700',
        label: '취소 거절',
      };
    case ORDER_ITEM_STATUS.RETURN_PENDING:
      return {
        className: 'bg-yellow-500',
        label: '반품 요청 중',
      };
    case ORDER_ITEM_STATUS.RETURNED:
      return {
        className: 'bg-orange-500',
        label: '반품 완료',
      };
    case ORDER_ITEM_STATUS.RETURN_REJECTED:
      return {
        className: 'bg-red-700',
        label: '반품 거절',
      };
    default:
      return {
        className: 'bg-neutral-500',
        label: '알 수 없음',
      };
  }
};
