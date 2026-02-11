import type { A11ySettings } from '@/api/a11y/types';
import { A11yOptionCard } from '@/components/accessibility/a11y-option-card';
import A11yOverlaySave from '@/components/accessibility/a11y-overlay-save';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  A11yContrast,
  A11yLineHeight,
  A11yTextAlign,
  A11yTextSize,
  A11yTextSpacing,
} from '@/lib/a11y/a11yEnums';
import { A11Y_PROFILES } from '@/lib/a11y/profiles';
import { useA11yActions, useA11yData } from '@/store/a11y-store';
import {
  AArrowUp,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Contrast,
  Lightbulb,
  Link,
  MousePointer,
  PersonStanding,
  StretchHorizontal,
  Volume2,
} from 'lucide-react';
import { useState } from 'react';

interface A11yMenuProps {
  child?: React.ReactNode;
}

export const A11yMenu = ({ child }: A11yMenuProps) => {
  //전역 상태
  const a11yState = useA11yData();

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

  const {
    setContrastLevel,
    setTextSizeLevel,
    setTextSpacingLevel,
    setLineHeightLevel,
    setTextAlign,
    toggleSmartContrast,
    toggleHighlightLinks,
    toggleCursorHighlight,
    toggleScreenReader,
    saveA11ySettings,
    resetA11ySettings,
  } = useA11yActions();

  const cycleLevel = (currentLevel: number, maxLevel: number) => {
    return (currentLevel + 1) % maxLevel;
  };

  const cycleTextAlign = () => {
    return textAlign === A11yTextAlign.LEFT
      ? A11yTextAlign.CENTER
      : textAlign === A11yTextAlign.CENTER
        ? A11yTextAlign.RIGHT
        : A11yTextAlign.LEFT;
  };

  const setAllA11y = (settings: Partial<A11ySettings>) => {
    const newSettings = {
      ...settings,
      contrastLevel: settings.contrastLevel || contrastLevel,
      textSizeLevel: settings.textSizeLevel || textSizeLevel,
      textSpacingLevel: settings.textSpacingLevel || textSpacingLevel,
      lineHeightLevel: settings.lineHeightLevel || lineHeightLevel,
      textAlign: settings.textAlign || textAlign,
      smartContrast: settings.smartContrast || smartContrast,
      highlightLinks: settings.highlightLinks || highlightLinks,
      cursorHighlight: settings.cursorHighlight || cursorHighlight,
      screenReader: settings.screenReader || screenReader,
    };
    saveA11ySettings(newSettings);
  };

  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>('ko');
  const [selectedProfile, setSelectedProfile] = useState<string>(''); // vision/ cognitive/ screenReader/ senior/ custom
  const [selectedSubMode, setSelectedSubMode] = useState<string>('');

  const iconStyle = {
    class: 'size-10 mt-4',
    stroke: 2,
  };

  const AlignIcon =
    textAlign === 'center' ? (
      <AlignCenter
        className={iconStyle.class}
        strokeWidth={iconStyle.stroke}
      />
    ) : textAlign === 'right' ? (
      <AlignRight
        className={iconStyle.class}
        strokeWidth={iconStyle.stroke}
      />
    ) : (
      <AlignLeft
        className={iconStyle.class}
        strokeWidth={iconStyle.stroke}
      />
    );
  const contrastLabels = ['기본 대비', '다크모드', '색 반전', '고대비', '저대비'];

  const a11yItems = [
    {
      label: '스크린 리더',
      icon: (
        <Volume2
          className={iconStyle.class}
          strokeWidth={iconStyle.stroke}
        />
      ),
      isActive: screenReader,
      onClick: () => toggleScreenReader(),
    },
    {
      label: contrastLabels[contrastLevel],
      icon: (
        <Contrast
          className={iconStyle.class}
          strokeWidth={iconStyle.stroke}
        />
      ),
      isActive: contrastLevel > 0,
      steps: A11yContrast.OPTION_SIZE - 1,
      currentStep: contrastLevel,
      onClick: () => setContrastLevel(cycleLevel(contrastLevel, A11yContrast.OPTION_SIZE)),
    },
    {
      label: '스마트 대비',
      icon: (
        <Lightbulb
          className={iconStyle.class}
          strokeWidth={iconStyle.stroke}
        />
      ),
      isActive: smartContrast,
      onClick: () => toggleSmartContrast(),
    },
    {
      label: '링크 강조',
      icon: (
        <Link
          className={iconStyle.class}
          strokeWidth={iconStyle.stroke}
        />
      ),
      isActive: highlightLinks,
      onClick: () => toggleHighlightLinks(),
    },
    {
      label: '글자 크기',
      icon: (
        <AArrowUp
          className={iconStyle.class}
          strokeWidth={iconStyle.stroke}
        />
      ),
      isActive: textSizeLevel > 0,
      steps: A11yTextSize.OPTION_SIZE - 1,
      currentStep: textSizeLevel,
      onClick: () => setTextSizeLevel(cycleLevel(textSizeLevel, A11yTextSize.OPTION_SIZE)),
    },
    {
      label: '자간 간격',
      icon: (
        <StretchHorizontal
          className={iconStyle.class}
          strokeWidth={iconStyle.stroke}
        />
      ),
      isActive: textSpacingLevel > 0,
      steps: A11yTextSpacing.OPTION_SIZE - 1,
      currentStep: textSpacingLevel,
      onClick: () => setTextSpacingLevel(cycleLevel(textSpacingLevel, A11yTextSpacing.OPTION_SIZE)),
    },
    {
      label: '커서 강조',
      icon: (
        <MousePointer
          className={iconStyle.class}
          strokeWidth={iconStyle.stroke}
        />
      ),
      isActive: cursorHighlight,
      onClick: () => toggleCursorHighlight(),
    },
    {
      label: '텍스트 정렬',
      icon: AlignIcon,
      isActive: textAlign !== 'left',
      steps: A11yTextAlign.OPTION_SIZE - 1,
      currentStep: A11yTextAlign.getA11yTextAlignStep(textAlign),
      onClick: () => setTextAlign(cycleTextAlign()),
    },
    {
      label: '행 높이',
      icon: (
        <AlignJustify
          className={iconStyle.class}
          strokeWidth={iconStyle.stroke}
        />
      ),
      isActive: lineHeightLevel > 0,
      steps: A11yLineHeight.OPTION_SIZE - 1,
      currentStep: lineHeightLevel,
      onClick: () => setLineHeightLevel(cycleLevel(lineHeightLevel, A11yLineHeight.OPTION_SIZE)),
    },
  ];
  const languages = [{ code: 'ko', label: '한국어' }];

  const applyProfileSettings = (modeId: string) => {
    setSelectedSubMode(modeId);
    resetA11ySettings();

    const selectedMode = A11Y_PROFILES[selectedProfile].items.find((item) => item.id === modeId);
    if (!selectedMode || !selectedMode.settings) return;

    setAllA11y(selectedMode.settings);
  };

  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={setSheetOpen}
      aria-label='접근성 설정 메뉴'
    >
      <SheetTrigger asChild>
        {child || (
          <Button
            aria-label='접근성 설정 열기'
            className='fixed right-8 bottom-8 z-50 flex size-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700'
          >
            <PersonStanding
              className='size-16'
              strokeWidth={2}
            />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side='right'
        className='flex w-full max-w-sm flex-col p-0'
      >
        {/* 고정 헤더 */}
        <SheetHeader className='border-b p-4'>
          <SheetTitle className='font-kakao-big text-lg font-bold'>
            접근성 설정 메뉴 (CTRL + U)
          </SheetTitle>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <div className='space-y-4 border-b px-4 pb-4'>
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
                  setSelectedSubMode(''); //세부 모드 초기화
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
                    onValueChange={(modeId) => applyProfileSettings(modeId)}
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

          <div className='grid grid-cols-3 gap-3 p-4'>
            {a11yItems.map((item, idx) => (
              <A11yOptionCard
                key={idx}
                {...item}
              />
            ))}
          </div>

          <div className='space-y-2 border-t bg-gray-50/50 p-4'>
            <Button
              variant='destructive'
              className='w-full'
              onClick={() => resetA11ySettings()}
            >
              모든 설정 초기화
            </Button>
            <div className='flex gap-2'>
              <Button
                variant='default'
                className='flex-1'
                onClick={() => setSaveModalOpen(true)}
              >
                설정 저장하기
              </Button>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => setSheetOpen(false)}
              >
                닫기
              </Button>
            </div>
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
};
