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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
export const Route = createFileRoute('/_needAuth/_admin/admin/users')({
  component: RouteComponent,
});

/** 선택 가능한 권한 옵션 */
const ROLE_OPTIONS = [
  { value: 'USER', label: '일반 회원' },
  { value: 'SELLER', label: '판매자' },
  { value: 'ADMIN', label: '관리자' },
];

function RouteComponent() {
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  // userId → 변경 예정 role
  const [roleDrafts, setRoleDrafts] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await adminApi.getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error('회원 목록 정보를 불러오는데 실패했습니다.', err);
      }
    }

    fetchUsers();
  }, []);

  const handleRoleSelectChange = (userId, nextRole) => {
    setRoleDrafts((prev) => ({
      ...prev,
      [userId]: nextRole,
    }));
  };

  const handleApplyRoleChange = async (user) => {
    const draftRole = roleDrafts[user.userId];

    // 변경사항이 없으면 무시
    if (!draftRole || draftRole === user.userRole) {
      return;
    }

    try {
      // TODO: 추후 관리자 권한 변경 API 연동

      // 일단은 프론트 상태만 업데이트
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === user.userId
            ? {
                ...u,
                userRole: draftRole,
                updatedAt: new Date().toISOString(),
              }
            : u,
        ),
      );
    } catch (err) {
      console.error('회원 권한 변경에 실패했습니다.', err);
    }
  };

  return (
    <>
      <div className='font-kakao-big mb-6 text-center text-3xl font-semibold'>회원 관리</div>

      <h3 className='font-kakao-big my-6 text-center'>
        등록된 구매자와 판매자의 정보를 조회하고 권한을 관리할 수 있습니다.
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
            {users.map((user) => {
              const isExpanded = expandedRows.includes(user.userEmail);
              const currentDraftRole = roleDrafts[user.userId] ?? user.userRole;

              return (
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

                  {isExpanded && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className='bg-gray-100'
                      >
                        <div
                          id={`user-details-${user.userEmail}`}
                          role='region'
                          className='space-y-3 p-4'
                        >
                          {/* 기본 정보 */}
                          <dl className='space-y-2'>
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

                          {/* 권한 관리 영역 */}
                          <div className='mt-4 rounded-xl border bg-white p-3'>
                            <div className='mb-2 text-sm font-semibold'>권한 변경</div>

                            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                              <label className='text-xs text-gray-600'>
                                변경할 권한을 선택하세요.
                              </label>

                              <Select
                                defaultValue={currentDraftRole}
                                onValueChange={(value) =>
                                  handleRoleSelectChange(user.userId, value)
                                }
                              >
                                <SelectTrigger className='h-8 w-[160px] text-xs'>
                                  <SelectValue placeholder='권한 선택' />
                                </SelectTrigger>

                                <SelectContent>
                                  {ROLE_OPTIONS.map((role) => (
                                    <SelectItem
                                      key={role.value}
                                      value={role.value}
                                    >
                                      {role.label} ({role.value})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Button
                                type='button'
                                size='sm'
                                className='h-8 px-3 text-xs'
                                onClick={() => handleApplyRoleChange(user)}
                                disabled={currentDraftRole === user.userRole}
                              >
                                권한 변경
                              </Button>
                            </div>

                            <p className='mt-2 text-[11px] text-gray-500'>
                              * 현재는 화면 내 상태만 변경하며, 추후 관리자 권한 변경 API와 연동할
                              예정입니다.
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default RouteComponent;
