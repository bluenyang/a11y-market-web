import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const copyrightYear = new Date().getFullYear();
  const copyrightYearText = `© 2025${copyrightYear === 2025 ? '' : ` - ${copyrightYear}`} GamesungCoding. All rights reserved.`;

  return (
    <>
      <footer
        className='min-h-40 w-full bg-neutral-300 py-6 dark:bg-neutral-600'
        aria-label='웹사이트 푸터 섹션'
      >
        <div className='font-kakao-big container mx-auto flex w-11/12 flex-col items-center justify-evenly space-x-4 px-4 xl:flex-row'>
          <div className='flex-1'>
            <h4 className='mb-2 text-xl font-extrabold'>A11yMARKET</h4>
            <div className='flex flex-col space-y-1'>
              <p
                className='text-base font-bold xl:text-lg'
                aria-label='고객 지원 전화번호 및 운영 시간 안내'
              >
                고객 지원: 1111-1111 09:00 ~ 18:00 KST
              </p>
              <ul
                className='list-inside list-disc text-base'
                aria-label='고객 지원 운영 시간 세부 안내'
              >
                <li aria-label='평일 상담'>평일: 전체 문의 상담</li>
                <li aria-label='토요일 상담'>토요일: A11yMARKET 주문 건 상담</li>
                <li aria-label='일요일/공휴일 상담'>일요일/공휴일: 휴무</li>
              </ul>
            </div>
          </div>
          <Separator
            orientation='horizontal'
            className='my-6 bg-neutral-400 xl:hidden dark:bg-neutral-500'
          />
          <Separator
            orientation='vertical'
            className='hidden min-h-30 bg-neutral-400 xl:block dark:bg-neutral-500'
          />
          <div className='grid flex-1 grid-cols-2 gap-x-8 gap-y-2 text-base'>
            <ul
              className='list-inside'
              aria-label='회사 관련 링크'
            >
              <li aria-label='회사소개 링크'>
                <a href='#'>회사소개</a>
              </li>
              <li aria-label='이용약관 링크'>
                <a href='#'>이용약관</a>
              </li>
              <li aria-label='전자금융거래약관 링크'>
                <a href='#'>공지사항</a>
              </li>
              <li aria-label='권리보호센터 링크'>
                <a href='#'>권리보호센터</a>
              </li>
              <li aria-label='입점신청 링크'>
                <a href='#'>입점신청</a>
              </li>
            </ul>
            <ul
              className='list-inside'
              aria-label='정책 및 안내 링크'
            >
              <li aria-label='제휴/광고 문의 링크'>
                <a href='#'>제휴/광고 문의</a>
              </li>
              <li aria-label='개인정보 처리방침 링크'>
                <a href='#'>개인정보 처리방침</a>
              </li>
              <li aria-label='파트너 개인정보 처리방침 링크'>
                <a href='#'>파트너 개인정보 처리방침</a>
              </li>
              <li aria-label='결제대행 위탁약관 링크'>
                <a href='#'>결제대행 위탁약관</a>
              </li>
              <li aria-label='사이트맵 링크'>
                <a href='#'>사이트맵</a>
              </li>
            </ul>
          </div>
          <Separator
            orientation='horizontal'
            className='my-6 bg-neutral-400 xl:hidden dark:bg-neutral-500'
          />
          <Separator
            orientation='vertical'
            className='hidden min-h-30 bg-neutral-400 xl:block dark:bg-neutral-500'
          />
          <div className='flex-1'>
            <ul aria-label='회사 정보'>
              <li aria-label='고객 지원 이메일'>support@croffledev.kr</li>
              <li aria-label='사업자등록번호'>사업자등록번호 | 123-45-67890</li>
              <li aria-label='사업자정보확인 링크'>
                <a
                  href='#'
                  className='hover:underline'
                >
                  사업자정보확인
                </a>
              </li>
              <li aria-label='통신판매업신고번호'>통신판매업신고번호 제2000-서울-1234호</li>
              <li aria-label='저작권 안내'>{copyrightYearText}</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
