import { addressApi } from '@/api/address-api';
import AddressList from '@/components/address/address-list';
import DefaultAddress from '@/components/address/default-address';
import { NewAddressForm } from '@/components/address/new-address-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const AddressManager = () => {
  const [activeTab, setActiveTab] = useState('default');
  const [editingAddress, setEditingAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const handleEdit = (addr) => setEditingAddress(addr);

  const handleDelete = async (addressId) => {
    try {
      await addressApi.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.addressId !== addressId));
      toast.success('배송지가 삭제되었습니다,');
    } catch (err) {
      toast.message('배송지 삭제를 실패했습니다.');
    }
  };

  const handleSave = async (form) => {
    try {
      let response;
      if (form.addressId) {
        response = await addressApi.updateAddress(form.addressId, form);
      } else {
        response = await addressApi.createAddress(form);
      }
      const updated = response.data;
      setAddresses((prev) => {
        const exists = prev.find((a) => a.addressId === updated.addressId);
        if (exists) {
          return prev.map((a) => (a.addressId === updated.addressId ? updated : a));
        }
        return [...prev, updated];
      });
      setEditingAddress(null);
      toast.success('배송지를 저장했습니다.');
    } catch (err) {
      toast.message('배송지 저장을 실패했습니다.');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const listResp = await addressApi.getAddressList();

        let list = listResp.data.map((addr) => ({
          ...addr,
        }));
        let defaultAddr = null;
        try {
          const defaultResp = await addressApi.getDefaultAddress();
          defaultAddr = defaultResp.data;
        } catch (err) {
          defaultAddr = null;
        }

        if (defaultAddr && !list.find((a) => a.isDefault)) {
          list.push(defaultAddr);
        }
        setAddresses(list);
      } catch (err) {
        console.error(err);
        setAddresses([]);
      }
    })();
  }, []);

  const defaultAddr = addresses.find((a) => a.isDefault) || null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>배송지 관리</CardTitle>
        <CardDescription className='text-lg'>배송지를 등록/관리 할 수 있습니다.</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue='default'
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setEditingAddress(null);
          }}
          className='w-full'
        >
          <TabsList className='mb-0 grid h-12 w-full grid-cols-3'>
            <TabsTrigger value='default'>기본배송지</TabsTrigger>
            <TabsTrigger value='new'>신규배송지</TabsTrigger>
            <TabsTrigger value='list'>배송지목록</TabsTrigger>
          </TabsList>

          {/* 기본배송지 */}
          <TabsContent value='default'>
            {editingAddress?.addressId === defaultAddr?.addressId ? (
              <NewAddressForm mode='add' />
            ) : (
              <DefaultAddress
                defaultAddress={defaultAddr}
                onEdit={handleEdit}
              />
            )}
          </TabsContent>

          {/* 신규배송지 */}
          <TabsContent value='new'>
            <NewAddressForm mode='add' />
          </TabsContent>

          {/* 배송지 목록 */}
          <TabsContent value='list'>
            {editingAddress ? (
              <NewAddressForm
                mode='edit'
                initialForm={editingAddress}
                onSave={handleSave}
                onCancel={() => setEditingAddress(null)}
              />
            ) : (
              <AddressList
                addresses={addresses}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
