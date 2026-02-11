import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { useCreateA11yProfile } from '@/api/a11y/queries';
import type { A11ySettings } from '@/api/a11y/types';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircleIcon } from 'lucide-react';
import { useState } from 'react';

interface A11yOverlaySaveProps {
  open: boolean;
  onClose: () => void;
  a11yState: A11ySettings;
}

interface ErrorState {
  submit: string | null;
  name: string | null;
}

export default function A11yOverlaySave({ open, onClose, a11yState }: A11yOverlaySaveProps) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [errors, setErrors] = useState<ErrorState>({
    submit: null,
    name: null,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrors((prev: ErrorState) => ({ ...prev, name: '프로필 이름을 입력해주세요.' }));
      return;
    }

    setIsSubmitting(true);

    await useCreateA11yProfile().mutateAsync({
      profileName: name.trim(),
      description: description.trim(),
      contrastLevel: a11yState.contrastLevel,
      textSizeLevel: a11yState.textSizeLevel,
      textSpacingLevel: a11yState.textSpacingLevel,
      lineHeightLevel: a11yState.lineHeightLevel,
      textAlign: a11yState.textAlign,
      screenReader: a11yState.screenReader,
      smartContrast: a11yState.smartContrast,
      highlightLinks: a11yState.highlightLinks,
      cursorHighlight: a11yState.cursorHighlight,
    });

    setIsSubmitting(false);
    return;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader className='border-b border-gray-400 pb-4'>
          <DialogTitle>접근성 프로필 저장</DialogTitle>
        </DialogHeader>
        <Alert
          variant='destructive'
          className={`grid border-red-500 bg-red-500/70 text-white ${errors.submit ? 'grid-rows-[1fr]' : 'mb-0 grid-rows-[0fr] p-0 opacity-0'} transition-all`}
        >
          <AlertCircleIcon className={`${errors.submit ? '' : 'hidden'}`} />
          <AlertTitle className={`${errors.submit ? '' : 'hidden'}`}>{errors.submit}</AlertTitle>
        </Alert>
        <Field className='gap-1'>
          <FieldLabel
            htmlFor='profile-name'
            className='text-base'
          >
            프로필 이름
          </FieldLabel>
          <Input
            id='profile-name'
            placeholder='프로필 이름을 입력하세요'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: null }));
            }}
            aria-describedby='name-error'
            aria-invalid={!!errors.name}
            className='px-4 py-6 text-lg'
          />
          {errors.name && (
            <p
              id='name-error'
              className='text-sm text-red-600'
              role='alert'
              aria-live='polite'
            >
              {errors.name}
            </p>
          )}
        </Field>
        <Field className='gap-1'>
          <FieldLabel
            htmlFor='profile-description'
            className='text-base'
          >
            설명
          </FieldLabel>
          <Input
            id='profile-description'
            placeholder='설명을 입력하세요 (선택)'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
