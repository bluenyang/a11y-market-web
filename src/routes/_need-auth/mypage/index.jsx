import { userApi } from '@/api/user-api';
import { LoadingEmpty } from '@/components/main/loading-empty';
import { A11ySetting } from '@/components/mypage/a11y-setting';
import { AccountInfo } from '@/components/mypage/account-info';
import { AddressManager } from '@/components/mypage/address-manager';
import { OrderHistory } from '@/components/mypage/order-history';
import { Widthdraw } from '@/components/mypage/widthdraw';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROLES } from '@/constants/roles';
import { cn } from '@/lib/utils';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { CircleX, FileText, LogOut, Scale, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/mypage/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    tab: search.tab,
  }),
});

function RouteComponent() {
  // 마이페이지 메뉴 항목 정의
  const menuItems = [
    { label: '회원 정보', value: 'info', redirect: false },
    { label: '주문 내역', value: 'order', redirect: false },
    { label: '접근성 프로필', value: 'a11y', redirect: false },
    { label: '배송지 관리', value: 'address', redirect: false },
    { label: '회원 탈퇴', value: 'withdraw', redirect: true },
  ];

  const { user, logout } = useSelector((state) => state.auth);
  const { tab } = Route.useSearch();

  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState('');
  const [sellerSubmitStatus, setSellerSubmitStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (tab && menuItems.some((item) => item.value === tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('info');
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await userApi.getProfile();

        setUserInfo(resp.data);
        setSellerSubmitStatus(resp.data.sellerSubmitStatus);
      } catch (err) {
        console.error('유저 정보 불러오기 실패:', err);
        toast.error('유저 정보 불러오기 실패. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/'); // 로그아웃 후 홈으로 이동
    toast('성공적으로 로그아웃되었습니다.', {
      description: '다음에 또 만나요!',
      action: {
        label: '닫기',
        onClick: () => toast.dismiss(),
      },
    });
  };

  const getRoleBadge = () => {
    switch (user?.userRole) {
      case ROLES.ADMIN:
        return (
          <Badge
            variant='secondary'
            className='rounded-full bg-red-100 px-2 py-1 text-xs text-red-700'
          >
            관리자
          </Badge>
        );
      case ROLES.SELLER:
        return (
          <Badge
            variant='secondary'
            className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700'
          >
            판매자
          </Badge>
        );
      default:
        return (
          <Badge
            variant='secondary'
            className='rounded-full bg-green-100 px-2 py-1 text-xs text-green-700'
          >
            일반 사용자
          </Badge>
        );
    }
  };

  const getSubmitStatusText = () => {
    switch (sellerSubmitStatus) {
      case 'PENDING':
        return (
          <>
            <Scale className='size-4 transition-all duration-400 group-hover:size-5' />
            <span>신청 심사 중</span>
          </>
        );
      case 'REJECTED':
        return (
          <>
            <CircleX className='size-4 text-red-500 transition-all duration-400 group-hover:size-5' />
            <span>신청 거절됨</span>
          </>
        );
      default:
        return (
          <>
            <FileText className='size-4 transition-all duration-400 group-hover:size-5' />
            <span>판매자 신청</span>
          </>
        );
    }
  };

  if (loading) {
    return (
      <main
        className='font-kakao-big flex-1 bg-neutral-50 dark:bg-neutral-900'
        aria-label='마이페이지 내용 영역'
      >
        <LoadingEmpty />
      </main>
    );
  }

  return (
    <main
      className='font-kakao-big flex-1 bg-neutral-50 dark:bg-neutral-900'
      aria-label='마이페이지 내용 영역'
    >
      <div className='mx-auto mt-8 w-full max-w-6xl'>
        <Item
          variant='outline'
          className='my-4 rounded-xl p-8 shadow-sm transition-shadow hover:shadow-md'
        >
          <ItemMedia>
            <Avatar
              alt='프로필 이미지'
              className='size-16 bg-neutral-200'
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <h1 className='text-2xl'>{`${userInfo.userNickname} 님`}</h1>
              {getRoleBadge()}
            </ItemTitle>
            <ItemDescription className='text-gray-600'>{user?.userEmail}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              variant='outline'
              size='lg'
              className='px-4 py-2 font-bold transition-all hover:cursor-pointer hover:shadow-md'
              onClick={handleLogout}
            >
              <LogOut className='size-4' />
              로그아웃
            </Button>
          </ItemActions>
        </Item>

        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className='mb-8 w-full'
        >
          <div className='md:flex md:gap-6'>
            <div className='mb-6 w-full space-y-2 md:w-64'>
              <TabsList className='w-full flex-wrap justify-start gap-2 bg-neutral-200 md:h-auto md:flex-col md:items-stretch md:gap-1 md:rounded-3xl dark:bg-neutral-800'>
                {menuItems.map((item) => (
                  <TabsTrigger
                    value={item.value}
                    key={item.value}
                    className={cn(
                      'relative z-10 transition-none data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:shadow-none',
                      'hover:text-foreground/80 md:min-h-12',
                    )}
                  >
                    <span className='relative z-20'>{item.label}</span>
                    {activeTab === item.value && (
                      <motion.div
                        layoutId='active-tab-indicator'
                        className='absolute inset-0 z-10 rounded-3xl bg-white shadow-md md:h-12 dark:bg-neutral-600'
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              {user?.userRole === ROLES.USER && (
                <Button
                  className='group w-full gap-2 shadow-md transition-all duration-400 hover:text-base md:h-12'
                  variant='outline'
                  disabled={!!sellerSubmitStatus}
                  onClick={() =>
                    navigate({
                      to: '/seller/apply',
                    })
                  }
                >
                  {getSubmitStatusText()}
                </Button>
              )}
              {user?.userRole === ROLES.SELLER && (
                <Button
                  onClick={() =>
                    navigate({
                      to: '/seller/dashboard',
                    })
                  }
                  className='group w-full gap-2 shadow-md transition-all duration-400 hover:text-base md:h-12'
                  variant='outline'
                >
                  <Store className='size-4 transition-all duration-400 group-hover:size-5' />
                  판매자 센터
                </Button>
              )}
            </div>

            {/* Page content */}
            <div className='min-w-0 flex-1'>
              <TabsContent value='info'>
                <AccountInfo />
              </TabsContent>

              <TabsContent value='order'>
                <OrderHistory />
              </TabsContent>

              <TabsContent value='a11y'>
                <A11ySetting />
              </TabsContent>

              <TabsContent value='address'>
                <AddressManager />
              </TabsContent>

              <TabsContent value='withdraw'>
                <Widthdraw />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
