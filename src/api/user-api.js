import axiosInstance from '@/api/axios-instance';

export const userApi = {
  getProfile: async () => {
    try {
      const resp = await axiosInstance.get('/v1/users/me');

      if (resp.status !== 200) {
        throw new Error('프로필 조회에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during getProfile:', err);
      return Promise.reject(err);
    }
  },

  updateProfile: async (data) => {
    try {
      const resp = await axiosInstance.patch('/v1/users/me', data);

      if (resp.status !== 200) {
        throw new Error('프로필 업데이트에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during updateProfile:', err);
      return Promise.reject(err);
    }
  },

  withdrawAccount: async (password) =>
    await axiosInstance.delete('/v1/users/me', {
      data: {
        userPassword: password,
      },
    }),
};
