import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/join/')({
  component: RouteComponent,
});

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

  const navigate = useNavigate();

  useEffect(() => {
    if (tempToken === '' || tempToken == null) {
      navigate({
        to: '/invalid-path',
      });
    }
  }, [currentStep, isCompleted]);

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
      console.log('Checking phone:', data);
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
      const resp = await authApi.join(formData, tempToken);
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
        formTitle={`회원가입`}
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

  // const navigate = useNavigate();

  // const [emailId, setEmailId] = useState('');
  // const [emailDomain, setEmailDomain] = useState('naver.com');
  // const [password, setPassword] = useState('');
  // const [passwordCheck, setPasswordCheck] = useState('');
  // const [name, setName] = useState('');
  // const [nickname, setNickname] = useState('');
  // const [phone, setPhone] = useState('');
  // const [birthYear, setBirthYear] = useState('');
  // const [birthMonth, setBirthMonth] = useState('');
  // const [birthDay, setBirthDay] = useState('');
  // const [errorMsg, setErrorMsg] = useState('');

  // function handleEmailCheck() {
  //   setErrorMsg('');
  //   if (!emailId.trim()) return setErrorMsg('이메일을 입력하세요.');

  //   //TODO: 실제 API 연동 필요
  //   alert('사용 가능한 이메일입니다.');
  // }

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   setErrorMsg('');

  //   //검증
  //   if (!emailId) return setErrorMsg('이메일을 입력하세요.');
  //   if (!password) return setErrorMsg('비밀번호를 입력하세요.');
  //   if (password.length < 8) return setErrorMsg('비밀번호는 최소 8자 이상이어야 합니다.');
  //   if (password !== passwordCheck) return setErrorMsg('비밀번호가 일치하지 않습니다.');
  //   if (!name.trim()) return setErrorMsg('이름을 입력하세요.');
  //   if (!/^[0-9]{11}$/.test(phone)) return setErrorMsg('전화번호는 숫자 11자리여야 합니다.');

  //   alert('회원가입이 완료되었습니다.');
  //   navigate({ to: '/login' });
  // }

  // return (
  //   <main className='font-kakao-big-sans mx-auto max-w-md px-4 py-10'>
  //     <h1 className='mb-6 text-xl font-bold'>회원가입</h1>
  //     <p className='mb-6 text-sm text-gray-600'>* 표시된 항목은 필수 입력입니다.</p>

  //     {errorMsg && <p className='mb-4 text-sm font-medium text-red-600'>{errorMsg}</p>}

  //     <form
  //       onSubmit={handleSubmit}
  //       className='space-y-6'
  //     >
  //       {/* 이메일 */}
  //       <div className='space-y-2'>
  //         <Label className='text-sm font-semibold'>
  //           이메일<span className='text-red-500'>*</span>
  //         </Label>
  //         <div className='flex items-center gap-2'>
  //           <Input
  //             id='emailId'
  //             type='text'
  //             placeholder='이메일 주소'
  //             value={emailId}
  //             onChange={(e) => setEmailId(e.target.value)}
  //           />
  //           <span>@</span>
  //           <Select
  //             value={emailDomain}
  //             onValueChange={setEmailDomain}
  //           >
  //             <SelectTrigger className='w-[180px]'>
  //               <SelectValue placeholder='도메인 선택' />
  //             </SelectTrigger>
  //             <SelectContent>
  //               <SelectItem value='naver.com'>naver.com</SelectItem>
  //               <SelectItem value='gmail.com'>gmail.com</SelectItem>
  //               <SelectItem value='daum.com'>daum.com</SelectItem>
  //             </SelectContent>
  //           </Select>
  //           <Button
  //             type='button'
  //             variant='outline'
  //             className='text-sm'
  //             onClick={handleEmailCheck}
  //           >
  //             중복확인
  //           </Button>
  //         </div>
  //       </div>

  //       {/* 비밀번호 */}
  //       <div className='space-y-2'>
  //         <Label
  //           htmlFor='password'
  //           className='text-sm font-semibold'
  //         >
  //           비밀번호 <span className='text-red-500'>*</span>
  //         </Label>
  //         <Input
  //           id='password'
  //           type='password'
  //           placeholder='비밀번호 입력 (문자, 숫자, 특수문자 포함 8~20자)'
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //       </div>

  //       {/* 비밀번호 확인*/}
  //       <div className='space-y-2'>
  //         <Label
  //           htmlFor='passwordCheck'
  //           className='text-sm font-semibold'
  //         >
  //           비밀번호 확인 <span className='text-red-500'>*</span>
  //         </Label>
  //         <Input
  //           id='passwordCheck'
  //           type='password'
  //           placeholder='비밀번호 재입력'
  //           value={passwordCheck}
  //           onChange={(e) => setPasswordCheck(e.target.value)}
  //         />
  //       </div>

  //       {/* 이름 */}
  //       <div className='space-y-2'>
  //         <Label
  //           htmlFor='name'
  //           className='text-sm font-semibold'
  //         >
  //           이름 <span className='text-red-500'>*</span>
  //         </Label>
  //         <Input
  //           id='name'
  //           type='text'
  //           placeholder='이름 입력'
  //           value={name}
  //           onChange={(e) => setName(e.target.value)}
  //         />
  //       </div>

  //       {/* 닉네임 */}
  //       <div className='space-y-2'>
  //         <Label
  //           htmlFor='nickname'
  //           className='text-sm font-semibold'
  //         >
  //           닉네임
  //         </Label>
  //         <Input
  //           id='nickname'
  //           type='text'
  //           placeholder='닉네임 입력'
  //           value={nickname}
  //           onChange={(e) => setNickname(e.target.value)}
  //         />
  //       </div>

  //       {/* 전화번호 */}
  //       <div className='space-y-2'>
  //         <Label
  //           htmlFor='phone'
  //           className='text-sm font-semibold'
  //         >
  //           전화번호 <span className='text-red-500'>*</span>
  //         </Label>
  //         <Input
  //           id='phone'
  //           type='text'
  //           placeholder="휴대폰 번호 입력 ('-' 제외 11자리 입력)"
  //           value={phone}
  //           onChange={(e) => setPhone(e.target.value)}
  //         />
  //       </div>

  //       {/* 생년월일 */}
  //       <div className='space-y-2'>
  //         <Label className='text-sm font-semibold'>생년월일</Label>
  //         <div className='flex gap-2'>
  //           <Select
  //             value={birthYear}
  //             onValueChange={setBirthYear}
  //           >
  //             <SelectTrigger className='flex-1'>
  //               <SelectValue placeholder='년도' />
  //             </SelectTrigger>
  //             <SelectContent>
  //               {Array.from({ length: 60 }, (_, i) => 2024 - i).map((year) => (
  //                 <SelectItem
  //                   key={year}
  //                   value={String(year)}
  //                 >
  //                   {year}
  //                 </SelectItem>
  //               ))}
  //             </SelectContent>
  //           </Select>

  //           <Select
  //             value={birthMonth}
  //             onValueChange={setBirthMonth}
  //           >
  //             <SelectTrigger className='flex-1'>
  //               <SelectValue placeholder='월' />
  //             </SelectTrigger>
  //             <SelectContent>
  //               {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
  //                 <SelectItem
  //                   key={m}
  //                   value={String(m)}
  //                 >
  //                   {m}
  //                 </SelectItem>
  //               ))}
  //             </SelectContent>
  //           </Select>

  //           <Select
  //             value={birthDay}
  //             onValueChange={setBirthDay}
  //           >
  //             <SelectTrigger className='flex-1'>
  //               <SelectValue placeholder='일' />
  //             </SelectTrigger>
  //             <SelectContent>
  //               {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
  //                 <SelectItem
  //                   key={d}
  //                   value={String(d)}
  //                 >
  //                   {d}
  //                 </SelectItem>
  //               ))}
  //             </SelectContent>
  //           </Select>
  //         </div>
  //       </div>

  //       {/* 버튼 영역 */}
  //       <div className='mt-8 space-y-3'>
  //         <Button
  //           type='submit'
  //           variant='default'
  //           className='w-full'
  //         >
  //           가입하기
  //         </Button>

  //         <Button
  //           type='button'
  //           variant='outline'
  //           className='w-full'
  //           onClick={() => navigate({ to: '..' })}
  //         >
  //           가입 취소
  //         </Button>
  //       </div>
  //     </form>
  //   </main>
  // );
}
