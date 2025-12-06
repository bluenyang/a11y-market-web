import { ROLES } from '@/constants/roles';

const menuItems = [
  { label: '회원 정보', path: '/mypage', redirect: false },
  { label: '내 프로필', path: '/mypage/profile', redirect: false },
  { label: '주문 내역', path: '/mypage/order', redirect: false },
  { label: '접근성 프로필', path: '/mypage/a11y', redirect: false },
  { label: '배송지 관리', path: '/mypage/address', redirect: false },
];

const userItems = [{ label: '판매자 신청', path: '/seller/apply', redirect: true }];

const sellerItems = [{ label: '판매자 센터', path: '/seller/dashboard', redirect: true }];

export const getMyPageMenu = (userRole) => {
  if (userRole === ROLES.USER) {
    return [...menuItems, ...userItems];
  } else if (userRole === ROLES.SELLER) {
    return [...menuItems, ...sellerItems];
  } else if (userRole === ROLES.ADMIN) {
    return [...menuItems];
  } else {
    return [...menuItems];
  }
};
