import api from "./api";
import type { Course, ApiResponse } from "../types";

export const getCourses = async (): Promise<Course[]> => {
  const res = await api.get<ApiResponse<Course[]>>("/courses");
  return res.data.data;
};

export const getMyCourses = async (): Promise<Course[]> => {
  const res = await api.get<ApiResponse<Course[]>>("/courses/my");
  return res.data.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const res = await api.get<ApiResponse<Course>>(`/courses/${id}`);
  return res.data.data;
};

export const createCourse = async (
  courseData: Partial<Course>,
): Promise<Course> => {
  const res = await api.post<ApiResponse<Course>>("/courses", courseData);
  return res.data.data;
};

export const updateCourse = async (
  id: string,
  courseData: Partial<Course>,
): Promise<Course> => {
  const res = await api.put<ApiResponse<Course>>(`/courses/${id}`, courseData);
  return res.data.data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await api.delete(`/courses/${id}`);
};
