import api from './api';
import type { User, ApiResponse } from '../types';

export const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get<ApiResponse<User[]>>('/users');
  return res.data.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get<ApiResponse<User>>(`/users/${id}`);
  return res.data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const updateUserRole = async (id: string, role: 'student' | 'instructor' | 'admin'): Promise<User> => {
  const res = await api.patch<ApiResponse<User>>(`/users/${id}/role`, { role });
  return res.data.data;
};
