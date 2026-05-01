import api from "./api";
import type { Lesson, ApiResponse } from "../types";

interface CreateLessonPayload {
  title: string;
  content: string;
  videoUrl?: string;
  thumbnail?: string;
  courseId: string;
  order: number;
}

export const getLessonsByCourse = async (
  courseId: string,
): Promise<Lesson[]> => {
  const res = await api.get<ApiResponse<Lesson[]>>(
    `/lessons/course/${courseId}`,
  );
  return res.data.data;
};

// Public endpoint - no auth required
export const getCourseLessonsPreview = async (
  courseId: string,
): Promise<Lesson[]> => {
  const res = await api.get<ApiResponse<Lesson[]>>(
    `/lessons/course/${courseId}/preview`,
  );
  return res.data.data;
};

export const createLesson = async (
  payload: CreateLessonPayload,
): Promise<Lesson> => {
  const res = await api.post<ApiResponse<Lesson>>("/lessons", payload);
  return res.data.data;
};

export const updateLesson = async (
  id: string,
  lessonData: Partial<Lesson>,
): Promise<Lesson> => {
  const res = await api.put<ApiResponse<Lesson>>(`/lessons/${id}`, lessonData);
  return res.data.data;
};

export const deleteLesson = async (id: string): Promise<void> => {
  await api.delete(`/lessons/${id}`);
};
