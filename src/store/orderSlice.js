import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderItems: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderItems: (state, action) => {
      console.log('Setting order items:', action.payload);
      state.orderItems = action.payload;
    },
    clearOrderItems: (state) => {
      state.orderItems = [];
    },
  },
});

export const { setOrderItems, clearOrderItems } = orderSlice.actions;
export default orderSlice.reducer;
