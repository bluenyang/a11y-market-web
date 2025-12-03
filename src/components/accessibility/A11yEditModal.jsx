import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setAllA11y,
  resetAll,
  toggleScreenReader,
  toggleSmartContrast,
  toggleHighlightLinks,
  toggleCursorHighlight,
} from '@/store/a11ySlice';

import { createA11yProfile, updateA11yProfile } from '@/api/a11yApi';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function StepSelector({ value, max, onChange }) {
  return (
    <div className='flex items-center gap-2'>
      {Array.from({ length: max + 1 }, (_, i) => (
        <Button
          variant='outline'
          type='button'
          key={i}
          onClick={() => onChange(i)}
          className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs transition ${
            value === i
              ? 'border-black bg-black text-white'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
          }`}
          aria-label={`${i + 1} 단계 선택`}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}

function Row({ label, control }) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <Label className='text-sm font-medium'>{label}</Label>
      {control}
    </div>
  );
}

function ContrastSelector({ value, onChange }) {
  const options = [
    { val: 0, label: '기본 대비' },
    { val: 1, label: '색 반전' },
    { val: 2, label: '다크' },
    { val: 3, label: '라이트' },
  ];

  return (
    <div className='flex items-center gap-2'>
      {options.map((opt) => (
        <Button
          key={opt.val}
          type='button'
          variant='outline'
          onClick={() => onChange(opt.val)}
          className={`rounded-md px-3 py-1 text-xs ${
            value === opt.val
              ? 'border-black bg-black text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

export default function A11yEditModal({ open, onClose, initialProfile, onSaved }) {
  const dispatch = useDispatch();

  const [profileName, setProfileName] = useState('');
  const [description, setDescription] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

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
  } = useSelector((state) => state.a11y);

  useEffect(() => {
    if (!open) return;

    if (initialProfile) {
      setProfileName(initialProfile.profileName);
      setDescription(initialProfile.description ?? '');
    } else {
      setProfileName('');
      setDescription('');
    }
  }, [initialProfile, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileName.trim()) {
      alert('프로필 이름은 필수입니다.');
      return;
    }

    const payload = {
      profileName: profileName.trim(),
      description: description.trim() || null,
      contrastLevel,
      textSizeLevel,
      textSpacingLevel,
      lineHeightLevel,
      textAlign,
      screenReader,
      smartContrast,
      highlightLinks,
      cursorHighlight,
    };

    try {
      setSaveLoading(true);

      if (initialProfile) {
        await updateA11yProfile(initialProfile.profileId, payload);
        alert('프로필이 수정되었습니다.');
      } else {
        await createA11yProfile(payload);
        alert('프로필이 생성되었습니다.');
      }

      onSaved && onSaved();
      onClose();
    } catch (err) {
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.message || err?.response?.data?.errorMessage;

      if (status === 400 || status === 409) {
        alert(serverMessage || '이미 존재하는 프로필 이름입니다.');
      } else {
        alert('프로필 저장 중 오류가 발생했습니다.');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold'>
            {initialProfile ? '접근성 프로필 수정' : '접근성 프로필 생성'}
          </DialogTitle>
        </DialogHeader>

        <form
          className='space-y-6'
          onSubmit={handleSubmit}
        >
          {/* 프로필 기본 정보 */}
          <div className='space-y-3'>
            <div>
              <Label className='block text-sm font-medium'>프로필 이름 *</Label>
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder='예: 시력 저하용, 고대비용 등'
                required
              />
            </div>

            <div>
              <Label className='block text-sm font-medium'>설명 (선택)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='프로필에 대한 메모를 남길 수 있습니다.'
                rows={2}
              />
            </div>
          </div>

          {/* 접근성 옵션 편집 영역 */}
          <div className='space-y-4 rounded-md border p-4'>
            <p className='text-sm font-semibold'>접근성 옵션</p>

            <Row
              label='스크린 리더'
              control={
                <Switch
                  checked={screenReader}
                  onCheckedChange={() => dispatch(toggleScreenReader())}
                />
              }
            />

            <Row
              label='대비 모드'
              control={
                <ContrastSelector
                  value={contrastLevel}
                  onChange={(v) =>
                    dispatch(
                      setAllA11y({
                        contrastLevel: v,
                        textSizeLevel,
                        textSpacingLevel,
                        lineHeightLevel,
                        textAlign,
                        screenReader,
                        smartContrast,
                        highlightLinks,
                        cursorHighlight,
                      }),
                    )
                  }
                />
              }
            />

            <Row
              label='스마트 대비'
              control={
                <Switch
                  checked={smartContrast}
                  onCheckedChange={() => dispatch(toggleSmartContrast())}
                />
              }
            />

            <Row
              label='글자 크기'
              control={
                <StepSelector
                  value={textSizeLevel}
                  max={2}
                  onChange={(v) =>
                    dispatch(
                      setAllA11y({
                        contrastLevel,
                        textSizeLevel: v,
                        textSpacingLevel,
                        lineHeightLevel,
                        textAlign,
                        screenReader,
                        smartContrast,
                        highlightLinks,
                        cursorHighlight,
                      }),
                    )
                  }
                />
              }
            />

            <Row
              label='글자 간격'
              control={
                <StepSelector
                  value={textSpacingLevel}
                  max={2}
                  onChange={(v) =>
                    dispatch(
                      setAllA11y({
                        contrastLevel,
                        textSizeLevel,
                        textSpacingLevel: v,
                        lineHeightLevel,
                        textAlign,
                        screenReader,
                        smartContrast,
                        highlightLinks,
                        cursorHighlight,
                      }),
                    )
                  }
                />
              }
            />

            <Row
              label='줄 간격'
              control={
                <StepSelector
                  value={lineHeightLevel}
                  max={2}
                  onChange={(v) =>
                    dispatch(
                      setAllA11y({
                        contrastLevel,
                        textSizeLevel,
                        textSpacingLevel,
                        lineHeightLevel: v,
                        textAlign,
                        screenReader,
                        smartContrast,
                        highlightLinks,
                        cursorHighlight,
                      }),
                    )
                  }
                />
              }
            />

            <Row
              label='텍스트 정렬'
              control={
                <div className='flex gap-2'>
                  {['left', 'center', 'right'].map((opt) => (
                    <Button
                      type='button'
                      variant='outline'
                      key={opt}
                      onClick={() =>
                        dispatch(
                          setAllA11y({
                            contrastLevel,
                            textSizeLevel,
                            textSpacingLevel,
                            lineHeightLevel,
                            textAlign: opt,
                            screenReader,
                            smartContrast,
                            highlightLinks,
                            cursorHighlight,
                          }),
                        )
                      }
                      className={
                        'rounded-md px-3 py-1 text-xs ' +
                        (textAlign === opt
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700')
                      }
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              }
            />

            <Row
              label='링크 강조'
              control={
                <Switch
                  checked={highlightLinks}
                  onCheckedChange={() => dispatch(toggleHighlightLinks())}
                />
              }
            />

            <Row
              label='마우스 커서 강조'
              control={
                <Switch
                  checked={cursorHighlight}
                  onCheckedChange={() => dispatch(toggleCursorHighlight())}
                />
              }
            />

            <Button
              type='button'
              variant='outline'
              className='mt-2 w-full'
              onClick={() => dispatch(resetAll())}
            >
              모든 설정 초기화
            </Button>
          </div>

          <DialogFooter className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              type='submit'
              disabled={saveLoading}
            >
              {saveLoading ? '저장 중...' : '저장하기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
