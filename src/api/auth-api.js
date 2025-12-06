import axiosInstance from '@/api/axios-instance';

export const authApi = {
  login: async (email, password) => await axiosInstance.post('/v1/auth/login', { email, password }),

  logout: async () => await axiosInstance.post('/v1/auth/logout'),

  join: async (data) => await axiosInstance.post('/v1/auth/join', data),

  kakaoJoin: async (data, accessToken) =>
    await axiosInstance.post('/v1/auth/kakao-join', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  getUserInfo: async (accessToken) =>
    await axiosInstance.get('/v1/auth/me/info', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  checkEmailExists: async (email) =>
    await axiosInstance.get('/v1/auth/check/email', {
      params: { email },
    }),

  checkNicknameExists: async (nickname) =>
    await axiosInstance.get('/v1/auth/check/nickname', {
      params: { nickname },
    }),

  checkPhoneExists: async (phone) =>
    await axiosInstance.get('/v1/auth/check/phone', {
      params: { phone },
    }),
};
