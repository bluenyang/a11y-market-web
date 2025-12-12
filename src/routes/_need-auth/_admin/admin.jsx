import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ROLES } from '@/constants/roles';
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const Route = createFileRoute('/_need-auth/_admin/admin')({
  component: RouteComponent,
  //beforeLoad: () => {} // 사용자 하위페이지 접근 검증
});

function RouteComponent() {
  // hooks
  const router = useRouterState();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.userRole !== ROLES.ADMIN) {
      navigate({
        to: '/unauthorized',
      });
    }
  });

  // variables and constants
  const currentPath = router.location.pathname;
  const menuItems = [
    { label: '대시보드', path: '/admin' },
    { label: '회원 관리', path: '/admin/users' },
    { label: '판매자 관리', path: '/admin/sellers' },
    { label: '판매자 승인 관리', path: '/admin/sellers/approval' },
    { label: '상품 관리', path: '/admin/products' },
    { label: '상품 승인 관리', path: '/admin/products/approval' },
    { label: '주문 관리', path: '/admin/orders' },
  ];

  // functions
  const getPathLabel = () => {
    const item = menuItems.find((m) => m.path === currentPath);
    if (!item) return '';
    return item.label;
  };

  return (
    <div className='flex min-h-screen w-full flex-col md:flex-row'>
      <aside
        className='flex w-full flex-col border-r md:w-48'
        aria-label='관리자 메뉴 보조 영역'
      >
        <h2 className='border-b border-neutral-500 p-6 py-3 text-center text-base font-bold'>
          관리자 메뉴
        </h2>

        {/* Navigation Buttons */}
        <div className='flex items-center'>
          <nav
            orientation='vertical'
            className='w-full'
            aria-label='관리자 페이지 내비게이션'
          >
            <ul
              className='flex w-full flex-row flex-wrap space-y-2 px-0 md:flex-col'
              aria-label='관리자 페이지 메뉴 목록'
            >
              {menuItems.map((item) => {
                const active = currentPath === item.path;
                return (
                  <li
                    key={item.path}
                    className='w-fit flex-1 text-center whitespace-nowrap md:w-full'
                    aria-label={`${item.label} 페이지로 이동`}
                  >
                    <Link
                      to={item.path}
                      aria-label={`${item.label} 페이지로 이동`}
                      className='relative z-10 block w-full rounded py-4 text-center text-base font-medium'
                    >
                      <span className='relative z-20 px-4'>{item.label}</span>
                      {active && (
                        <motion.div
                          layoutId='active-menu-indicator'
                          className='absolute inset-0 z-10 rounded-lg bg-neutral-200 shadow-md dark:bg-neutral-700'
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Page Content */}
      <main
        className='font-kakao-big flex flex-1 flex-col'
        aria-label='관리자페이지 내용 영역'
      >
        {/* Top NavPathLabel bar */}
        <div className='mb-4 w-full border-b border-neutral-500 px-6 py-3 font-bold'>
          <Breadcrumb aria-label='현재 페이지 경로'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to='/'>
                    <span className='text-primary text-base hover:underline'>A11yMARKET</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to='/admin'>
                    <span className='text-primary text-base hover:underline'>관리자페이지</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className='text-primary text-base'>{getPathLabel()}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page content */}
        <div className='flex-1 p-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
