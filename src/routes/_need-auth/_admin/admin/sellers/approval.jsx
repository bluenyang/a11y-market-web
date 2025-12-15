import { adminApi } from '@/api/admin-api';
import { LoadingEmpty } from '@/components/main/loading-empty';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { createFileRoute } from '@tanstack/react-router';
import { CircleCheck, CircleX, Search, UserRoundSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_need-auth/_admin/admin/sellers/approval')({
  component: RouteComponent,
});

function RouteComponent() {
  // 임시 더미 데이터
  const [sellerData, setSellerData] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [processedSellers, setProcessedSellers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { status, data } = await adminApi.getPendingSellers();

        if (status !== 200) {
          throw new Error('판매자 목록을 불러오지 못했습니다.');
        }

        setSellerData(data);
        setSellers(data);
      } catch (err) {
        console.error('판매자 목록 조회 실패:', err);
        toast.error('판매자 목록 조회 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 승인 핸들러
  const handleApprove = async (id) => {
    try {
      const resp = await adminApi.updateSellerStatus(id, 'APPROVED');

      if (resp.status === 204) {
        setProcessedSellers((prev) => ({ ...prev, [id]: 'APPROVED' }));
      } else {
        throw new Error('Failed to approve seller');
      }
    } catch (err) {
      console.error('Error approving seller:', err);
      toast.error('판매자 승인 중 오류가 발생했습니다.');
    }
  };

  // 거절 핸들러
  const handleReject = async (id) => {
    try {
      const resp = await adminApi.updateSellerStatus(id, 'REJECTED');

      if (resp.status === 204) {
        setProcessedSellers((prev) => ({ ...prev, [id]: 'REJECTED' }));
      } else {
        throw new Error('Failed to reject seller');
      }
    } catch (err) {
      console.error('Error rejecting seller:', err);
      toast.error('판매자 거절 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return <LoadingEmpty />;
  }

  return (
    <main className='font-kakao-big mx-auto max-w-6xl px-4 py-8'>
      <section className='mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>판매자 등록 신청 관리</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            판매자 계정 신청을 검토하고 승인/거절할 수 있습니다.
          </p>
        </div>
      </section>

      <section className='mb-4 flex max-w-6xl items-center justify-center'>
        <div className='relative mb-6 w-full'>
          <Search
            className='absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-400'
            aria-hidden='true'
          />
          <Input
            type='search'
            placeholder='판매자명, 이메일로 검색'
            className='pl-10'
            onChange={(e) => {
              const query = e.target.value.toLowerCase();

              setSellers(
                sellerData.filter(
                  (seller) =>
                    seller.sellerName.toLowerCase().includes(query) ||
                    seller.businessNumber.toLowerCase().includes(query),
                ),
              );
            }}
          />
        </div>
      </section>

      <section className='border-muted-foreground/20 bg-card mb-8 flex flex-col gap-4 rounded-2xl border p-4'>
        {sellers.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <UserRoundSearch />
              </EmptyMedia>
              <EmptyTitle>현재 승인 대기중인 판매자가 없습니다</EmptyTitle>
              <EmptyDescription>
                아직 승인 대기중인 판매자 신청이 없습니다. 새로운 신청이 들어오면 여기에서 확인할 수
                있습니다.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {sellers.length > 0 && (
          <>
            {sellers.map((seller) => {
              const status = processedSellers[seller.sellerId];

              return (
                <Item
                  key={seller.sellerId}
                  variant='outline'
                >
                  <ItemContent>
                    <ItemTitle className='text-lg font-bold'>
                      {seller.sellerName}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='outline'
                            className='rounded-full px-2 py-0 text-xs'
                            aria-label='판매자 신청 정보 보기 버튼'
                          >
                            신청 정보 보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className='mb-4 text-lg font-bold'>
                              {`${seller.sellerName}님의 판매자 신청 정보`}
                            </DialogTitle>
                            <DialogDescription className='flex flex-col space-y-2'>
                              {`아래는 ${seller.sellerName}님이 제출한 판매자 신청 정보입니다.`}
                            </DialogDescription>
                          </DialogHeader>
                          <div className='mt-4 flex flex-col space-y-2'>
                            <span>
                              <strong>판매자 상호명:</strong> {seller.sellerName}
                            </span>
                            <span>
                              <strong>이름:</strong> {seller.sellerName}
                            </span>
                            <span>
                              <strong>이메일:</strong> {seller.userEmail}
                            </span>
                            <span>
                              <strong>전화번호:</strong> {seller.userPhone}
                            </span>
                            <span>
                              <strong>사업자등록번호:</strong> {seller.businessNumber}
                            </span>
                            <span>
                              <strong>판매자 소개:</strong> {seller.sellerIntro}
                            </span>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                variant='default'
                                className='bg-primary hover:bg-primary/80'
                                aria-label='판매자 신청 승인 버튼'
                                onClick={() => {
                                  handleApprove(seller.sellerId);
                                }}
                              >
                                승인
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                variant='outline'
                                className='text-destructive border-destructive hover:bg-destructive/50 hover:text-white'
                                aria-label='판매자 신청 거절 버튼'
                                onClick={() => {
                                  handleReject(seller.sellerId);
                                }}
                              >
                                거절
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                variant='outline'
                                aria-label='판매자 신청 정보 닫기 버튼'
                              >
                                닫기
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </ItemTitle>
                    <ItemDescription className='text-primary flex flex-col space-y-1'>
                      <span>
                        <strong>사업자등록번호:</strong> {seller.businessNumber}
                      </span>
                      <span>
                        <strong>판매자 소개:</strong> {seller.sellerIntro}
                      </span>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {status && (
                      <span className='px-4 py-2 font-medium'>
                        {status === 'APPROVED' ? (
                          <span className='text-green-600'>
                            <CircleCheck
                              className='mr-1 inline-block size-4'
                              aria-hidden='true'
                            />
                            승인됨
                          </span>
                        ) : (
                          <span className='text-red-600'>
                            <CircleX
                              className='mr-1 inline-block size-4'
                              aria-hidden='true'
                            />
                            거절됨
                          </span>
                        )}
                      </span>
                    )}
                    {!status && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant='default'
                              className='bg-primary hover:bg-primary/80'
                              aria-label='판매자 신청 승인 버튼'
                            >
                              승인
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>판매자 신청을 승인하시겠습니까?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {`승인 시 ${seller.sellerName}님은 판매자 계정으로 전환됩니다.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel aria-label='판매자 신청 승인 취소 버튼'>
                                취소
                              </AlertDialogCancel>
                              <AlertDialogAction
                                aria-label='판매자 신청 승인 확인 버튼'
                                className='bg-blue-500 text-white hover:bg-blue-600'
                                onClick={() => handleApprove(seller.sellerId)}
                              >
                                계속
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant='outline'
                              className='text-destructive border-destructive hover:bg-destructive/50 hover:text-white'
                              aria-label='판매자 신청 거절 버튼'
                            >
                              거절
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>판매자 신청을 거절하시겠습니까?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {`거절 시 ${seller.sellerName}님의 판매자 계정 전환이 취소됩니다.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel aria-label='판매자 신청 거절 취소 버튼'>
                                취소
                              </AlertDialogCancel>
                              <AlertDialogAction
                                aria-label='판매자 신청 거절 확인 버튼'
                                className='bg-destructive hover:bg-destructive/90 text-white'
                                onClick={() => handleReject(seller.sellerId)}
                              >
                                계속
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </ItemActions>
                </Item>
              );
            })}
          </>
        )}
      </section>
    </main>
  );
}
