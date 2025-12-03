// src/store/a11ySlice.js
import { createSlice } from '@reduxjs/toolkit';

// 전역 접근성 초기 상태
const initialState = {
  // 대비 단계 : 0(기본) 1(반전), 2(다크), 3(라이트)
  contrastLevel: 0,

  // 글자 크기 단계 : 0(기본), 1(크게), 2(많이 크게)
  textSizeLevel: 0,

  // 텍스트 간격: 0(기본), 1(넓게), 2(많이 넓게)
  textSpacingLevel: 0,

  // 텍스트 정렬 : 'left' | 'center' | 'right'
  textAlign: 'left',

  // 줄 간격: 0(기본), 1(넓게), 2(많이 넓게)
  lineHeightLevel: 0,

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
    cycleContrast(state) {
      // 대비 단계 순환
      state.contrastLevel = (state.contrastLevel + 1) % 4;
    },
    cycleTextSize(state) {
      // 글자 크기 단계 순환
      state.textSizeLevel = (state.textSizeLevel + 1) % 3;
    },
    cycleTextSpacing(state) {
      // 텍스트 간격 순환
      state.textSpacingLevel = (state.textSpacingLevel + 1) % 3;
    },
    cycleLineHeight(state) {
      // 줄 간격 순환
      state.lineHeightLevel = (state.lineHeightLevel + 1) % 3;
    },
    cycleTextAlign(state) {
      // 왼/가운데/오른쪽 순환
      if (state.textAlign === 'left') state.textAlign = 'center';
      else if (state.textAlign === 'center') state.textAlign = 'right';
      else state.textAlign = 'left';
    },

    toggleScreenReader(state) {
      // 스크린 리더 on/off
      state.screenReader = !state.screenReader;
    },
    toggleSmartContrast(state) {
      // 스마트 대비 on/off
      state.smartContrast = !state.smartContrast;
    },
    toggleHighlightLinks(state) {
      // 링크 강조 on/off
      state.highlightLinks = !state.highlightLinks;
    },
    toggleCursorHighlight(state) {
      // 마우스 커서 강조 on/off
      state.cursorHighlight = !state.cursorHighlight;
    },

    resetAll(state) {
      //모든 옵션 초기화
      Object.assign(state, initialState);
    },

    setAllA11y(state, action) {
      return { ...state, ...action.payload };
    },

    loadA11y(state, action) {
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
