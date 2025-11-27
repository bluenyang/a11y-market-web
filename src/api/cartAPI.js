import axiosInstance from './axiosInstance';

export const getCartItems = async () => {
  const resp = await axiosInstance.get('/v1/cart/me');
  return resp.data;
};

export const addCartItem = async (cartItemId, quantity) => {
  const resp = await axiosInstance.patch(`/v1/cart/items/${cartItemId}`, {
    quantity: quantity,
  });
  return resp.data;
};

export const deleteCartItems = async (itemIds) => {
  await axiosInstance.delete(`/v1/cart/items`, {
    data: {
      itemIds,
    },
  });
};
