import {
  A11yContrastClass,
  A11yCursorHighlightClass,
  A11yLineHeightClass,
  A11yLinkHighlightClass,
  A11ySmartContrastClass,
  A11yTextAlign,
  A11yTextAlignClass,
  A11yTextSizeClass,
  A11yTextSpacingClass,
} from '@/lib/a11y/a11yEnums';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useA11yEffect = () => {
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
    const classList = root.classList;

    const removeClasses = (prefix) => {
      Array.from(classList).forEach((cls) => {
        if (cls.startsWith(prefix) || cls === 'dark') {
          classList.remove(cls);
        }
      });
    };

    removeClasses('a11y-');

    // 대비
    if (contrastLevel) {
      classList.add(A11yContrastClass(contrastLevel));
    }
    if (textSizeLevel) {
      classList.add(A11yTextSizeClass(textSizeLevel));
    }
    if (textSpacingLevel) {
      classList.add(A11yTextSpacingClass(textSpacingLevel));
    }
    if (lineHeightLevel) {
      classList.add(A11yLineHeightClass(lineHeightLevel));
    }
    if (textAlign !== A11yTextAlign.LEFT) {
      classList.add(A11yTextAlignClass(textAlign));
    }
    if (smartContrast) {
      classList.add(A11ySmartContrastClass(smartContrast));
    }
    if (highlightLinks) {
      classList.add(A11yLinkHighlightClass(highlightLinks));
    }
    if (cursorHighlight) {
      classList.add(A11yCursorHighlightClass(cursorHighlight));
    }
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

  useEffect(() => {
    if (!screenReader) {
      window.speechSynthesis.cancel();
      return;
    }

    const speak = (text) => {
      if (!text || text.trim().length === 0) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    };

    const handleInteraction = (e) => {
      let target = e.target;
      if (!target) return;

      if (target.nodeType === Node.TEXT_NODE) {
        target = target.parentElement;
      }
      if (!target || typeof target.closest !== 'function') return;

      const elementToRead =
        target.closest(
          '[aria-label], [aria-labelledby], alt, input, button, a, textarea, [role="button"], [role="link"]',
        ) || target;

      if (elementToRead.tagName === 'HTML' || elementToRead.tagName === 'BODY') return;

      let textToRead = '';
      const ariaLabel = elementToRead.getAttribute('aria-label');

      if (ariaLabel) {
        textToRead = ariaLabel;
      } else if (elementToRead.getAttribute('aria-labelledby')) {
        const id = elementToRead.getAttribute('aria-labelledby');
        const labelledElement = document.getElementById(id);
        if (labelledElement) {
          textToRead = labelledElement.innerText;
        }
      } else if (role === 'option') {
        textToRead = elementToRead.innerText;
      } else {
        if (elementToRead.tagName === 'IMG') {
          textToRead = elementToRead.getAttribute('alt') || '';
        } else {
          textToRead = elementToRead.innerText || elementToRead.value || '';
        }
      }

      if (textToRead.length > 100) return;
      speak(textToRead);
    };

    window.addEventListener('focusin', handleInteraction);

    return () => {
      window.removeEventListener('focusin', handleInteraction);
    };
  }, [screenReader]);
};
