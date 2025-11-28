import { createFileRoute } from '@tanstack/react-router';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Fragment, useState } from 'react';

export const Route = createFileRoute('/_needAuth/_admin/admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const [users] = useState([
    {
      userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      userName: '김철수',
      userEmail: 'chulsoo@example.com',
      userNickname: '철수짱',
      userRole: '구매자',
      createdAt: '2025-11-28T04:27:41.611Z',
      updatedAt: '2025-11-28T04:27:41.612Z',
    },
    {
      userId: '52977ab3-d12a-4aa3-93bd-421bbfd1ff90',
      userName: '이영희',
      userEmail: 'younghee@example.com',
      userNickname: '영희',
      userRole: '판매자',
      createdAt: '2025-11-20T02:15:10.000Z',
      updatedAt: '2025-11-25T09:11:00.000Z',
    },
    {
      userId: '92153bbb-a111-4b22-8f60-f86b7e91ccaa',
      userName: '홍길동',
      userEmail: 'hong@example.com',
      userNickname: '길동',
      userRole: '구매자',
      createdAt: '2025-10-12T08:00:00.000Z',
      updatedAt: '2025-11-01T13:11:22.000Z',
    },
  ]);

  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  return (
    <>
      <div className='font-kakao-big mb-6 text-center text-3xl font-semibold'>회원 관리</div>

      <h3 className='font-kakao-big my-6 text-center'>
        등록된 구매자와 판매자의 정보를 조회할 수 있습니다.
      </h3>

      <div className='max-w-8xl font-kakao-big mx-auto w-full px-4 pt-4'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='text-center font-semibold'>이름</TableHead>
              <TableHead className='text-center font-semibold'>이메일</TableHead>
              <TableHead className='text-center font-semibold'>ID</TableHead>
              <TableHead className='text-center font-semibold'>회원구분</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <Fragment key={user.userId}>
                <TableRow
                  className='cursor-pointer hover:bg-gray-100'
                  onClick={() => toggleRow(user.userId)}
                >
                  <TableCell className='text-center'>{user.userName}</TableCell>
                  <TableCell className='text-center'>{user.userEmail}</TableCell>
                  <TableCell className='text-center'>{user.userId}</TableCell>
                  <TableCell className='text-center'>{user.userRole}</TableCell>
                </TableRow>

                {expandedRows.includes(user.userId) && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='bg-gray-100'
                    >
                      <dl
                        id={`user-details-${user.userId}`}
                        role='region'
                        className='space-y-2 p-4'
                      >
                        <div className='flex gap-2'>
                          <dt className='font-semibold'>ID:</dt>
                          <dd>{user.userId}</dd>
                        </div>

                        <div className='flex gap-2'>
                          <dt className='font-semibold'>이름:</dt>
                          <dd>{user.userName}</dd>
                        </div>

                        <div className='flex gap-2'>
                          <dt className='font-semibold'>이메일:</dt>
                          <dd>{user.userEmail}</dd>
                        </div>

                        <div className='flex gap-2'>
                          <dt className='font-semibold'>닉네임:</dt>
                          <dd>{user.userNickname}</dd>
                        </div>

                        <div className='flex gap-2'>
                          <dt className='font-semibold'>회원 구분:</dt>
                          <dd>{user.userRole}</dd>
                        </div>

                        <div className='flex gap-2'>
                          <dt className='font-semibold'>가입일:</dt>
                          <dd>{new Date(user.createdAt).toLocaleString()}</dd>
                        </div>

                        <div className='flex gap-2'>
                          <dt className='font-semibold'>최근 수정일:</dt>
                          <dd>{new Date(user.updatedAt).toLocaleString()}</dd>
                        </div>
                      </dl>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
