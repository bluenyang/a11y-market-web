import { userApi } from '@/api/user-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const AccountInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: '',
    userName: '',
    userPhone: '',
    userNickname: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const resp = await userApi.getProfile();
        if (resp.status === 200) {
          setFormData({
            userEmail: resp.data.userEmail || '',
            userName: resp.data.userName || '',
            userPhone: resp.data.userPhone || '',
            userNickname: resp.data.userNickname || '',
          });
        }
      } catch (err) {
        toast.error('회원 정보 불러오기에 실패했습니다. 다시 시도해주세요.');
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const resp = await userApi.updateProfile(formData);
      if (resp.status === 200) {
        toast.success('회원 정보가 성공적으로 업데이트되었습니다.');
        setIsEditing(false);
      }
    } catch (err) {
      toast.error('회원 정보 업데이트에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>회원 정보</CardTitle>
        <CardDescription>계정 정보를 관리하세요</CardDescription>
      </CardHeader>
      <CardContent className={'space-y-4'}>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='userEmail'>이메일</FieldLabel>
              <Input
                id='userEmail'
                type='email'
                value={formData.userEmail}
                disabled
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='userName'>이름</FieldLabel>
              <Input
                id='userName'
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                disabled={!isEditing}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='userPhone'>전화번호</FieldLabel>
              <Input
                id='userPhone'
                value={formData.userPhone}
                onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                disabled={!isEditing}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='userNickname'>닉네임</FieldLabel>
              <Input
                id='userNickname'
                value={formData.userNickname}
                onChange={(e) => setFormData({ ...formData, userNickname: e.target.value })}
                disabled={!isEditing}
              />
            </Field>
            <Field className={'flex gap-2'}>
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner /> : '저장'}
                  </Button>
                  <Button
                    variant='outline'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(false);
                    }}
                    disabled={isLoading}
                  >
                    취소
                  </Button>
                </>
              ) : (
                <Button
                  variant='default'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                >
                  수정
                </Button>
              )}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
