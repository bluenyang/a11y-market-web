import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { AddressModifier } from '@/components/address/address-modifier';

export const AddressSelector = ({ addresses, defaultAddressId, onSelectAddress }) => {
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddressId);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    onSelectAddress(addressId);
  };

  const selectedAddress = addresses.find((addr) => addr.addressId === selectedAddressId);

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    if (phoneNumber.length === 10) {
      return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (phoneNumber.length === 11) {
      return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return phoneNumber;
  };

  return (
    <Card className='px-0 py-4'>
      <CardHeader>
        <CardTitle>
          <span>배송지 정보</span>
        </CardTitle>
        <CardDescription>선택된 배송지: {selectedAddress.addressName}</CardDescription>
        <CardAction className='self-center'>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant='default'
                aria-label='배송지 변경 버튼'
              >
                배송지 변경
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>배송지 선택</DialogTitle>
                <DialogDescription>배송지를 선택해 주세요.</DialogDescription>
              </DialogHeader>
              <div className='grid gap-4'>
                <AddressModifier mode='add' />
                {addresses.map((address) => (
                  <Item
                    variant='outline'
                    key={address.addressId}
                    className={`${address.addressId === selectedAddress.addressId ? 'border-3 border-blue-300' : ''}`}
                  >
                    <ItemContent>
                      <ItemTitle>{address.addressName}</ItemTitle>
                      <ItemDescription>
                        <p>{`${address.receiverName} | ${formatPhoneNumber(address.receiverPhone)}`}</p>
                        <p>{`${address.receiverAddr1} ${address.receiverAddr2}`}</p>
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        variant='default'
                        size='sm'
                        onClick={() => {
                          handleAddressSelect(address.addressId);
                        }}
                        aria-label={`배송지 ${address.addressName} 선택 버튼`}
                        className='hover:bg-blue-700 hover:shadow-md'
                      >
                        선택
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='default'>닫기</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className='w-[10%] bg-neutral-100 pl-4 text-right'>배송지 이름</TableHead>
              <TableCell className='border-l px-8'>{selectedAddress.addressName}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className='w-[10%] bg-neutral-100 pl-4 text-right'>수령인</TableHead>
              <TableCell className='border-l px-8'>{selectedAddress.receiverName}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className='w-[10%] bg-neutral-100 pl-4 text-right'>연락처</TableHead>
              <TableCell className='border-l px-8'>
                {formatPhoneNumber(selectedAddress.receiverPhone)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className='w-[10%] bg-neutral-100 pl-4 text-right'>우편번호</TableHead>
              <TableCell className='border-l px-8'>{selectedAddress.receiverZipcode}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className='w-[10%] bg-neutral-100 pl-4 text-right'>주소</TableHead>
              <TableCell className='border-l px-8'>{`${selectedAddress.receiverAddr1} ${selectedAddress.receiverAddr2}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
