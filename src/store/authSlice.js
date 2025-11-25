import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: !!localStorage.getItem('refreshToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;

      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      localStorage.removeItem('refreshToken');
    },
    // Update access token
    tokenRefresh: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.isLoading = false;
    },
    initFailure: (state) => {
      state.isLoading = false;
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { loginSuccess, logout, tokenRefresh, initFailure } = authSlice.actions;
export default authSlice.reducer;
