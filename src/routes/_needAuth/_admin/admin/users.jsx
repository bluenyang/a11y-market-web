import { createFileRoute } from '@tanstack/react-router';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Fragment, useState, useEffect } from 'react';
import { adminApi } from '@/api/adminApi';

export const Route = createFileRoute('/_needAuth/_admin/admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await adminApi.getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error('회원 목록 정보를 불러오기데 실패했습니다.', err);
      }
    }
    fetchUsers();
  }, []);

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
              <TableHead className='text-center font-semibold'>닉네임</TableHead>
              <TableHead className='text-center font-semibold'>회원구분</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <Fragment key={user.userEmail}>
                <TableRow
                  className='cursor-pointer hover:bg-gray-100'
                  onClick={() => toggleRow(user.userEmail)}
                >
                  <TableCell className='text-center'>{user.userName}</TableCell>
                  <TableCell className='text-center'>{user.userEmail}</TableCell>
                  <TableCell className='text-center'>{user.userNickname}</TableCell>
                  <TableCell className='text-center'>{user.userRole}</TableCell>
                </TableRow>

                {expandedRows.includes(user.userEmail) && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='bg-gray-100'
                    >
                      <dl
                        id={`user-details-${user.userEmail}`}
                        role='region'
                        className='space-y-2 p-4'
                      >
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
