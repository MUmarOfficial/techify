import api from './api';
import type { LoginPayload, RegisterPayload, User, ApiResponse } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  await api.patch('/auth/change-password', { currentPassword, newPassword });
};

export const updateProfile = async (payload: {
  name?: string;
  email?: string;
  avatar?: string;
}): Promise<User> => {
  const res = await api.patch<ApiResponse<User> & { user: User }>('/auth/profile', payload);
  // backend returns { success, message, user }
  return (res.data as unknown as { user: User }).user;
};

