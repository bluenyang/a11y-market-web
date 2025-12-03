import { authApi } from '@/api/authApi';
import { Alert, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Icon } from '@iconify/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlertCircleIcon, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Route = createFileRoute('/_auth/auth/oauth-signup')({
  component: RouteComponent,
  validateSearch: ({ temp_token }) => ({
    tempToken: temp_token || '',
  }),
});

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

function RouteComponent() {
  const { tempToken } = Route.useSearch();

  const [currentStep, setCurrentStep] = useState(0);
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

  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current && !isCompleted) {
      inputRef.current.focus();
    }

    if (tempToken === '' || tempToken == null) {
      navigate({
        to: '/invalid-path',
      });
    }
  }, [currentStep, isCompleted]);

  const currentField = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

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
        if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(value.replace(/-/g, ''))) {
          return '올바른 휴대폰 번호 형식이 아닙니다';
        }
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const error = validateField(currentField.id, formData[currentField.id]);
    if (error) {
      setErrors((prev) => ({ ...prev, [currentField.id]: error }));
      return;
    }

    setErrors((prev) => ({ ...prev, [currentField.id]: null }));

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setSubmitCheckDialogOpen(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrors((prev) => ({ ...prev, [currentField.id]: null }));
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, [currentField.id]: value }));
    if (errors[currentField.id]) {
      setErrors((prev) => ({ ...prev, [currentField.id]: null }));
    }
  };

  const handlePhoneChange = (e) => {
    console.log(e.target.value);
    // 입력은 숫자만 허용하고, 값은 하이픈 없이 저장한 뒤, 하이픈을 추가하여 포맷팅
    let value = e.target.value.replace(/[^0-9]/g, '');

    if (value.length > 3 && value.length <= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length === 10) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    }

    setFormData((prev) => ({ ...prev, [currentField.id]: value }));

    if (errors[currentField.id]) {
      setErrors((prev) => ({ ...prev, [currentField.id]: null }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
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

  if (isCompleted) {
    return (
      <main className='flex items-center justify-center bg-neutral-50 py-16'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='mb-4 flex justify-center'>
              <CheckCircle2 className='size-16 text-green-500' />
            </div>
            <CardTitle>회원가입 완료!</CardTitle>
            <CardDescription>모든 정보가 성공적으로 입력되었습니다</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 rounded-lg bg-gray-50 p-4'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>이메일:</span>
                <span>{formData.userEmail}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>이름:</span>
                <span>{formData.userName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>닉네임:</span>
                <span>{formData.userNickname}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>휴대폰:</span>
                <span>{formData.userPhone}</span>
              </div>
            </div>
            <Button
              onClick={() =>
                navigate({
                  to: '/',
                })
              }
              className='w-full'
            >
              처음으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className='flex items-center justify-center bg-neutral-50 py-16'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>
            <h1 className='text-xl font-extrabold'>간편회원가입</h1>
          </CardTitle>
          <CardDescription>
            <span
              aria-live='polite'
              className='text-sm'
            >
              {`단계 ${currentStep + 1} / ${steps.length}`}
            </span>
          </CardDescription>
          <Progress
            value={progress}
            className='mt-2 h-3'
            aria-label={`진행률 ${Math.round(progress)}%`}
          />
        </CardHeader>
        <CardContent>
          <FieldGroup className='gap-4 space-y-6'>
            <div
              className='flex justify-center gap-2'
              role='list'
              aria-label='가입 단계'
            >
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`size-3 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                  }`}
                  role='listitem'
                  aria-label={`${step.label} 단계 ${
                    index < currentStep ? '완료' : index === currentStep ? '현재 단계' : '미완료'
                  }`}
                />
              ))}
            </div>
            <FieldSet>
              <Field>
                <Label
                  htmlFor={currentField.id}
                  className='text-lg'
                >
                  {currentField.label}
                </Label>
                <Input
                  ref={inputRef}
                  id={currentField.id}
                  type={currentField.type}
                  placeholder={currentField.placeholder}
                  value={formData[currentField.id]}
                  onChange={currentField.id === 'userPhone' ? handlePhoneChange : handleChange}
                  onKeyDown={handleKeyDown}
                  aria-describedby={`${currentField.id}-description ${
                    errors[currentField.id] ? `${currentField.id}-error` : ''
                  }`}
                  aria-invalid={!!errors[currentField.id]}
                  className='p-6 text-lg'
                />
                {errors[currentField.id] && (
                  <p
                    id={`${currentField.id}-error`}
                    className='mt-2 text-sm text-red-600'
                    role='alert'
                    aria-live='polite'
                  >
                    {errors[currentField.id]}
                  </p>
                )}
              </Field>
            </FieldSet>
            <FieldSet className='flex flex-row justify-between gap-2'>
              {currentStep > 0 && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleBack}
                  className='flex-1'
                  aria-label='이전 단계로 이동'
                >
                  <ArrowLeft className='mr-2 size-4' />
                  이전
                </Button>
              )}
              <Button
                type='button'
                onClick={handleNext}
                className='flex-1'
                aria-label={currentStep === steps.length - 1 ? '회원가입 완료' : '다음 단계로 이동'}
              >
                {currentStep === steps.length - 1 ? '완료' : '다음'}
                <ArrowRight className='ml-2 size-4' />
              </Button>
            </FieldSet>
            <p className='text-center text-xs text-gray-500'>
              Enter 키를 눌러 다음 단계로 이동할 수 있습니다
            </p>
          </FieldGroup>
        </CardContent>
      </Card>
      <AlertDialog
        open={submitCheckDialogOpen}
        onOpenChange={setSubmitCheckDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>다음 정보가 맞는지 확인해주세요</AlertDialogTitle>
            <AlertDialogDescription>
              <Alert
                variant='destructive'
                className={`grid border-red-500 bg-red-500/70 text-white ${errors.submit ? 'mb-4 grid-rows-[1fr]' : 'mb-0 grid-rows-[0fr] p-0 opacity-0'} transition-all`}
              >
                <AlertCircleIcon className={`${errors.submit ? '' : 'hidden'}`} />
                <AlertTitle className={`${errors.submit ? '' : 'hidden'}`}>
                  {errors.submit}
                </AlertTitle>
              </Alert>
              <ul
                className='list-disc space-y-2 pl-5'
                aria-live='polite'
              >
                {steps.map((step) => (
                  <li key={step.id}>
                    <strong>{step.label}:</strong> {formData[step.id]}
                  </li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant='default'
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span>제출 중</span>
                    <Icon
                      icon='mdi:loading'
                      className='ml-2 animate-spin'
                    />
                  </>
                ) : (
                  '확인'
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
