import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import TopBar from '@/components/layout/top-bar';
import Footer from '@/components/layout/footer';
import A11yButton from '@/components/A11y/A11yButton';
import { useAuthInit } from '@/hooks/useAuthInit';
import { Spinner } from '@/components/ui/spinner';
import useA11yStorage from '@/hooks/useA11yStorage';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  useAuthInit();
  useA11yStorage();

  const isLoading = useSelector((state) => state.auth.isLoading);

  // a11y 상태 적용
  const {
    contrastLevel,
    textSizeLevel,
    textSpacingLevel,
    lineHeightLevel,
    textAlign,
    smartContrast,
    highlightLinks,
    cursorHighlight,
    screenReader,
  } = useSelector((state) => state.a11y);

  useEffect(() => {
    const root = document.documentElement;

    // 대비
    root.style.filter =
      contrastLevel === 0
        ? 'none'
        : contrastLevel === 1
          ? 'invert(1)'
          : contrastLevel === 2
            ? 'contrast(1.7) saturate(1.2)'
            : 'contrast(0.8) brightness(1.2)';

    //글자 크기
    root.style.fontSize = textSizeLevel === 0 ? '16px' : textSizeLevel === 1 ? '18px' : '20px';

    //글자 간격
    root.style.letterSpacing =
      textSpacingLevel === 0 ? 'normal' : textSpacingLevel === 1 ? '1px' : '2px';

    //줄 간격
    root.style.lineHeight = lineHeightLevel === 0 ? '1.4' : lineHeightLevel === 2 ? '1.8' : '2.2';

    //정렬
    root.style.textAlign = textAlign;

    //스마트 대비
    if (smartContrast) {
      const bgColor = getComputedStyle(document.body).backgroundColor;
      const rgb = bgColor.match(/\d+/g)?.map(Number);

      if (rgb) {
        const [r, g, b] = rgb;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness > 140) {
          root.style.filter = `contrast(1.6) brightness(0.9)`;
        } else {
          root.style.filter = `contrast(1.4) brightness(1.2)`;
        }
      }
    }

    //링크 강조
    if (highlightLinks) {
      document.querySelectorAll('a').forEach((a) => {
        a.style.backgroundColor = 'yellow';
        a.style.color = 'black';
      });
    } else {
      document.querySelectorAll('a').forEach((a) => {
        a.style.backgroundColor = '';
        a.style.color = '';
      });
    }

    // 커서 강조
    const a11yCrosshairBlack =
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><circle cx='32' cy='32' r='4' fill='black'/><line x1='32' y1='4' x2='32' y2='60' stroke='black' stroke-width='3'/><line x1='4' y1='32' x2='60' y2='32' stroke='black' stroke-width='3'/></svg>\") 32 32, auto";

    const a11yCrosshairBlue =
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><circle cx='32' cy='32' r='5' fill='%232563EB'/><line x1='32' y1='4' x2='32' y2='60' stroke='%232563EB' stroke-width='4'/><line x1='4' y1='32' x2='60' y2='32' stroke='%232563EB' stroke-width='4'/></svg>\") 32 32, auto";

    document.body.style.cursor = cursorHighlight ? a11yCrosshairBlack : 'default';

    document.querySelectorAll('button, a, [role="button"]').forEach((el) => {
      el.style.cursor = cursorHighlight ? a11yCrosshairBlue : 'pointer';
    });
  }, [
    contrastLevel,
    textSizeLevel,
    textSpacingLevel,
    lineHeightLevel,
    textAlign,
    smartContrast,
    highlightLinks,
    cursorHighlight,
  ]);

  // 스크린 리더
  useEffect(() => {
    if (!screenReader) return;

    const speak = (text) => {
      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    const handleFocus = (e) => {
      const target = e.target;
      const text = target.getAttribute('aria-label') || target.innerText || target.value;

      speak(text);
    };

    document.addEventListener('focusin', handleFocus);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      window.speechSynthesis.cancel();
    };
  }, [screenReader]);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-lg'>로딩 중...</p>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <div className='h-20'></div>
      <Outlet />
      <A11yButton />
      <Footer />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}
