import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  A11yContrast,
  A11yLineHeight,
  A11yTextAlign,
  A11yTextSize,
  A11yTextSpacing,
} from '@/lib/a11y/a11yEnums';
import { A11Y_PROFILES } from '@/lib/a11y/profiles';
import {
  cycleContrast,
  cycleLineHeight,
  cycleTextAlign,
  cycleTextSize,
  cycleTextSpacing,
  resetAll,
  setAllA11y,
  toggleCursorHighlight,
  toggleHighlightLinks,
  toggleScreenReader,
  toggleSmartContrast,
} from '@/store/a11y-slice';
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
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { A11yOptionCard } from './a11y-option-card';
import A11yOverlaySave from './a11y-overlay-save';

export const A11yMenu = ({ child }) => {
  //전역 상태
  const a11yState = useSelector((state) => state.a11y);
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

  const dispatch = useDispatch();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ko');
  const [selectedProfile, setSelectedProfile] = useState(null); // vision/ cognitive/ screenReader/ senior/ custom
  const [selectedSubMode, setSelectedSubMode] = useState(null);

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
      onClick: () => dispatch(toggleScreenReader()),
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
      onClick: () => dispatch(cycleContrast()),
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
      onClick: () => dispatch(toggleSmartContrast()),
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
      onClick: () => dispatch(toggleHighlightLinks()),
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
      onClick: () => dispatch(cycleTextSize()),
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
      onClick: () => dispatch(cycleTextSpacing()),
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
      onClick: () => dispatch(toggleCursorHighlight()),
    },
    {
      label: '텍스트 정렬',
      icon: AlignIcon,
      isActive: textAlign !== 'left',
      steps: A11yTextAlign.OPTION_SIZE - 1,
      currentStep: A11yTextAlign.getA11yTextAlignStep(textAlign),
      onClick: () => dispatch(cycleTextAlign()),
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
      onClick: () => dispatch(cycleLineHeight()),
    },
  ];
  const languages = [{ code: 'ko', label: '한국어' }];

  const applyProfileSettings = (modeId) => {
    setSelectedSubMode(modeId);
    dispatch(resetAll());

    const selectedMode = A11Y_PROFILES[selectedProfile].items.find((item) => item.id === modeId);
    if (!selectedMode || !selectedMode.settings) return;

    dispatch(setAllA11y(selectedMode.settings));
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
              onClick={() => dispatch(resetAll())}
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
