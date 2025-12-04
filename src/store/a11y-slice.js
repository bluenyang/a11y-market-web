// src/store/a11ySlice.js
import {
  A11yContrast,
  A11yLineHeight,
  A11yTextAlign,
  A11yTextSize,
  A11yTextSpacing,
} from '@/lib/a11y/a11yEnums';
import { createSlice } from '@reduxjs/toolkit';

// 전역 접근성 초기 상태
const initialState = {
  // 대비 단계 : 0(기본) 1(반전), 2(다크), 3(고대비), 4(저대비)
  contrastLevel: A11yContrast.NORMAL,

  // 글자 크기 단계 : 0(기본), 1(크게), 2(많이 크게)
  textSizeLevel: A11yTextSize.NORMAL,

  // 텍스트 간격: 0(기본), 1(넓게), 2(많이 넓게)
  textSpacingLevel: A11yTextSpacing.NORMAL,

  // 텍스트 정렬 : 'left' | 'center' | 'right'
  textAlign: A11yTextAlign.LEFT,

  // 줄 간격: 0(기본), 1(넓게), 2(많이 넓게)
  lineHeightLevel: A11yLineHeight.NORMAL,

  //토글류 옵션들
  screenReader: false,
  smartContrast: false,
  highlightLinks: false,
  cursorHighlight: false,
};

const a11ySlice = createSlice({
  name: 'a11y',
  initialState,
  reducers: {
    cycleContrast: (state) => {
      // 대비 단계 순환
      state.contrastLevel = (state.contrastLevel + 1) % A11yContrast.OPTION_SIZE;
    },
    cycleTextSize: (state) => {
      // 글자 크기 단계 순환
      state.textSizeLevel = (state.textSizeLevel + 1) % A11yTextSize.OPTION_SIZE;
    },
    cycleTextSpacing: (state) => {
      // 텍스트 간격 순환
      state.textSpacingLevel = (state.textSpacingLevel + 1) % A11yTextSpacing.OPTION_SIZE;
    },
    cycleLineHeight: (state) => {
      // 줄 간격 순환
      state.lineHeightLevel = (state.lineHeightLevel + 1) % A11yLineHeight.OPTION_SIZE;
    },
    cycleTextAlign: (state) => {
      const options = [A11yTextAlign.LEFT, A11yTextAlign.CENTER, A11yTextAlign.RIGHT];
      // 왼/가운데/오른쪽 순환
      const currentIndex = options.indexOf(state.textAlign);
      const nextIndex = (currentIndex + 1) % options.length;
      state.textAlign = options[nextIndex];
    },

    toggleScreenReader: (state) => {
      // 스크린 리더 on/off
      state.screenReader = !state.screenReader;
    },
    toggleSmartContrast: (state) => {
      // 스마트 대비 on/off
      state.smartContrast = !state.smartContrast;
    },
    toggleHighlightLinks: (state) => {
      // 링크 강조 on/off
      state.highlightLinks = !state.highlightLinks;
    },
    toggleCursorHighlight: (state) => {
      // 마우스 커서 강조 on/off
      state.cursorHighlight = !state.cursorHighlight;
    },

    resetAll: (state) => {
      //모든 옵션 초기화
      Object.assign(state, initialState);
    },

    setAllA11y: (state, action) => {
      return { ...state, ...action.payload };
    },

    loadA11y: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

// action, reducer export
export const {
  cycleContrast,
  cycleTextSize,
  cycleTextSpacing,
  cycleLineHeight,
  cycleTextAlign,
  toggleScreenReader,
  toggleSmartContrast,
  toggleHighlightLinks,
  toggleCursorHighlight,
  resetAll,
  setAllA11y,
  loadA11y,
} = a11ySlice.actions;

export default a11ySlice.reducer;
