// import { injectStore } from '@/api/axiosInstance';
import { configureStore } from '@reduxjs/toolkit';
import a11yReducer from './a11ySlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // 여기에 slice 리듀서들을 추가
    a11y: a11yReducer,
  },
  devTools: import.meta.env.DEV,
});

// injectStore(store);
