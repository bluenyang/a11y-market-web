import axiosInstance from '@/api/axios-instance';

export const a11yApi = {
  getA11yProfiles: async () => await axiosInstance.get(`/v1/users/me/a11y/profiles`),

  createA11yProfile: async (data) => await axiosInstance.post(`/v1/users/me/a11y/profiles`, data),

  updateA11yProfile: async (profileId, data) =>
    await axiosInstance.put(`/v1/users/me/a11y/profiles/${profileId}`, data),

  deleteA11yProfile: async (profileId) =>
    await axiosInstance.delete(`/v1/users/me/a11y/profiles/${profileId}`),
};
