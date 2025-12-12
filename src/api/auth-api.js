import axiosInstance from '@/api/axios-instance';

export const authApi = {
  login: async (email, password) => {
    try {
      const resp = await axiosInstance.post('/v1/auth/login', { email, password });

      if (resp.status !== 200) {
        throw new Error('로그인에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during login:', err);
      return Promise.reject(err);
    }
  },

  logout: async () => {
    try {
      const resp = await axiosInstance.post('/v1/auth/logout');

      if (resp.status !== 200) {
        throw new Error('로그아웃에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during logout:', err);
      return Promise.reject(err);
    }
  },

  join: async (data) => {
    try {
      const resp = await axiosInstance.post('/v1/auth/join', data);

      if (resp.status !== 201) {
        throw new Error('회원가입에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during join:', err);
      return Promise.reject(err);
    }
  },

  kakaoJoin: async (data, accessToken) => {
    try {
      const resp = await axiosInstance.post('/v1/auth/kakao-join', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (resp.status !== 201) {
        throw new Error('카카오 회원가입에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during kakaoJoin:', err);
      return Promise.reject(err);
    }
  },

  getUserInfo: async (accessToken) => {
    try {
      const resp = await axiosInstance.get('/v1/auth/me/info', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (resp.status !== 200) {
        throw new Error('사용자 정보 조회에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during getUserInfo:', err);
      return Promise.reject(err);
    }
  },

  checkEmailExists: async (email) => {
    try {
      const resp = await axiosInstance.get('/v1/auth/check/email', {
        params: { email },
      });

      if (resp.status !== 200) {
        throw new Error('이메일 중복 확인에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during checkEmailExists:', err);
      return Promise.reject(err);
    }
  },

  checkNicknameExists: async (nickname) => {
    try {
      const resp = await axiosInstance.get('/v1/auth/check/nickname', {
        params: { nickname },
      });

      if (resp.status !== 200) {
        throw new Error('닉네임 중복 확인에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during checkNicknameExists:', err);
      return Promise.reject(err);
    }
  },

  checkPhoneExists: async (phone) => {
    try {
      const resp = await axiosInstance.get('/v1/auth/check/phone', {
        params: { phone },
      });

      if (resp.status !== 200) {
        throw new Error('전화번호 중복 확인에 실패했습니다.');
      }

      return resp;
    } catch (err) {
      console.error('Error during checkPhoneExists:', err);
      return Promise.reject(err);
    }
  },
};
