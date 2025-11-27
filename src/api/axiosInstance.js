import { logout, tokenRefresh } from '@/store/authSlice';
import { store } from '@/store/store';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    // const token = null; // 임시로 토큰을 가져오는 부분을 비워둠

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  (resp) => {
    return resp;
  },
  async (err) => {
    const originalRequest = err.config;
    if (err.response) {
      // 401 Unauthorized 공통 처리 예시
      if (err.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');

          if (!refreshToken) {
            store.dispatch(logout());
            return Promise.reject(err);
          }

          const resp = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refreshToken: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = resp.data;

          store.dispatch(
            tokenRefresh({
              accessToken: accessToken,
              refreshToken: newRefreshToken,
            }),
          );

          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          store.dispatch(logout());
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
          return Promise.reject(err);
        }
      }
      // ... 다른 상태 코드에 대한 공통 처리 추가 가능
      return Promise.reject(err.response.data);
    }
    return Promise.reject(err);
  },
);

export default axiosInstance;
