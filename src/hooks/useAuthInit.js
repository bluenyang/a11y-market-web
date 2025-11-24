import { initFailure, loginSuccess } from '@/store/authSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useAuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        dispatch(initFailure());
        return;
      }

      try {
        const resp = await axios.post(`${API_BASE_URL}/api/v1/auth/login-refresh`, {
          refreshToken: refreshToken,
        });

        const { user, accessToken, refreshToken: newRefreshToken } = resp.data;

        dispatch(
          loginSuccess({
            user,
            accessToken,
            refreshToken: newRefreshToken,
          }),
        );
      } catch (err) {
        console.error('Auth initialization failed:', err);
        dispatch(initFailure());
      }
    };

    initAuth();
  }, [dispatch]);
}
