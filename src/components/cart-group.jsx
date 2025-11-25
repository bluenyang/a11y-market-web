import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/api/axiosInstance';

export const CartGroup = ({ groupData, selectedItems, setSelectedItems }) => {
  const [data, setData] = useState(groupData.items);

  const handleSelectItem = (itemId, isSelected) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = new Set(prevSelectedItems);
      if (isSelected) {
        updatedSelectedItems.add(itemId);
      } else {
        updatedSelectedItems.delete(itemId);
      }
      return updatedSelectedItems;
    });
  };

  const handleSelectAll = (isSelected) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = new Set(prevSelectedItems);
      data.forEach((item) => {
        if (isSelected) {
          updatedSelectedItems.add(item.productId);
        } else {
          updatedSelectedItems.delete(item.productId);
        }
      });
      return updatedSelectedItems;
    });
  };

  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);

    axiosInstance.delete(`/v1/cart/items/${data[index].cartItemId}`);
  };

  useEffect(() => {
    data.forEach((item) => {
      if (!selectedItems.has(item.productId)) {
        setSelectedItems((prevSelectedItems) => {
          const updatedSelectedItems = new Set(prevSelectedItems);
          updatedSelectedItems.add(item.productId);
          return updatedSelectedItems;
        });
      }
    });
  }, []);

  return (
    <div className='w-full overflow-hidden rounded-md border bg-neutral-50'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[5%] py-4 text-center'>
              <Checkbox
                checked={data.every((item) => selectedItems.has(item.productId))}
                onCheckedChange={handleSelectAll}
                className='size-6'
              />
            </TableHead>
            <TableHead
              colSpan={5}
              className='w-[95%] text-2xl font-bold'
            >
              {data[0].sellerName}
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className='w-[5%] py-2 text-center text-lg font-bold'>선택</TableHead>
            <TableHead className='w-[10%] py-2 text-center text-lg font-bold'>
              상품 이미지
            </TableHead>
            <TableHead className='w-[40%] py-2 text-lg font-bold'>상품명</TableHead>
            <TableHead className='w-[15%] py-2 text-center text-lg font-bold'>수량</TableHead>
            <TableHead className='w-[20%] py-2 text-center text-lg font-bold'>가격</TableHead>
            <TableHead className='w-[10%] py-2 text-center text-lg font-bold'>삭제</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.cartItemId}>
              <TableCell className='w-[5%] text-center'>
                <Checkbox
                  checked={selectedItems.has(item.productId)}
                  onCheckedChange={(isSelected) => handleSelectItem(item.productId, isSelected)}
                  className='size-6'
                />
              </TableCell>
              <TableCell className='w-[10%]'>
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className='h-16 w-24 object-cover'
                />
              </TableCell>
              <TableCell className='w-[40%]'>
                <div className='flex flex-col gap-2'>
                  <span className='text-lg font-bold'>{item.productName}</span>
                </div>
              </TableCell>
              <TableCell className='w-[15%] text-center'>
                <ButtonGroup className='mx-auto'>
                  <Button
                    variant='outline'
                    className='w-8'
                    onClick={() => {
                      if (item.quantity > 1) {
                        const newData = [...data];
                        newData[index].quantity -= 1;
                        setData(newData);

                        axiosInstance.patch(`/v1/cart/items/${item.cartItemId}`, {
                          quantity: newData[index].quantity,
                        });
                      }
                    }}
                  >
                    <MinusIcon className='size-4' />
                  </Button>
                  <Input
                    className='w-8 bg-white p-0 text-center'
                    value={item.quantity}
                    readOnly
                  />
                  <Button
                    variant='outline'
                    className='w-8'
                    onClick={() => {
                      const newData = [...data];
                      newData[index].quantity += 1;
                      setData(newData);

                      axiosInstance.patch(`/v1/cart/items/${item.cartItemId}`, {
                        quantity: newData[index].quantity,
                      });
                    }}
                  >
                    <PlusIcon className='size-4' />
                  </Button>
                </ButtonGroup>
              </TableCell>
              <TableCell className='w-[20%] text-center text-lg'>
                ₩{(item.productPrice * item.quantity).toLocaleString('ko-KR')}
              </TableCell>
              <TableCell className='w-[10%] text-center'>
                <Button
                  variant='ghost'
                  className='size-12 text-black hover:bg-neutral-200 hover:text-red-500'
                  onClick={() => handleDelete(index)}
                >
                  <TrashIcon className='size-6' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
