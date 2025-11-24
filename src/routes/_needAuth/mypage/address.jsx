import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import DefaultAddress from '@/components/address/DefaultAddress';
import NewAddressForm from '@/components/address/NewAddressForm';
import AddressList from '@/components/address/AddressList';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_needAuth/mypage/address')({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState(0); // 0: 기본, 1: 신규, 2: 목록
  const [editingAddress, setEditingAddress] = useState(null);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      addressName: '우리집',
      receiverName: '홍길동',
      zipcord: '12345',
      address1: '서울시 강남구 테헤란로 123',
      address2: '101동 1001호',
      phone: '010-1234-5678',
      isDefault: true,
    },
    {
      id: 2,
      addressName: '회사',
      receiverName: '홍길동',
      zipcord: '67890',
      address1: '서울시 서초구 서초대로 456',
      address2: '5층',
      phone: '010-9876-5432',
      isDefault: false,
    },
  ]);

  // activeTab 변경 없이 수정폼
  const handleEdit = (addr) => {
    setEditingAddress(addr);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = (form) => {
    if (form.id) {
      // update
      setAddresses((prev) => prev.map((a) => (a.id === form.id ? { ...a, ...form } : a)));
    } else {
      // create
      const nextId = Math.max(0, ...addresses.map((a) => a.id)) + 1;
      setAddresses((prev) => [...prev, { ...form, id: nextId }]);
    }

    setEditingAddress(null);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  const defaultAddr = addresses.find((a) => a.isDefault) || null;

  const tabs = [
    {
      label: '기본배송지',
      component:
        editingAddress?.id === defaultAddr?.id ? (
          <NewAddressForm
            initialForm={editingAddress}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        ) : (
          <DefaultAddress
            defaultAddress={defaultAddr}
            onEdit={handleEdit}
          />
        ),
    },
    {
      label: '신규배송지',
      component: (
        <NewAddressForm
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      ),
    },
    {
      label: '배송지목록',
      component: editingAddress ? (
        <NewAddressForm
          initialForm={editingAddress}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      ) : (
        <AddressList
          addresses={addresses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-3xl py-4'>
        <h1 className='mb-5 text-2xl'>배송지 관리</h1>

        <div className='mb-0 flex'>
          {tabs.map((tab, idx) => (
            <Button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                // 다른 탭으로 이동하면 편집 상태 초기화
                setEditingAddress(null);
              }}
              className={`rounded-b-none border border-gray-300 px-4 py-2 ${activeTab === idx ? `border-b-0 bg-white text-black` : `bg-gray-200 text-black`} mr-1 hover:bg-transparent focus:outline-none`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div
          className='-mt-px rounded-b-md border border-gray-300 bg-white p-4'
          aria-label={`현재 탭: ${tabs[activeTab].label}`}
        >
          {tabs[activeTab].component}
        </div>
      </div>
    </div>
  );
}
