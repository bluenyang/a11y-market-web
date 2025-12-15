import {
  ArchiveX,
  FileCheck,
  MessageSquareX,
  Package,
  PackageCheck,
  PackageOpen,
  TicketCheck,
  TicketX,
  Timer,
  Truck,
} from 'lucide-react';

export const orderItemStatusAlert = {
  ORDERD: {
    label: '결제 대기',
    description: '주문서는 발행되었으나, 결제 대기 상태입니다.',
    color:
      'bg-violet-200 border-violet-600 text-violet-900 dark:bg-violet-900 dark:border-violet-400 dark:text-violet-200',
    icon: <Timer />,
  },
  PAID: {
    label: '결제완료',
    description: '결제가 완료되어 상품 준비 중입니다.',
    color:
      'bg-blue-200 border-blue-600 text-blue-900 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200',
    icon: <FileCheck />,
  },
  REJECTED: {
    label: '주문거절',
    description: '주문이 거절되었습니다.',
    color:
      'bg-red-200 border-red-600 text-red-900 dark:bg-red-900 dark:border-red-400 dark:text-red-200',
    icon: <ArchiveX />,
  },
  ACCEPTED: {
    label: '주문승인',
    description: '배송준비 중입니다.',
    color:
      'bg-purple-200 border-purple-600 text-purple-900 dark:bg-purple-900 dark:border-purple-400 dark:text-purple-200',
    icon: <Package />,
  },
  SHIPPING: {
    label: '배송중',
    description: '상품이 배송 중입니다.',
    color:
      'bg-yellow-200 border-yellow-600 text-yellow-900 dark:bg-yellow-900 dark:border-yellow-400 dark:text-yellow-200',
    icon: <Truck />,
  },
  SHIPPED: {
    label: '배송완료',
    description: '상품이 배송 완료되었습니다.',
    color:
      'bg-indigo-200 border-indigo-600 text-indigo-900 dark:bg-indigo-900 dark:border-indigo-400 dark:text-indigo-200',
    icon: <PackageCheck />,
  },
  CONFIRMED: {
    label: '구매확정',
    description: '상품의 구매를 확정하였습니다.',
    color:
      'bg-teal-200 border-teal-600 text-teal-900 dark:bg-teal-900 dark:border-teal-400 dark:text-teal-200',
    icon: <PackageOpen />,
  },
  CANCEL_PENDING: {
    label: '취소요청',
    description: '주문 취소 요청이 접수되었습니다.',
    color:
      'bg-orange-200 border-orange-600 text-orange-900 dark:bg-orange-900 dark:border-orange-400 dark:text-orange-200',
    icon: <MessageSquareX />,
  },
  CANCELED: {
    label: '주문취소',
    description: '주문이 취소되었습니다.',
    color:
      'bg-neutral-200 border-neutral-600 text-neutral-900 dark:bg-neutral-700 dark:border-neutral-400 dark:text-neutral-200',
    icon: <TicketCheck />,
  },
  CANCEL_REJECTED: {
    label: '취소거절',
    description: '주문 취소 요청이 거절되었습니다.',
    color:
      'bg-red-200 border-red-600 text-red-900 dark:bg-red-900 dark:border-red-400 dark:text-red-200',
    icon: <TicketX />,
  },
};
