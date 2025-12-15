import { addressApi } from '@/api/address-api';
import { AddressModifier } from '@/components/address/address-modifier';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { formatPhoneNumber } from '@/lib/phone-number-formatter';
import { useEffect, useState } from 'react';
import { Spinner } from '../ui/spinner';

export const AddressSelector = ({ defaultAddressId, onSelectAddress }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await addressApi.getAddressList();
      if (status !== 200) {
        throw new Error('Failed to fetch address list');
      }
      setAddresses(data);
      if (selectedAddress == null) {
        const defaultAddr = data.find((addr) => addr.addressId === defaultAddressId) || data[0];
        setSelectedAddress(defaultAddr);
        onSelectAddress(defaultAddr);

        if (!defaultAddr) {
          setSelectDialogOpen(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    onSelectAddress(address);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Card className='px-0 py-4'>
      <CardHeader>
        <CardTitle>
          <span>배송지 정보</span>
        </CardTitle>
        {addresses.length > 0 && selectedAddress ? (
          <CardDescription>{`선택된 배송지: ${selectedAddress.addressName}`}</CardDescription>
        ) : (
          <CardDescription>등록된 배송지가 없습니다.</CardDescription>
        )}
        <CardAction className='self-center'>
          <Dialog
            open={selectDialogOpen}
            onOpenChange={setSelectDialogOpen}
          >
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
                <AddressModifier
                  mode='add'
                  onChange={fetchAddresses}
                />
                {addresses.map((address) => (
                  <Item
                    variant='outline'
                    key={address.addressId}
                    className={`${address.addressId === selectedAddress.addressId ? 'border-3 border-blue-300' : ''}`}
                  >
                    <ItemContent>
                      <ItemTitle>{address.addressName}</ItemTitle>
                      <ItemDescription>
                        <span>{`${address.receiverName || ''} | ${formatPhoneNumber(address.receiverPhone) || ''}`}</span>
                        <br />
                        <span>{`${address.receiverAddr1 || ''} ${address.receiverAddr2 || ''}`}</span>
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        variant='default'
                        size='sm'
                        onClick={() => {
                          handleAddressSelect(address);
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
        {selectedAddress ? (
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className='w-[10%] pl-4 text-right'>배송지 이름</TableHead>
                <TableCell className='border-l px-8'>{selectedAddress.addressName || ''}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[10%] pl-4 text-right'>수령인</TableHead>
                <TableCell className='border-l px-8'>
                  {selectedAddress.receiverName || ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[10%] pl-4 text-right'>연락처</TableHead>
                <TableCell className='border-l px-8'>
                  {formatPhoneNumber(selectedAddress.receiverPhone) || ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[10%] pl-4 text-right'>우편번호</TableHead>
                <TableCell className='border-l px-8'>
                  {selectedAddress.receiverZipcode || ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className='w-[10%] pl-4 text-right'>주소</TableHead>
                <TableCell className='border-l px-8'>{`${selectedAddress.receiverAddr1 || ''} ${selectedAddress.receiverAddr2 || ''}`}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p>선택된 배송지가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
};
