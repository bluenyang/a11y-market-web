import type { A11ySettings } from '@/api/a11y/types';
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
import { useA11yActions, useA11yData } from '@/store/a11y-store';
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

import A11yOverlaySave from '@/components/accessibility/a11y-overlay-save';

const languages = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

interface A11yOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function A11yOverlay({ open, onClose }: A11yOverlayProps) {
  const a11yState = useA11yData();
  const a11yActions = useA11yActions();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ko');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null); // vision/ cognitive/ screenReader/ senior/ custom
  const [selectedSubMode, setSelectedSubMode] = useState<string | null>(null);

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
  const applyProfileSettings = (settings: Partial<A11ySettings>) => {
    if (!settings) return;

    if (settings.contrastLevel !== undefined) {
      // contrastLevel이 현재 레벨과 다르면 설정 (cycle 대신 직접 설정이 필요할 수 있음)
      // 기존 로직은 cycleContrast를 여러번 호출하는 방식이었음.
      // 여기서는 store에 setContrastLevel이 있으므로 그것을 사용하는 것이 좋음.
      // 하지만 settings.contrastLevel이 0, 1, 2 등의 값이라면 직접 set 하는게 맞음.
      // 기존 로직: for loop cycle... -> 비효율적.
      // store에 setContrastLevel이 있으므로 그것을 사용.
      a11yActions.setContrastLevel(settings.contrastLevel);
    }
    if (settings.textSizeLevel !== undefined) {
      a11yActions.setTextSizeLevel(settings.textSizeLevel);
    }
    if (settings.textSpacingLevel !== undefined) {
      a11yActions.setTextSpacingLevel(settings.textSpacingLevel);
    }

    if (settings.lineHeightLevel !== undefined) {
      a11yActions.setLineHeightLevel(settings.lineHeightLevel);
    }
    if (settings.textAlign !== undefined) {
      a11yActions.setTextAlign(settings.textAlign);
    }
    if (settings.smartContrast !== undefined) {
      // toggle 대신 직접 값 설정 필요하지만 actions에는 toggle만 있음.
      // 현재 값과 다르면 toggle 호출
      if (a11yState.smartContrast !== settings.smartContrast) {
        a11yActions.toggleSmartContrast();
      }
    }
    if (settings.highlightLinks !== undefined) {
      if (a11yState.highlightLinks !== settings.highlightLinks) {
        a11yActions.toggleHighlightLinks();
      }
    }

    if (settings.screenReader !== undefined) {
      if (a11yState.screenReader !== settings.screenReader) {
        a11yActions.toggleScreenReader();
      }
    }
  };

  //열리지 않으면 아무것도 렌더링하지 않음
  if (!open) return null;

  const iconSize = 'size-10';
  const boxBase =
    'relative flex flex-col items-center justify-center gap-2 rounded-xl border bg-gray-100 px-4 py-20 text-sm cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0';
  const contrastLabels = ['기본 대비', '색 반전', '고대비', '저대비'];

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

                      a11yActions.resetA11ySettings();

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
              onClick={() => a11yActions.toggleScreenReader()}
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
              onClick={() => {
                // cycle logic assumed in store not available directly as cycle, but can assume manual cycling or if store has cycle.
                // store: setContrastLevel.
                // We need to implement cycle logic here if store doesn't have it.
                // But wait, the original code used dispatch(cycleContrast()).
                // Let's check a11y-store.ts again if it has cycle actions.
                // It has setContrastLevel, toggle...
                // I should probably implement cycle logic here or add cycle actions to store.
                // For now, I will implement cycle logic here.
                const nextLevel = (contrastLevel + 1) % 4; // Assuming 4 levels based on labels
                a11yActions.setContrastLevel(nextLevel);
              }}
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
              onClick={() => a11yActions.toggleSmartContrast()}
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
              onClick={() => a11yActions.toggleHighlightLinks()}
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
              onClick={() => {
                const nextLevel = (textSizeLevel + 1) % 3; // Assuming 0, 1, 2
                a11yActions.setTextSizeLevel(nextLevel);
              }}
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
              onClick={() => {
                const nextLevel = (textSpacingLevel + 1) % 3;
                a11yActions.setTextSpacingLevel(nextLevel);
              }}
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
              onClick={() => a11yActions.toggleCursorHighlight()}
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
              onClick={() => {
                // left -> center -> right -> left
                let nextAlign = 'left';
                if (textAlign === 'left') nextAlign = 'center';
                else if (textAlign === 'center') nextAlign = 'right';
                else nextAlign = 'left';
                a11yActions.setTextAlign(nextAlign);
              }}
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
              onClick={() => {
                const nextLevel = (lineHeightLevel + 1) % 3;
                a11yActions.setLineHeightLevel(nextLevel);
              }}
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
              onClick={() => a11yActions.resetA11ySettings()}
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
        a11yState={a11yState}
      />
    </Sheet>
  );
}
