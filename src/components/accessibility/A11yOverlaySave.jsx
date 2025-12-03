import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { createA11yProfile } from '@/api/a11yApi';
import { useState } from 'react';

export default function A11yOverlaySave({ open, onClose, reloadProfiles, a11yState }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('프로필 이름을 입력해주세요.');
      return;
    }

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
    try {
      await createA11yProfile(payload);

      window.dispatchEvent(new Event('a11yProfileSaved'));
      alert('프로필이 저장되었습니다.');
      setName('');
      setDescription('');

      onClose();
    } catch (err) {
      alert('프로필 저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>접근성 프로필 저장</DialogTitle>
        </DialogHeader>

        <Input
          placeholder='프로필 이름을 입력하세요'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder='설명을 입력하세요 (선택)'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
          >
            취소
          </Button>
          <Button onClick={handleSubmit}>저장하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
