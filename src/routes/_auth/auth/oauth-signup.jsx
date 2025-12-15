import { authApi } from '@/api/auth-api';
import { JoinForm } from '@/components/auth/join-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_auth/auth/oauth-signup')({
  component: RouteComponent,
  validateSearch: ({ temp_token }) => ({
    tempToken: temp_token || '',
  }),
});

function RouteComponent() {
  const steps = [
    {
      id: 'userEmail',
      label: '이메일',
      placeholder: 'example@email.com',
      type: 'email',
      description: '로그인에 사용할 이메일 주소를 입력해주세요.',
    },
    {
      id: 'userName',
      label: '이름',
      placeholder: '홍길동',
      type: 'text',
      description: '실명을 입력해주세요.',
    },
    {
      id: 'userNickname',
      label: '닉네임',
      placeholder: '길동이',
      type: 'text',
      description: '다른 사용자에게 보여질 닉네임을 입력해주세요.',
    },
    {
      id: 'userPhone',
      label: '휴대폰 번호',
      placeholder: '010-1234-5678',
      type: 'tel',
      description: '본인 확인을 위해 휴대폰 번호를 입력해주세요.',
    },
  ];

  const { tempToken } = Route.useSearch();

  const [formData, setFormData] = useState({
    userEmail: '',
    userName: '',
    userNickname: '',
    userPhone: '',
  });
  const [errors, setErrors] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const [submitCheckDialogOpen, setSubmitCheckDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (tempToken === '' || tempToken == null) {
      navigate({
        to: '/invalid-path',
      });
    }
  }, [isCompleted]);

  const validateField = (field, value) => {
    switch (field) {
      case 'userEmail':
        if (!value) return '이메일을 입력해주세요';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return '올바른 이메일 형식이 아닙니다';
        }
        return null;
      case 'userName':
        if (!value) return '이름을 입력해주세요';
        if (value.length < 2) return '이름은 2자 이상이어야 합니다';
        return null;
      case 'userNickname':
        if (!value) return '닉네임을 입력해주세요';
        if (value.length < 2) return '닉네임은 2자 이상이어야 합니다';
        return null;
      case 'userPhone':
        if (!value) return '휴대폰 번호를 입력해주세요';
        // 숫자만 있는지 확인
        if (!/^\d{10,11}$/.test(value.replace(/-/g, ''))) {
          return '올바른 휴대폰 번호 형식이 아닙니다';
        }
        return null;
      default:
        return null;
    }
  };

  const validateCheckSteps = async (currentFocusId) => {
    const data = formData[currentFocusId];

    if (currentFocusId === 'userEmail') {
      try {
        const resp = await authApi.checkEmailExists(data);

        if (resp.data.isAvailable !== 'AVAILABLE') {
          setErrors((prev) => ({
            ...prev,
            userEmail: '이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.',
          }));
          return false;
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          userEmail: '이메일 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.',
        }));
        return false;
      }
    } else if (currentFocusId === 'userNickname') {
      try {
        const resp = await authApi.checkNicknameExists(data);

        if (resp.data.isAvailable !== 'AVAILABLE') {
          setErrors((prev) => ({
            ...prev,
            userNickname: '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.',
          }));
          return false;
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          userNickname: '닉네임 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.',
        }));
        return false;
      }
    } else if (currentFocusId === 'userPhone') {
      try {
        const resp = await authApi.checkPhoneExists(data);

        if (resp.data.isAvailable !== 'AVAILABLE') {
          setErrors((prev) => ({
            ...prev,
            userPhone: '이미 사용 중인 휴대폰 번호입니다. 다른 번호를 입력해주세요.',
          }));
          return false;
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          userPhone: '휴대폰 번호 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.',
        }));
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const resp = await authApi.kakaoJoin(formData, tempToken);
      // const resp = { status: 201 }; // Mock response
      if (resp.status === 201) {
        setIsCompleted(true);
        setSubmitCheckDialogOpen(false);
      } else {
        setErrors({ submit: '회원가입에 실패했습니다. 다시 시도해주세요.' });
      }
    } catch (error) {
      setErrors({ submit: '서버 오류로 인해 회원가입에 실패했습니다. 나중에 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <JoinForm
        steps={steps}
        formTitle={`간편회원가입`}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        isCompleted={isCompleted}
        isSubmitting={isSubmitting}
        submitCheckDialogOpen={submitCheckDialogOpen}
        setSubmitCheckDialogOpen={setSubmitCheckDialogOpen}
        validateField={validateField}
        validateCheckSteps={validateCheckSteps}
        handleSubmit={handleSubmit}
      />
    </main>
  );
}
