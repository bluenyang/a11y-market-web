import { a11yApi } from '@/api/a11y-api';
import A11yEditModal from '@/components/accessibility/a11y-edit-modal';
import A11yProfileList from '@/components/accessibility/a11y-profile-list';
import { Card, CardContent } from '@/components/ui/card';
import { setAllA11y } from '@/store/a11y-slice';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/_mypage/mypage/a11y/')({
  component: A11ySettingsPage,
});

export default function A11ySettingsPage() {
  const dispatch = useDispatch();
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  //프로필 목록 불러오기
  const loadProfiles = async () => {
    try {
      const data = await a11yApi.getA11yProfiles();
      setProfiles(data);
    } catch {
      toast.error('접근성 프로필을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    loadProfiles();
    const handler = () => loadProfiles();
    window.addEventListener('a11yProfileSaved', handler);

    return () => window.removeEventListener('a11yProfileSaved', handler);
  }, []);

  // 적용하기
  const handleApply = (profile) => {
    dispatch(
      setAllA11y({
        contrastLevel: profile.contrastLevel,
        textSizeLevel: profile.textSizeLevel,
        textSpacingLevel: profile.textSpacingLevel,
        lineHeightLevel: profile.lineHeightLevel,
        textAlign: profile.textAlign,
        screenReader: profile.screenReader === 1,
        smartContrast: profile.smartContrast === 1,
        highlightLinks: profile.highlightLinks === 1,
        cursorHighlight: profile.cursorHighlight === 1,
      }),
    );
    toast.success(`"${profile.profileName}" 프로필이 적용되었습니다.`);
  };

  // 새 프로필 추가 버튼
  const handleCreate = () => {
    setEditingProfile(null); // 새 프로필
    setEditModalOpen(true);
  };

  // 수정 버튼
  const handleEdit = (profile) => {
    dispatch(
      setAllA11y({
        contrastLevel: profile.contrastLevel,
        textSizeLevel: profile.textSizeLevel,
        textSpacingLevel: profile.textSpacingLevel,
        lineHeightLevel: profile.lineHeightLevel,
        textAlign: profile.textAlign,
        screenReader: profile.screenReader === 1,
        smartContrast: profile.smartContrast === 1,
        highlightLinks: profile.highlightLinks === 1,
        cursorHighlight: profile.cursorHighlight === 1,
      }),
    );
    setEditingProfile(profile);
    setEditModalOpen(true);
  };

  // 삭제
  const handleDelete = async (profileId) => {
    if (!window.confirm('프로필을 삭제할까요?')) return;
    try {
      await a11yApi.deleteA11yProfile(profileId);
      await loadProfiles();
    } catch {
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSaved = () => {
    setSaveModalOpen(false);
    loadProfiles();
  };

  return (
    <>
      <Card className='p-6'>
        <CardContent className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>접근성 프로필 관리</h1>
          </div>

          {/* 프로필 목록 */}
          <A11yProfileList
            profiles={profiles}
            onApply={handleApply}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </CardContent>
      </Card>

      {/* 이름/설명 입력 모달 */}
      <A11yEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialProfile={editingProfile}
        onSaved={loadProfiles}
      />
    </>
  );
}
