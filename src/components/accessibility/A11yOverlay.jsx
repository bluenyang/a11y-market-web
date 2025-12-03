// src/components/A11y/A11yOverlay.jsx

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { A11Y_PROFILES } from '@/lib/a11y/profiles';
import {
  cycleContrast,
  cycleLineHeight,
  cycleTextAlign,
  cycleTextSize,
  cycleTextSpacing,
  resetAll,
  toggleCursorHighlight,
  toggleHighlightLinks,
  toggleScreenReader,
  toggleSmartContrast,
} from '@/store/a11ySlice';
import {
  AArrowUp,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Check,
  Contrast,
  Lightbulb,
  Link,
  MousePointer,
  Plus,
  StretchHorizontal,
  Volume2,
} from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import A11yOverlaySave from './A11yOverlaySave';

const languages = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

export default function A11yOverlay({ open, onClose, reloadProfiles }) {
  const dispatch = useDispatch();

  const a11yState = useSelector((state) => state.a11y);

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ko');
  const [selectedProfile, setSelectedProfile] = useState(null); // vision/ cognitive/ screenReader/ senior/ custom
  const [selectedSubMode, setSelectedSubMode] = useState(null);

  //전역 상태
  const {
    contrastLevel,
    textSizeLevel,
    textSpacingLevel,
    lineHeightLevel,
    textAlign,
    screenReader,
    smartContrast,
    highlightLinks,
    cursorHighlight,
  } = a11yState;

  // 프로필 설정 적용
  const applyProfileSettings = (settings) => {
    if (!settings) return;

    if (settings.contrastLevel !== undefined) {
      for (let i = 0; i < settings.contrastLevel; i++) dispatch(cycleContrast());
    }
    if (settings.textSizeLevel !== undefined) {
      for (let i = 0; i < settings.textSizeLevel; i++) dispatch(cycleTextSize());
    }
    if (settings.textSpacingLevel !== undefined) {
      for (let i = 0; i < settings.textSpacingLevel; i++) dispatch(cycleTextSpacing());
    }

    if (settings.lineHeightLevel !== undefined) {
      for (let i = 0; i < settings.lineHeightLevel; i++) dispatch(cycleLineHeight());
    }
    if (settings.textAlign !== undefined) {
      dispatch(cycleTextAlign(settings.textAlign));
    }
    if (settings.smartContrast !== undefined) {
      dispatch(toggleSmartContrast(settings.smartContrast));
    }
    if (settings.highlightLinks !== undefined) {
      dispatch(toggleHighlightLinks(settings.highlightLinks));
    }

    if (settings.screenReader !== undefined) {
      dispatch(toggleScreenReader(settings.screenReader));
    }
  };

  //열리지 않으면 아무것도 렌더링하지 않음
  if (!open) return null;

  const iconSize = 'size-10';
  const boxBase =
    'relative flex flex-col items-center justify-center gap-2 rounded-xl border bg-gray-100 px-4 py-20 text-sm cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0';
  const contrastLabels = ['기본 대비', '색 반전', '다크', '라이트'];

  return (
    <Sheet
      open={open}
      onOpenChange={onClose}
    >
      <SheetContent
        side='right'
        className='flex w-full max-w-sm flex-col p-0'
        role='dialog'
        aria-label='접근성 설정 패널'
      >
        {/* 고정 헤더 */}
        <SheetHeader className='border-b p-4'>
          <SheetTitle className='font-kakao-big text-lg font-bold'>
            접근성 설정 메뉴 (CTRL + U)
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>
          {/* 언어 / 프로필 (일단 UI만, 나중에 기능 붙이기) */}
          <div className='space-y-3 border-b px-4 pb-6'>
            {/* 언어 선택 */}
            <div>
              <label className='text-sm font-medium'>언어</label>
              <Select
                value={selectedLang}
                onValueChange={(val) => setSelectedLang(val)}
              >
                <SelectTrigger
                  className='mt-1 w-full'
                  aria-label='언어 선택 드롭다운'
                >
                  <SelectValue placeholder='언어 선택' />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.code}
                      value={lang.code}
                      aria-label={`언어 선택: ${lang.label}`}
                    >
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='text-sm font-medium'>접근성 프로필</label>
              <Select
                value={selectedProfile ?? ''}
                onValueChange={(val) => {
                  setSelectedProfile(val);
                  setSelectedSubMode(null); //세부 모드 초기화
                }}
              >
                <SelectTrigger
                  className='mt-1 w-full'
                  aria-label='접근성 프로필 선택'
                >
                  <SelectValue placeholder='프로필 선택' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(A11Y_PROFILES).map(([key, profile]) => (
                    <SelectItem
                      key={key}
                      value={key}
                      aria-label={`접근성 프로필: ${profile.label}`}
                    >
                      {profile.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 세부 모드 (custom 제외) */}
            {selectedProfile &&
              selectedProfile !== 'custom' &&
              A11Y_PROFILES[selectedProfile].items.length > 0 && (
                <div>
                  <label className='text-sm font-medium'>세부 모드 선택</label>

                  <Select
                    value={selectedSubMode ?? ''}
                    onValueChange={(modeId) => {
                      setSelectedSubMode(modeId);

                      const selectedMode = A11Y_PROFILES[selectedProfile].items.find(
                        (item) => item.id === modeId,
                      );

                      if (selectedMode) applyProfileSettings(selectedMode.settings);
                    }}
                  >
                    <SelectTrigger
                      className='mt-1 w-full'
                      aria-label='접근성 세부 모드 선택'
                    >
                      <SelectValue placeholder='세부 모드 선택' />
                    </SelectTrigger>

                    <SelectContent>
                      {A11Y_PROFILES[selectedProfile].items.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                          aria-label={`세부 모드: ${item.name}`}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
          </div>

          {/* 옵션 그리드 */}
          <div className='grid flex-1 grid-cols-3 gap-3 px-4 py-4'>
            {/* 1행 */}
            <Button
              variant='outline'
              aria-label='스크린 리더 모드'
              aria-pressed={screenReader}
              className={`${boxBase} ${screenReader ? 'border-black bg-gray-200' : ''} hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50`}
              onClick={() => dispatch(toggleScreenReader())}
            >
              <Volume2
                className={iconSize}
                strokeWidth={2}
              />
              <span>스크린 리더</span>

              {screenReader && (
                <Check
                  className='absolute top-2 right-2 size-5 text-blue-600'
                  strokeWidth={3}
                />
              )}
            </Button>

            <Button
              variant='outline'
              aria-label='대비 조절'
              aria-pressed={contrastLevel > 0}
              onClick={() => dispatch(cycleContrast())}
              className={`${boxBase} ${contrastLevel > 0 ? 'border-black bg-gray-200' : ''} hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50`}
            >
              <Contrast
                className={iconSize}
                strokeWidth={2}
              />
              <span>{contrastLabels[contrastLevel]}</span>

              {/* 체크표시 */}
              {contrastLevel > 0 && (
                <Check
                  className='absolute top-2 right-2 size-5 text-blue-600'
                  strokeWidth={3}
                />
              )}

              {/* 단계 바 */}
              <div className='mt-3 flex gap-1'>
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-1 w-6 rounded-full ${
                      contrastLevel >= step ? 'bg-blue-600' : 'bg-blue-300'
                    }`}
                  />
                ))}
              </div>
            </Button>
            <Button
              variant='outline'
              aria-label='스마트 대비 적용'
              aria-pressed={smartContrast}
              onClick={() => dispatch(toggleSmartContrast())}
              className={`${boxBase} ${smartContrast ? 'border-black bg-gray-200' : ''} hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50`}
            >
              <Lightbulb
                className={iconSize}
                strokeWidth={2}
              />
              <span>스마트 대비</span>

              {smartContrast && (
                <Check
                  className='absolute top-2 right-2 size-5 text-blue-600'
                  strokeWidth={3}
                />
              )}
            </Button>
            {/* 2행 */}
            <Button
              variant='outline'
              aria-label='링크 강조 표시'
              aria-pressed={highlightLinks}
              className={`${boxBase} ${highlightLinks ? 'border-black bg-gray-200' : ''} hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50`}
              onClick={() => dispatch(toggleHighlightLinks())}
            >
              <Link
                className={iconSize}
                strokeWidth={2}
              />
              <span>링크 강조 표시</span>

              {highlightLinks && (
                <Check
                  className='absolute top-2 right-2 size-5 text-blue-600'
                  strokeWidth={3}
                />
              )}
            </Button>
            <Button
              variant='outline'
              aria-label='글자 크기 조절'
              aria-pressed={textSizeLevel > 0}
              className={`${boxBase} ${textSizeLevel > 0 ? 'border-black bg-gray-200' : ''} hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50`}
              onClick={() => dispatch(cycleTextSize())}
            >
              <AArrowUp
                className={iconSize}
                strokeWidth={2}
              />
              <span>큰 글씨</span>

              {textSizeLevel > 0 && (
                <Check
                  className='absolute top-2 right-2 size-5 text-blue-600'
                  strokeWidth={3}
                />
              )}

              {/* 단계 바 */}
              <div className='mt-3 flex gap-1'>
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-1 w-6 rounded-full ${
                      textSizeLevel >= step ? 'bg-blue-600' : 'bg-blue-300'
                    }`}
                  />
                ))}
              </div>
            </Button>
            <Button
              variant='outline'
              aria-label='글자 간격 조절'
              aria-pressed={textSpacingLevel > 0}
              className={`${boxBase} ${textSpacingLevel > 0 ? 'border-black bg-gray-200' : ''} hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50`}
              onClick={() => dispatch(cycleTextSpacing())}
            >
              <StretchHorizontal
                className={iconSize}
                strokeWidth={2}
              />
              <span>자간 간격</span>

              {textSpacingLevel > 0 && (
                <Check
                  className='absolute top-2 right-2 size-5 text-blue-600'
                  strokeWidth={3}
                />
              )}

              {/* 단계 바 */}
              <div className='mt-3 flex gap-1'>
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-1 w-6 rounded-full ${
                      textSpacingLevel >= step ? 'bg-blue-600' : 'bg-blue-300'
                    }`}
                  />
                ))}
              </div>
            </Button>
            {/* 3행 */}
            <Button
              variant='outline'
              aria-label='마우스 커서 강조'
              aria-pressed={cursorHighlight}
              className={`${boxBase} ${cursorHighlight ? 'border-black bg-gray-200' : ''} hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50`}
              onClick={() => dispatch(toggleCursorHighlight())}
            >
              {cursorHighlight ? (
                <Plus
                  className={iconSize}
                  strokeWidth={2}
                />
              ) : (
                <MousePointer
                  className={iconSize}
                  strokeWidth={2}
                />
              )}

              <span>마우스 커서</span>

              {cursorHighlight && (
                <Check
                  className='absolute top-2 right-2 size-5 text-blue-600'
                  strokeWidth={3}
                />
              )}
            </Button>
            <Button
              variant='outline'
              aria-label='텍스트 정렬 변경'
              aria-pressed={textAlign !== 'left'}
              className={`${boxBase} ${textAlign !== 'left' ? 'border-black bg-gray-200' : ''} hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50`}
              onClick={() => dispatch(cycleTextAlign())}
            >
              {textAlign === 'left' && (
                <AlignLeft
                  className={iconSize}
                  strokeWidth={2}
                />
              )}
              {textAlign === 'center' && (
                <AlignCenter
                  className={iconSize}
                  strokeWidth={2}
                />
              )}
              {textAlign === 'right' && (
                <AlignRight
                  className={iconSize}
                  strokeWidth={2}
                />
              )}
              <span>텍스트 정렬</span>

              {textAlign !== 'left' && (
                <Check
                  className='absolute top-2 right-2 size-5 text-blue-600'
                  strokeWidth={3}
                />
              )}

              {/* 단계 바 */}
              {(() => {
                const textAlignLevel = textAlign === 'left' ? 0 : textAlign === 'center' ? 1 : 2;

                return (
                  <div className='mt-3 flex gap-1'>
                    {[1, 2].map((step) => (
                      <div
                        key={step}
                        className={`h-1 w-6 rounded-full ${
                          textAlignLevel >= step ? 'bg-blue-600' : 'bg-blue-300'
                        }`}
                      />
                    ))}
                  </div>
                );
              })()}
            </Button>
            <Button
              variant='outline'
              aria-label='줄 간격 확대'
              aria-pressed={lineHeightLevel > 0}
              className={`${boxBase} ${lineHeightLevel > 0 ? 'border-black bg-gray-200' : ''} hover:border-blue-500 hover:ring-2 hover:ring-blue-400/50`}
              onClick={() => dispatch(cycleLineHeight())}
            >
              <AlignJustify
                className={iconSize}
                strokeWidth={2}
              />
              <span>행 높이</span>

              {lineHeightLevel > 0 && (
                <Check
                  className='absolute top-2 right-2 size-5 text-blue-600'
                  strokeWidth={3}
                />
              )}

              {/* 단계 바 */}
              <div className='mt-3 flex gap-1'>
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-1 w-6 rounded-full ${
                      lineHeightLevel >= step ? 'bg-blue-600' : 'bg-blue-300'
                    }`}
                  />
                ))}
              </div>
            </Button>
          </div>

          {/* 하단 영역 */}
          <div className='space-y-3 border-t px-4 py-4'>
            <Button
              variant='default'
              className='w-full'
              aria-label='접근성 설정 초기화'
              onClick={() => dispatch(resetAll())}
            >
              모든 접근성 설정 리셋
            </Button>

            <Button
              variant='default'
              className='w-full'
              aria-label='접근성 설정 저장'
              onClick={() => setSaveModalOpen(true)}
            >
              저장하기
            </Button>

            <Button
              variant='default'
              className='w-full'
              aria-label='접근성 설정 닫기'
              onClick={onClose}
            >
              <span>위젯 숨기기/이동</span>
              <span>▼</span>
            </Button>

            <div className='pt-2 text-right text-sm font-semibold'>A11Y MARKET</div>
          </div>
        </div>
      </SheetContent>

      <A11yOverlaySave
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        reloadProfiles={reloadProfiles}
        a11yState={a11yState}
      />
    </Sheet>
  );
}
