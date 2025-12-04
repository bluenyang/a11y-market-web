import axiosInstance from '@/api/axios-instance';

export const authApi = {
  login: (email, password) => {
    return axiosInstance.post('/v1/auth/login', { email, password });
  },

  logout: () => {
    return axiosInstance.post('/v1/auth/logout');
  },

  join: (data) => {
    return axiosInstance.post('/v1/auth/join', data);
  },

  kakaoJoin: (data, accessToken) => {
    return axiosInstance.post('/v1/auth/kakao-join', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getUserInfo: (accessToken) => {
    return axiosInstance.get('/v1/auth/me/info', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  checkEmailExists: (email) => {
    return axiosInstance.get('/v1/auth/check/email', {
      params: { email },
    });
  },

  checkNicknameExists: (nickname) => {
    return axiosInstance.get('/v1/auth/check/nickname', {
      params: { nickname },
    });
  },

  checkPhoneExists: (phone) => {
    return axiosInstance.get('/v1/auth/check/phone', {
      params: { phone },
    });
  },
};
