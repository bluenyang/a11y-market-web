import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';
import { userApi } from './index';
import { userKeys } from './keys';

export const useGetProfile = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => await userApi.getProfile(),

    // accessToken이 있을 때만 쿼리 실행
    enabled: !!accessToken,
    // 10분
    staleTime: 1000 * 60 * 10,
    // 실패 시 재시도 하지 않음
    retry: false,
  });
};
