import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';

export default function A11yProfileList({ profiles, onApply, onEdit, onDelete }) {
  if (!profiles || profiles.length === 0) {
    return <p className='text-slate-500'>저장된 프로필이 없습니다.</p>;
  }
  return (
    <div className='space-y-3'>
      {profiles.map((p) => (
        <Item
          key={p.profileId}
          variant='outline'
          className='rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md'
        >
          <ItemContent className='space-y-1'>
            <ItemTitle >{p.profileName}</ItemTitle>

            {p.description && (
              <ItemDescription className=' text-slate-600'>{p.description}</ItemDescription>
            )}
          </ItemContent>
          <ItemActions className='flex gap-2'>
            <Button
              variant='default'
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                onApply(p);
              }}
            >
              적용하기
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                onEdit(p);
              }}
            >
              수정
            </Button>

            <Button
              variant='default'
              size='sm'
              className='bg-red-600 text-white hover:bg-red-700'
              onClick={(e) => {
                e.stopPropagation();
                onDelete(p.profileId);
              }}
            >
              삭제
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}
