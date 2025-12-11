import { a11yApi } from '@/api/a11y-api';
import A11yEditModal from '@/components/accessibility/a11y-edit-modal';
import A11yProfileList from '@/components/accessibility/a11y-profile-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setAllA11y } from '@/store/a11y-slice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export const A11ySetting = () => {
  const dispatch = useDispatch();
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  //프로필 목록 불러오기
  const loadProfiles = async () => {
    try {
      const resp = await a11yApi.getA11yProfiles();
      setProfiles(resp.data);
    } catch {
      toast.error('접근성 프로필을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    loadProfiles();
    window.addEventListener('a11yProfileSaved', loadProfiles);

    return () => window.removeEventListener('a11yProfileSaved', loadProfiles);
  }, []);

  // 적용하기
  const handleApply = (p) => {
    dispatch(
      setAllA11y({
        contrastLevel: p.contrastLevel,
        textSizeLevel: p.textSizeLevel,
        textSpacingLevel: p.textSpacingLevel,
        lineHeightLevel: p.lineHeightLevel,
        textAlign: p.textAlign,
        screenReader: p.screenReader,
        smartContrast: p.smartContrast,
        highlightLinks: p.highlightLinks,
        cursorHighlight: p.cursorHighlight,
      }),
    );
    toast.success(`"${p.profileName}" 프로필이 적용되었습니다.`);
  };

  // 새 프로필 생성
  const handleCreate = () => {
    setEditingProfile(null);
    setModalOpen(true);
  };

  // 수정
  const handleEdit = (p) => {
    dispatch(
      setAllA11y({
        contrastLevel: p.contrastLevel,
        textSizeLevel: p.textSizeLevel,
        textSpacingLevel: p.textSpacingLevel,
        lineHeightLevel: p.lineHeightLevel,
        textAlign: p.textAlign,
        screenReader: p.screenReader,
        smartContrast: p.smartContrast,
        highlightLinks: p.highlightLinks,
        cursorHighlight: p.cursorHighlight,
      }),
    );
    setEditingProfile(p);
    setModalOpen(true);
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('프로필을 삭제할까요?')) return;
    try {
      await a11yApi.deleteA11yProfile(id);
      await loadProfiles();
      toast.success('삭제되었습니다.');
    } catch {
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>접근성 프로필 관리</CardTitle>
          <CardDescription className='text-gray-600'>
            저장된 접근성 설정 프로필을 선택하거나 새로 만들 수 있습니다.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6 p-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg'>저장된 프로필</h2>
            <Button onClick={handleCreate}>새 프로필 추가</Button>
          </div>

          <A11yProfileList
            profiles={profiles}
            onApply={handleApply}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <A11yEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProfile={editingProfile}
        onSaved={loadProfiles}
      />
    </div>
  );
};
