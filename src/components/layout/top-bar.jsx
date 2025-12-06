// import { logout } from '@/store/slices/authSlice';
import { authApi } from '@/api/auth-api';
import { cartApi } from '@/api/cart-api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, ItemContent } from '@/components/ui/item';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { logout } from '@/store/auth-slice';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { LogIn, LogOut, Menu, Search, ShoppingCart, User, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Separator } from '../ui/separator';

export default function TopBar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const router = useRouterState();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API call failed:', err);
    } finally {
      dispatch(logout());
      navigate({ to: '/' });
    }
  };

  useEffect(() => {
    // pathname이 변경될 때마다 실행
    setIsMobileMenuOpen(false);
  }, [router.location.pathname]);

  const menuItems = () => (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to='/'
            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
          >
            전체 카테고리
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to='/'
            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
          >
            {'디지털/가전'}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to='/'
            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
          >
            {'패션/의류'}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to='/'
            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
          >
            건강
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to='/'
            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
          >
            스포츠
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to='/'
            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
          >
            식품
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            to='/'
            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
          >
            도서
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // 장바구니 아이템 수 가져오기
    const fetchCartItems = async () => {
      const resp = await cartApi.getCartItemNumber();
      setCartItemCount(resp.data?.count);
    };

    if (isAuthenticated) {
      fetchCartItems();
    } else {
      setCartItemCount(0);
    }
  }, [isAuthenticated]);

  return (
    <header className='font-kakao-big sticky top-0 z-50 border-b bg-white shadow-sm dark:bg-neutral-900'>
      <Item className='container mx-auto px-4 py-0'>
        <ItemContent className='h-16 flex-row items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Sheet
              open={isMobileMenuOpen}
              onOpenChange={setIsMobileMenuOpen}
              className='lg:hidden'
            >
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='lg:hidden'
                  aria-label='메뉴 열기'
                  aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
                >
                  <Menu className='size-6' />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='left'
                className='w-64'
              >
                <SheetHeader>
                  <SheetTitle>메뉴</SheetTitle>
                </SheetHeader>
                <div className='mt-4 w-full'>
                  <NavigationMenu className='w-full max-w-full p-0'>
                    <NavigationMenuList className='flex h-full flex-col space-y-2'>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to={isAuthenticated ? '/logout' : '/login'}
                            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
                          >
                            {isAuthenticated ? '로그아웃' : '로그인'}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to={isAuthenticated ? '/mypage' : '/join'}
                            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
                          >
                            {isAuthenticated ? '마이페이지' : '회원가입'}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to='/cart'
                            className='px-4 py-2 text-base font-bold hover:bg-white hover:underline hover:underline-offset-4 dark:hover:bg-neutral-800'
                          >
                            장바구니
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <Separator className='my-2 bg-neutral-400' />
                      {menuItems()}
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </SheetContent>
            </Sheet>
            <Link
              to='/'
              className='flex items-center gap-2'
              aria-label='에일리마켓 홈으로 이동'
            >
              <h1 className='hidden text-xl font-extrabold sm:block'>A11yMARKET</h1>
            </Link>
          </div>

          <Item className='mx-4 hidden max-w-xl flex-1 md:block'>
            <ItemContent className='relative'>
              <Search
                className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400'
                aria-hidden='true'
              />
              <Input
                type='search'
                placeholder='검색어를 입력하세요'
                className='pl-10'
                aria-label='검색어 입력'
              />
            </ItemContent>
          </Item>

          <Item>
            <ItemContent className='flex-row items-center gap-2'>
              {isAuthenticated && (
                <span
                  className='text-base text-neutral-800 dark:text-neutral-200'
                  aria-label='사용자 이름 표시'
                >
                  {user.userNickname || '사용자'}님
                </span>
              )}
              <Button
                variant='ghost'
                size='sm'
                aria-label={isAuthenticated ? '로그아웃 버튼' : '로그인 페이지로 이동'}
                onClick={() => (isAuthenticated ? handleLogout() : navigate({ to: '/login' }))}
                className='relative'
              >
                {isAuthenticated ? <LogOut className='size-5' /> : <LogIn className='size-5' />}
                <span className='sr-only'>
                  {isAuthenticated ? '마이페이지' : '회원가입 페이지'}
                </span>
              </Button>
              <Button
                variant='ghost'
                size='sm'
                aria-label={isAuthenticated ? '마이페이지로 이동' : '회원가입 페이지로 이동'}
                onClick={() => navigate({ to: isAuthenticated ? '/mypage' : '/join' })}
                className='relative'
              >
                {isAuthenticated ? <User className='size-5' /> : <UserPlus className='size-5' />}
                <span className='sr-only'>
                  {isAuthenticated ? '마이페이지' : '회원가입 페이지'}
                </span>
              </Button>
              <Button
                variant='ghost'
                size='sm'
                aria-label='장바구니로 이동'
                onClick={() => navigate({ to: '/cart' })}
                className='relative'
              >
                <ShoppingCart className='size-5' />
                {cartItemCount > 0 && (
                  <Badge className='absolute -top-1 -right-1 flex size-5 items-center justify-center p-0 text-xs'>
                    {cartItemCount}
                  </Badge>
                )}
                <span className='sr-only'>장바구니</span>
              </Button>
            </ItemContent>
          </Item>
        </ItemContent>
      </Item>
      <NavigationMenu className='hidden max-w-full border-t bg-neutral-50 lg:block dark:bg-neutral-800'>
        <NavigationMenuList className='container mx-auto justify-start px-4 py-2'>
          {menuItems()}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
