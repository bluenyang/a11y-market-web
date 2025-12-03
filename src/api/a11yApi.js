// src/api/a11yAPI.js

import axiosInstance from './axiosInstance';

//접근성 프로필 목록 조회
export async function getA11yProfiles() {
  const res = await axiosInstance.get(`/v1/users/me/a11y/profiles`);
  return res.data;
}

//접근성 프로필 생성
export async function createA11yProfile(data) {
  const res = await axiosInstance.post(`/v1/users/me/a11y/profiles`, data);
  return res.data;
}

//접근성 프로필 수정
export async function updateA11yProfile(profileId, data) {
  await axiosInstance.put(`/v1/users/me/a11y/profiles/${profileId}`, data);
}

//접근성 프로필 삭제
export async function deleteA11yProfile(profileId) {
  await axiosInstance.delete(`/v1/users/me/a11y/profiles/${profileId}`);
}
