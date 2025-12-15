import { addressApi } from '@/api/address-api';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { toast } from 'sonner';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

export const AddressModifier = ({ mode, onChange, className = '', variant = 'outline' }) => {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isModifierDialogOpen, setIsModifierDialogOpen] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState('');
  const [formData, setFormData] = useState({
    addressName: '',
    receiverName: '',
    receiverPhone: '',
    receiverZipcode: '',
    receiverAddr1: '',
    receiverAddr2: '',
    isDefault: false,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'add') {
        await addressApi.createAddress(formData);
      } else {
        await addressApi.updateAddress(formData);
      }

      onChange && onChange();
      setIsModifierDialogOpen(false);
      toast.success('배송지를 저장했습니다.');
    } catch (err) {
      console.error('배송지 저장 실패:', err);
      toast.error(err.message || '배송지 저장에 실패했습니다.');
    }
  };

  return (
    <Dialog
      open={isModifierDialogOpen}
      onOpenChange={setIsModifierDialogOpen}
    >
      <form>
        <DialogTrigger asChild>
          <Button
            className={cn(
              'w-full transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-md',
              className,
            )}
            variant={variant}
          >
            {mode === 'add' ? '배송지 추가' : '배송지 수정'}
          </Button>
        </DialogTrigger>
        <DialogContent className='px-0 pt-2'>
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
                <DialogHeader>
                  <DialogTitle>{mode === 'add' ? '배송지 추가' : '배송지 수정'}</DialogTitle>
                  <DialogDescription>
                    {mode === 'add' ? '새로운 배송지를 추가합니다.' : '기존 배송지를 수정합니다.'}
                  </DialogDescription>
                </DialogHeader>
                <Separator className='mt-2 mb-4 rounded-full border border-neutral-300' />
                <FieldGroup>
                  <FieldSet className='flex gap-4'>
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
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, addressName: e.target.value }))
                        }
                        required
                      />
                    </Field>
                  </FieldSet>
                  <Field>
                    <FieldLabel htmlFor='receiverName'>받는 분</FieldLabel>
                    <Input
                      id='receiverName'
                      placeholder='받는 분 이름을 입력하세요'
                      value={formData.receiverName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, receiverName: e.target.value }))
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
                        const formatted = formatPhoneNumber(e.target.value);
                        setFormattedPhone(formatted);
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
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, receiverZipcode: e.target.value }))
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
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, receiverAddr1: e.target.value }))
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
                      value={formData.receiverAddr2}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, receiverAddr2: e.target.value }))
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
                <DialogClose asChild>
                  <Button
                    variant='outline'
                    type='reset'
                    aria-label='배송지 수정 취소 버튼'
                  >
                    취소
                  </Button>
                </DialogClose>
              </>
            )}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};
