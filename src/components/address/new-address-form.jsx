import { addressApi } from '@/api/address-api';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { toast } from 'sonner';

export const NewAddressForm = ({
  mode,
  initialForm = null,
  onSave,
  onCancel,
  isDefault = false,
}) => {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState('');
  const [formData, setFormData] = useState({
    addressName: '',
    receiverName: '',
    receiverPhone: '',
    receiverZipcode: '',
    receiverAddr1: '',
    receiverAddr2: '',
    isDefault: isDefault,
  });

  useEffect(() => {
    if (initialForm) {
      setFormData({
        addressId: initialForm.addressId,
        addressName: initialForm.addressName,
        receiverName: initialForm.receiverName,
        receiverPhone: initialForm.receiverPhone,
        receiverZipcode: initialForm.receiverZipcode,
        receiverAddr1: initialForm.receiverAddr1,
        receiverAddr2: initialForm.receiverAddr2,
        isDefault: initialForm.isDefault,
      });
      setFormattedPhone(formatPhoneNumber(initialForm.receiverPhone));
    }
  }, [initialForm]);

  const handleOnComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setFormData((prev) => ({
      ...prev,
      receiverZipcode: data.zonecode,
      receiverAddr1: fullAddress,
    }));
    setIsAddressDialogOpen(false);
  };

  const transparentScrollbarStyle =
    '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-400 [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent';

  const formatPhoneNumber = (value) => {
    if (!value) return '';
    const input = value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, receiverPhone: input }));

    let formattedValue = value;
    if (input.length > 3 && input.length <= 7) {
      formattedValue = `${input.slice(0, 3)}-${input.slice(3)}`;
    } else if (input.length === 10) {
      formattedValue = `${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(6)}`;
    } else if (input.length > 7) {
      formattedValue = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`;
    }

    return formattedValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        await addressApi.createAddress(formData);
      } else {
        await addressApi.updateAddress(formData.addressId, formData);
      }
      toast.success('배송지를 저장했습니다.');
      onSave && onSave();
    } catch (err) {
      console.error('배송지 저장 실패:', err);
      toast.error(err.message || '배송지 저장에 실패했습니다.');
    }
  };

  return (
    <div
      className={`flex max-h-[80vh] w-full flex-col gap-4 overflow-y-auto p-4 ${transparentScrollbarStyle}`}
    >
      {isAddressDialogOpen ? (
        <>
          <DaumPostcodeEmbed
            onComplete={handleOnComplete}
            className='h-[400px]'
          />
          <Button
            variant='default'
            className='mt-2'
            onClick={() => setIsAddressDialogOpen(false)}
          >
            닫기
          </Button>
        </>
      ) : (
        <>
          <div>
            <h3 className='text-lg font-semibold'>
              {mode === 'add' ? '배송지 추가' : '배송지 수정'}
            </h3>
            <p className='text-sm text-neutral-600'>
              {mode === 'add' ? '새로운 배송지를 추가합니다.' : '기존 배송지를 수정합니다.'}
            </p>
          </div>
          <Separator className='mt-2 mb-4 rounded-full border border-neutral-300' />
          <FieldGroup>
            <Field>
              <div className='flex items-center justify-between'>
                <FieldLabel htmlFor='addressName'>주소명</FieldLabel>
                <div className='flex flex-row items-center gap-2'>
                  <Checkbox
                    id='isDefault'
                    checked={formData.isDefault}
                    onCheckedChange={(value) =>
                      setFormData((prev) => ({ ...prev, isDefault: value }))
                    }
                    disabled={mode === 'add' && isDefault}
                  />
                  <Label
                    htmlFor='isDefault'
                    className='text-sm text-neutral-500'
                  >
                    기본 배송지로 설정
                  </Label>
                </div>
              </div>
              <Input
                id='addressName'
                placeholder='주소명을 입력하세요'
                value={formData.addressName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, addressName: value.target.value }))
                }
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='receiverName'>받는 분</FieldLabel>
              <Input
                id='receiverName'
                placeholder='받는 분 이름을 입력하세요'
                value={formData.receiverName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, receiverName: value.target.value }))
                }
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='receiverPhone'>전화번호</FieldLabel>
              <Input
                id='receiverPhone'
                placeholder='받는 분 전화번호를 입력하세요'
                maxLength={15}
                value={formattedPhone}
                onChange={(e) => {
                  // setFormData((prev) => ({ ...prev, receiverPhone: value.target.value }));
                  setFormattedPhone(formatPhoneNumber(e.target.value));
                }}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='receiverZipcode'>우편번호</FieldLabel>
              <ButtonGroup>
                <Input
                  id='receiverZipcode'
                  placeholder='우편번호'
                  value={formData.receiverZipcode}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, receiverZipcode: value.target.value }))
                  }
                  readOnly
                  required
                />
                <Button
                  variant='outline'
                  className={`bg-neutral-50 hover:bg-neutral-200`}
                  onClick={() => setIsAddressDialogOpen(true)}
                >
                  우편번호 찾기
                </Button>
              </ButtonGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor='receiverAddr1'>주소</FieldLabel>
              <Input
                id='receiverAddr1'
                placeholder='주소를 입력하세요'
                value={formData.receiverAddr1}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, receiverAddr1: value.target.value }))
                }
                readOnly
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='receiverAddr2'>상세주소</FieldLabel>
              <Input
                id='receiverAddr2'
                placeholder='상세주소를 입력하세요'
                value={formData.receiverAddr2 || ''}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, receiverAddr2: value.target.value }))
                }
                required
              />
            </Field>
          </FieldGroup>
          <Button
            variant='default'
            className='mt-4'
            type='submit'
            onClick={handleSubmit}
            aria-label={mode === 'add' ? '배송지 추가 버튼' : '배송지 수정 버튼'}
          >
            {mode === 'add' ? '추가하기' : '수정하기'}
          </Button>
          {mode !== 'add' && (
            <Button
              variant='outline'
              type='reset'
              aria-label='배송지 수정 취소 버튼'
              onClick={onCancel}
            >
              취소
            </Button>
          )}
        </>
      )}
    </div>
  );
};
