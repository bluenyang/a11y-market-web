import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function A11yProfileList({ profiles, onCreate, onApply, onEdit, onDelete }) {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold'>저장된 접근성 프로필</h2>

      {profiles.length === 0 && <p className='text-gray-500'>저장된 프로필이 없습니다.</p>}

      <Button
        variant='outline'
        onClick={onCreate}
      >
        새 프로필 추가
      </Button>

      <div className='space-y-3'>
        {profiles.map((p) => (
          <div
            key={p.profileId}
            className='flex items-center justify-between rounded-md border p-3'
          >
            <div className='flex flex-col gap-1'>
              <p className='text-lg font-semibold'>{p.profileName}</p>
              {p.description && <p className='text-sm text-gray-500'>{p.description}</p>}
            </div>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(p);
                }}
              >
                적용하기
              </Button>

              <Button
                variant='outline'
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(p);
                }}
              >
                수정
              </Button>

              <Button
                variant='default'
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(p.profileId);
                }}
              >
                삭제
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
