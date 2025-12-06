import axiosInstance from '@/api/axios-instance';

export const cartApi = {
  getCartItems: async () => await axiosInstance.get('/v1/cart/me'),

  getCartItemNumber: async () => await axiosInstance.get('/v1/cart/me/items/count'),

  addCartItem: async (cartItemId, quantity) => {
    const resp = await axiosInstance.patch(`/v1/cart/items/${cartItemId}`, {
      quantity: quantity,
    });
    return resp.data;
  },

  deleteCartItems: async (itemIds) => {
    await axiosInstance.delete(`/v1/cart/items`, {
      data: {
        itemIds,
      },
    });
  },
};
