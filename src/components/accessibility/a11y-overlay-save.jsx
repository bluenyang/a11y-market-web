import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { a11yApi } from '@/api/a11y-api';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircleIcon } from 'lucide-react';
import { useState } from 'react';

export default function A11yOverlaySave({ open, onClose, reloadProfiles, a11yState }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({
    submit: null,
    name: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: '프로필 이름을 입력해주세요.' }));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        profileName: name.trim(),
        description: description.trim() || null,

        contrastLevel: a11yState.contrastLevel,
        textSizeLevel: a11yState.textSizeLevel,
        textSpacingLevel: a11yState.textSpacingLevel,
        lineHeightLevel: a11yState.lineHeightLevel,
        textAlign: a11yState.textAlign,
        screenReader: a11yState.screenReader ? 1 : 0,
        smartContrast: a11yState.smartContrast ? 1 : 0,
        highlightLinks: a11yState.highlightLinks ? 1 : 0,
        cursorHighlight: a11yState.cursorHighlight ? 1 : 0,
      };

      const resp = await a11yApi.createA11yProfile(payload);

      if (!resp.status) {
        setErrors((prev) => ({ ...prev, submit: resp.message || '프로필 저장에 실패했습니다.' }));
        return;
      }

      if (resp.status !== 201) {
        if (resp.status === 409) {
          setErrors((prev) => ({ ...prev, name: '이미 존재하는 프로필 이름입니다.' }));
        } else if (resp.status === 400) {
          setErrors((prev) => ({ ...prev, submit: resp.message || '잘못된 요청입니다.' }));
        } else {
          setErrors((prev) => ({ ...prev, submit: '프로필 저장에 실패했습니다.' }));
        }
        return;
      }

      window.dispatchEvent(new Event('a11yProfileSaved'));
      alert('프로필이 저장되었습니다.');
      setName('');
      setDescription('');

      onClose();
    } catch (err) {
      if (err.error === 'Unauthorized') {
        setErrors((prev) => ({ ...prev, submit: '로그인이 필요합니다.' }));
        return;
      }

      setErrors((prev) => ({ ...prev, submit: '프로필 저장 중 오류가 발생했습니다.' }));
    } finally {
      setIsSubmitting(false);
    }
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
          className={`grid border-red-500 bg-red-500/70 text-white ${errors.submit ? ' grid-rows-[1fr]' : 'mb-0 grid-rows-[0fr] p-0 opacity-0'} transition-all`}
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
