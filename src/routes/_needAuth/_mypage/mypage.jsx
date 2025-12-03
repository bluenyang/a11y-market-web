import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/_needAuth/_mypage/mypage')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  // 내비게이션 메뉴
  /*
    { label: '메뉴명', path: '/mypage/파일명' },
  */
  const menuItems = [
    { label: '회원 정보', path: '/mypage' },
    { label: '주문 내역', path: '/mypage/order' },
    { label: '접근성 프로필', path: '/mypage/a11y' },
    { label: '배송지 관리', path: '/mypage/address' },
    { label: '회원 정보 수정', path: '/mypage/editProfile' },
  ];

  // 내비게이션 경로 표시 상단바
  const navPathLabel = () => {
    const item = menuItems.find((m) => m.path === currentPath);
    const base = 'A11y Market > 마이페이지';
    if (!item) return base;
    return `${base} > ${item.label}`;
  };

  return (
    <div className='font-kakao-big flex min-h-screen w-full bg-neutral-50'>
      <aside
        className='flex w-48 flex-col border-r bg-neutral-100 p-2'
        aria-label='마이페이지 메뉴 보조 영역'
      >
        {/* Navigation Buttons */}
        <nav className='flex w-full max-w-full flex-col'>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative rounded-md px-8 py-4 text-lg font-bold transition-colors ${isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'} `}
              >
                {isActive && (
                  <motion.span
                    layoutId='sidebar-active-bg'
                    className='absolute inset-0 rounded-md bg-neutral-300'
                    style={{ zIndex: 0 }}
                    transition={{ type: 'spring', stiffness: 530, damping: 30 }}
                  />
                )}
                <span className='relative z-10'>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Page Content */}
      <main
        className='flex flex-1 flex-col'
        aria-label='마이페이지 내용 영역'
      >
        {/* Top NavPathLabel bar */}
        <div className='w-full border-b border-neutral-300 bg-neutral-100 px-6 py-3 font-medium text-neutral-800'>
          {navPathLabel()}
        </div>

        {/* Page content */}
        <div className='flex-1'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
