import axiosInstance from './axiosInstance';

export const authApi = {
  login: (email, password) => {
    return axiosInstance.post('/v1/auth/login', { email, password });
  },

  logout: () => {
    return axiosInstance.post('/v1/auth/logout');
  },
};
