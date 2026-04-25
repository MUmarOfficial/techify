import api from './api';
import type { Category } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<{ success: boolean; categories: Category[] }>('/categories');
  return data.categories;
};

export const createCategory = async (name: string): Promise<Category> => {
  const { data } = await api.post<{ success: boolean; category: Category }>('/categories', { name });
  return data.category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
