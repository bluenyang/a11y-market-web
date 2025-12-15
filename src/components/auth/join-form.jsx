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
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { formatPhoneNumber } from '@/lib/phone-number-formatter';
import { useNavigate } from '@tanstack/react-router';
import { AlertCircleIcon, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../ui/spinner';

export const JoinForm = ({
  formTitle,
  steps,
  formData,
  setFormData,
  errors,
  setErrors,
  isCompleted,
  isSubmitting,
  submitCheckDialogOpen,
  setSubmitCheckDialogOpen,
  validateField,
  validateCheckSteps,
  handleSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const inputRef = useRef(null);
  const focusRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current && !isCompleted) {
      inputRef.current.focus();
    }
    if (focusRef.current && isCompleted) {
      focusRef.current.focus();
    }
  }, [currentStep, isCompleted]);

  const currentField = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    const error = validateField(currentField.id, formData[currentField.id]);
    if (error) {
      setErrors((prev) => ({ ...prev, [currentField.id]: error }));
      return;
    }
    setErrors((prev) => ({ ...prev, [currentField.id]: null }));

    if (currentField.id === 'userPass') {
      const confirmError = validateField(
        `${currentField.id}Confirm`,
        formData[`${currentField.id}Confirm`],
      );
      if (confirmError) {
        setErrors((prev) => ({ ...prev, [`${currentField.id}Confirm`]: confirmError }));
        return;
      }
      setErrors((prev) => ({ ...prev, [`${currentField.id}Confirm`]: null }));
    }

    const isValid = await validateCheckSteps(currentField.id);
    if (!isValid) {
      return;
    }

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
    const id = e.target.id;

    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handlePhoneChange = (e) => {
    // Remove all non-numeric characters
    let value = e.target.value.replace(/[^0-9]/g, '');

    // Limit to 13 characters (including dashes)
    value = value.slice(0, 11);

    // Update form data
    setFormData((prev) => ({ ...prev, [currentField.id]: value }));

    // Clear errors if any
    if (errors[currentField.id]) {
      setErrors((prev) => ({ ...prev, [currentField.id]: null }));
    }
  };

  // Move next step on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  if (isCompleted) {
    return (
      <div className='flex items-center justify-center bg-neutral-50 py-16'>
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
              ref={focusRef}
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
      </div>
    );
  }

  return (
    <form className='flex items-center justify-center bg-neutral-50 px-4 py-8'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>
            <h1 className='text-xl font-extrabold'>{formTitle}</h1>
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
          <form>
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
                  <FieldLabel
                    htmlFor={currentField.id}
                    className='text-lg'
                  >
                    {currentField.label}
                  </FieldLabel>

                  {currentField.id === 'userPass' && (
                    <Input
                      type='email'
                      autoComplete='username'
                      value={formData.userEmail || ''}
                      className='hidden'
                      readOnly
                    />
                  )}
                  <Input
                    ref={inputRef}
                    key={currentField.id}
                    id={currentField.id}
                    type={currentField.type}
                    placeholder={currentField.placeholder}
                    value={
                      currentField.id === 'userPhone'
                        ? formatPhoneNumber(formData[currentField.id])
                        : formData[currentField.id]
                    }
                    autoComplete={currentField.autoComplete}
                    onChange={currentField.id === 'userPhone' ? handlePhoneChange : handleChange}
                    onKeyDown={handleKeyDown}
                    aria-describedby={`${currentField.id}-description ${
                      errors[currentField.id] ? `${currentField.id}-error` : ''
                    }`}
                    aria-invalid={!!errors[currentField.id]}
                    className='px-4 py-6 text-lg'
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
              {currentField.id === 'userPass' && (
                <FieldSet>
                  <Field>
                    <FieldLabel
                      htmlFor={currentField.id}
                      className='text-lg'
                    >
                      {`${currentField.label} 확인`}
                    </FieldLabel>
                    <Input
                      key={`${currentField.id}Confirm`}
                      id={`${currentField.id}Confirm`}
                      type={currentField.type}
                      placeholder={currentField.placeholder}
                      value={formData[`${currentField.id}Confirm`]}
                      autoComplete='new-password'
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      aria-describedby={`${currentField.id}Confirm-description ${
                        errors[`${currentField.id}Confirm`] ? `${currentField.id}Confirm-error` : ''
                      }`}
                      aria-invalid={!!errors[`${currentField.id}Confirm`]}
                      className='p-6 text-lg'
                    />
                    {errors[`${currentField.id}Confirm`] && (
                      <p
                        id={`${currentField.id}Confirm-error`}
                        className='mt-2 text-sm text-red-600'
                        role='alert'
                        aria-live='polite'
                      >
                        {errors[`${currentField.id}Confirm`]}
                      </p>
                    )}
                  </Field>
                </FieldSet>
              )}
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
                  aria-label={
                    currentStep === steps.length - 1 ? '회원가입 완료' : '다음 단계로 이동'
                  }
                >
                  {currentStep === steps.length - 1 ? '완료' : '다음'}
                  <ArrowRight className='ml-2 size-4' />
                </Button>
              </FieldSet>
              <p className='text-center text-xs text-gray-500'>
                Enter 키를 눌러 다음 단계로 이동할 수 있습니다
              </p>
            </FieldGroup>
          </form>
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
                {steps.map((step) => {
                  if (step.id === 'userPass' || step.id === 'userPassConfirm') {
                    return null;
                  }
                  return (
                    <li key={step.id}>
                      <strong>{step.label}:</strong> {formData[step.id]}
                    </li>
                  );
                })}
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
                    <Spinner />
                  </>
                ) : (
                  '확인'
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
};
