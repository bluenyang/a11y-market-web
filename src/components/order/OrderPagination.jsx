import { Button } from '../ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function OrderPagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Card>
      <CardContent className='flex flex-wrap items-center justify-center gap-4 pt-4'>
        {/* 이전 */}
        <Button
          variant='outline'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </Button>

        {/* 페이지 번호 */}
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            onClick={() => onPageChange(page)}
            className='min-w=[40px]'
          >
            {page}
          </Button>
        ))}

        {/* 다음 */}
        <Button
          variant='outline'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </CardContent>
    </Card>
  );
}
