import { useCreateA11yProfile, useUpdateA11yProfile } from '@/api/a11y/queries';
import type { A11ySettings, UserA11yProfileAddRequest } from '@/api/a11y/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useA11yActions, useA11yData } from '@/store/a11y-store';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface A11yEditModalProps {
  open: boolean;
  onClose: () => void;
  initialProfile?: any;
  onSaved?: () => void;
}

interface StepSelectorProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

interface ContrastSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

interface ModalRowProps {
  label: string;
  control: React.ReactNode;
}

export default function A11yEditModal({
  open,
  onClose,
  initialProfile,
  onSaved,
}: A11yEditModalProps) {
  const [profileName, setProfileName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const a11yState = useA11yData();
  const a11yActions = useA11yActions();
  const prevRef = useRef<A11ySettings | null>(null);

  useEffect(() => {
    if (!open) return;

    prevRef.current = a11yState;

    if (initialProfile) {
      setProfileName(initialProfile.profileName);
      setDescription(initialProfile.description ?? '');
    } else {
      setProfileName('');
      setDescription('');
    }
  }, [initialProfile, open]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profileName.trim()) {
      alert('프로필 이름은 필수입니다.');
      return;
    }

    const payload: UserA11yProfileAddRequest = {
      profileName: profileName.trim(),
      description: description.trim() || '',
      ...a11yState,
    };

    setSaveLoading(true);

    if (initialProfile) {
      await useUpdateA11yProfile().mutateAsync({
        profileId: initialProfile.profileId,
        data: payload,
      });
      toast.success('프로필이 수정되었습니다.');
    } else {
      await useCreateA11yProfile().mutateAsync(payload);
      toast.success('새 접근성 프로필이 생성되었습니다.');
    }

    onSaved && onSaved();
    onClose();
    setSaveLoading(false);
  };

  const handleClose = () => {
    if (prevRef.current) {
      a11yActions.saveA11ySettings(prevRef.current);
    }
    onClose();
  };

  function StepSelector({ value, max, onChange }: StepSelectorProps) {
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

  function Row({ label, control }: ModalRowProps) {
    return (
      <div className='flex items-center gap-4'>
        <Label className='w-24 shrink-0 text-sm font-medium'>{label}</Label>
        <div className='flex flex-1 justify-end'>{control}</div>
      </div>
    );
  }

  function ContrastSelector({ value, onChange }: ContrastSelectorProps) {
    const options = [
      { val: 0, label: '기본' },
      { val: 1, label: '다크' },
      { val: 2, label: '색 반전' },
      { val: 3, label: '고대비' },
      { val: 4, label: '저대비' },
    ];

    return (
      <div className='flex items-center gap-2'>
        {options.map((opt) => (
          <Button
            key={opt.val}
            type='button'
            variant='outline'
            onClick={() => onChange(opt.val)}
            className={`rounded-md px-2 py-1 text-xs ${
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

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className='p-0'>
        <ScrollArea className='max-h-[80vh] px-6 py-4'>
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
            <FieldGroup className='space-y-4'>
              <Field>
                <Label htmlFor='profileName'>프로필 이름 *</Label>
                <Input
                  id='profileName'
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder='예: 시력 저하용, 고대비용 등'
                  required
                />
              </Field>

              <Field>
                <Label htmlFor='description'>설명 (선택)</Label>
                <Textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='프로필에 대한 메모를 남길 수 있습니다.'
                  rows={2}
                />
              </Field>
            </FieldGroup>

            {/* 접근성 옵션 편집 영역 */}
            <div className='space-y-4 rounded-md border p-4'>
              <p className='text-sm font-semibold'>접근성 옵션</p>

              <Row
                label='스크린 리더'
                control={
                  <Switch
                    checked={a11yState.screenReader}
                    onCheckedChange={() => a11yActions.toggleScreenReader()}
                  />
                }
              />

              <Row
                label='대비 모드'
                control={
                  <ContrastSelector
                    value={a11yState.contrastLevel}
                    onChange={(v) =>
                      a11yActions.saveA11ySettings({ ...a11yState, contrastLevel: v })
                    }
                  />
                }
              />

              <Row
                label='스마트 대비'
                control={
                  <Switch
                    checked={a11yState.smartContrast}
                    onCheckedChange={() => a11yActions.toggleSmartContrast()}
                  />
                }
              />

              <Row
                label='글자 크기'
                control={
                  <StepSelector
                    value={a11yState.textSizeLevel}
                    max={2}
                    onChange={(v) =>
                      a11yActions.saveA11ySettings({ ...a11yState, textSizeLevel: v })
                    }
                  />
                }
              />

              <Row
                label='글자 간격'
                control={
                  <StepSelector
                    value={a11yState.textSpacingLevel}
                    max={2}
                    onChange={(v) =>
                      a11yActions.saveA11ySettings({ ...a11yState, textSpacingLevel: v })
                    }
                  />
                }
              />

              <Row
                label='줄 간격'
                control={
                  <StepSelector
                    value={a11yState.lineHeightLevel}
                    max={2}
                    onChange={(v) =>
                      a11yActions.saveA11ySettings({ ...a11yState, lineHeightLevel: v })
                    }
                  />
                }
              />

              <Row
                label='텍스트 정렬'
                control={
                  <div className='flex gap-2'>
                    {[
                      { value: 'left', label: '왼쪽' },
                      { value: 'center', label: '중앙' },
                      { value: 'right', label: '오른쪽' },
                    ].map((opt) => (
                      <Button
                        type='button'
                        variant='outline'
                        key={opt.value}
                        onClick={() =>
                          a11yActions.saveA11ySettings({ ...a11yState, textAlign: opt.value })
                        }
                        className={`rounded-md px-3 py-1 text-xs ${
                          a11yState.textAlign === opt.value
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-gray-700'
                        }`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                }
              />

              <Row
                label='링크 강조'
                control={
                  <Switch
                    checked={a11yState.highlightLinks}
                    onCheckedChange={() => a11yActions.toggleHighlightLinks()}
                  />
                }
              />

              <Row
                label='마우스 커서 강조'
                control={
                  <Switch
                    checked={a11yState.cursorHighlight}
                    onCheckedChange={() => a11yActions.toggleCursorHighlight()}
                  />
                }
              />

              <Button
                type='button'
                variant='outline'
                className='mt-2 w-full'
                onClick={() => a11yActions.resetA11ySettings()}
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
