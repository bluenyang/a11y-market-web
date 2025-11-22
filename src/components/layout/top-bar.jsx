// import { logout } from '@/store/slices/authSlice';
import { Icon } from '@iconify/react';
import { Link, Navigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function TopBar() {
  const dispatch = useDispatch();

  // const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const handleLogout = () => {
    // Dispatch logout action
    // dispatch(logout());

    setIsLoggedIn(false);
    setUser({});
    Navigate({ to: '/' });
  };

  const handleTestLogin = () => {
    setIsLoggedIn(true);
    setUser({ username: 'TestUser' });
  };

  const menuItemStyle =
    'font-kakao-big text-md flex cursor-pointer items-center justify-center gap-1 text-center font-bold text-neutral-700 hover:text-blue-500 2xl:text-lg dark:text-neutral-300 dark:hover:text-blue-400';

  useEffect(() => {});

  const menuItems = (itemStyle) => {
    if (isLoggedIn) {
      return (
        <>
          <li aria-label='사용자 이름'>
            <span
              className={`${itemStyle} pt-1 2xl:pt-[0.125em]`}
              aria-label='사용자 이름 표시'
            >
              {user.username || '사용자'}님
            </span>
          </li>
          <li aria-label='로그아웃'>
            <span
              onClick={handleLogout}
              className={itemStyle}
              aria-label='로그아웃 버튼'
            >
              <Icon
                icon='mdi:logout'
                className='h-8 w-8'
              />
              로그아웃
            </span>
          </li>
          <li aria-label='마이페이지'>
            <Link
              to='/profile'
              className={itemStyle}
              aria-label='마이페이지로 이동'
            >
              <Icon
                icon='mdi:account-circle'
                className='h-8 w-8'
              />
              마이페이지
            </Link>
          </li>
          <li aria-label='장바구니'>
            <Link
              to='/cart'
              className={itemStyle}
              aria-label='장바구니로 이동'
            >
              <Icon
                icon='mdi:cart'
                className='h-8 w-8'
              />
              장바구니
            </Link>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li aria-label='로그인'>
            {/* <Link
                  to='/login'
                  className={itemStyle}
                >
                  로그인
                </Link> */}
            <span
              onClick={handleTestLogin}
              className={itemStyle}
              aria-label='로그인 버튼'
            >
              {/* <span className='icon-[line-md--login] w-8 h-8 mt-1'></span> */}
              <Icon
                icon='mdi:login'
                className='h-8 w-8'
              />
              로그인
            </span>
          </li>
          <li aria-label='회원가입'>
            <Link
              to='/register'
              className={itemStyle}
              aria-label='회원가입 페이지로 이동'
            >
              <Icon
                icon='mdi:account-plus'
                className='h-8 w-8'
              />
              회원가입
            </Link>
          </li>
          <li aria-label='장바구니'>
            <Link
              to='/cart'
              className={itemStyle}
              aria-label='장바구니로 이동'
            >
              <Icon
                icon='mdi:cart'
                className='h-8 w-8'
              />
              장바구니
            </Link>
          </li>
        </>
      );
    }
  };

  return (
    <header
      className='fixed top-0 z-50 flex min-w-full items-center justify-start bg-white p-4 shadow-md xl:justify-between dark:bg-neutral-800'
      aria-label='상단 헤더 바'
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            className='xl:hidden'
            aria-label='메뉴 열기'
          >
            <Icon
              icon='mdi:menu'
              width={12}
              height={12}
            />
          </Button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='w-64'
        >
          <SheetHeader>
            <SheetTitle>메뉴</SheetTitle>
          </SheetHeader>
          <ul
            className='mt-4 flex flex-col space-y-4'
            aria-label='주요 내비게이션 메뉴'
          >
            {menuItems(menuItemStyle)}
          </ul>
        </SheetContent>
      </Sheet>
      <h1 className='font-kakao-big ml-4 text-4xl font-extrabold'>
        <Link
          to='/'
          className='text-neutral-800 hover:text-neutral-500 dark:text-neutral-200'
          aria-label='에일리마켓 홈으로 이동'
        >
          A11yMARKET
        </Link>
      </h1>

      <div className='hidden w-md flex-row items-center justify-center rounded-md border border-neutral-300 px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 xl:flex 2xl:w-xl dark:border-neutral-600 dark:bg-neutral-700 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400'>
        <input
          type='text'
          placeholder='검색어를 입력하세요'
          className='h-full flex-1 bg-transparent text-xl outline-none'
          aria-label='검색어 입력'
        />
        <Link
          to='/search'
          className='ml-2 text-neutral-600 hover:text-blue-500 dark:text-neutral-300 dark:hover:text-blue-400'
          aria-label='검색하기 버튼'
        >
          <Icon
            icon='mdi:magnify'
            width={20}
            height={20}
          />
        </Link>
      </div>

      <nav
        id='menu'
        className='hidden items-center justify-end xl:flex'
        aria-label='주요 내비게이션 메뉴'
      >
        <ul
          className='mr-8 flex space-x-6'
          aria-label='메뉴 항목 리스트'
        >
          {menuItems(menuItemStyle)}
        </ul>
      </nav>
    </header>
  );
}
