const ProectStatusMapping = {
  PENDING: '승인 대기',
  APPROVED: '판매 중',
  REJECTED: '승인 거절',
  PAUSED: '판매 중지',
  DELETED: '삭제됨',
};

export const getProductStatusLabel = (status) => {
  return ProectStatusMapping[status] || '알 수 없음';
};

export const getProductStatusStyle = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-blue-100 text-blue-800 border-blue-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-800';
    case 'PAUSED':
      return 'bg-yellow-100 text-yellow-800 border-yellow-800';
    case 'DELETED':
      return 'bg-black text-white border-black';
    default:
      return 'bg-neutral-100 text-neutral-800 border-neutral-800';
  }
};
