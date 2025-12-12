export const getOrderStatusLabel = (status) => {
  switch (status) {
    case 'PENDING':
      return '결제 대기';
    case 'PAID':
      return '결제 완료';
    case 'ACCEPTED':
      return '주문 승인';
    case 'REJECTED':
      return '주문 거절';
    case 'SHIPPED':
      return '배송 중';
    case 'DELIVERED':
      return '배송 완료';
    case 'CANCELLED':
      return '주문 취소';
    default:
      return '알 수 없음';
  }
};

export const getOrderItemStatusLabel = (status) => {
  switch (status) {
    case 'ORDERED':
      return '결제 대기';
    case 'PAID':
      return '결제 완료';
    case 'ACCEPTED':
      return '주문 접수됨';
    case 'REJECTED':
      return '주문 거절됨';
    case 'SHIPPED':
      return '배송 중';
    case 'CONFIRMED':
      return '구매 확정';
    case 'CANCEL_PENDING':
      return '취소 요청됨';
    case 'CANCELED':
      return '취소됨';
    case 'CANCEL_REJECTED':
      return '취소 거절됨';
    case 'RETURN_PENDING':
      return '반품 요청됨';
    case 'RETURNED':
      return '반품됨';
    case 'RETURN_REJECTED':
      return '반품 거절됨';
    default:
      return '알 수 없음';
  }
};

export const getOrderItemStatusStyle = (status) => {
  let style = '';

  switch (status) {
    case 'ORDERED':
      style = 'bg-purple-100 text-purple-800';
      break;
    case 'PAID':
      style = 'bg-blue-100 text-blue-800';
      break;
    case 'ACCEPTED':
      style = 'bg-teal-100 text-teal-800';
      break;
    case 'REJECTED':
      style = 'bg-red-100 text-red-800';
      break;
    case 'SHIPPED':
      style = 'bg-yellow-100 text-yellow-800';
      break;
    case 'CONFIRMED':
      style = 'bg-green-100 text-green-800';
      break;
    case 'CANCEL_PENDING':
    case 'RETURN_PENDING':
      style = 'bg-orange-100 text-orange-800';
      break;
    case 'CANCELED':
    case 'RETURNED':
      style = 'bg-red-100 text-red-800';
      break;
    case 'CANCEL_REJECTED':
    case 'RETURN_REJECTED':
      style = 'bg-pink-100 text-pink-800';
      break;
    default:
      style = 'bg-gray-100 text-gray-800';
  }

  return style;
};
