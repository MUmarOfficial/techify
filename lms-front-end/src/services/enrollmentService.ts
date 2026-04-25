import api from './api';
import type { Enrollment, ApiResponse, ProgressUpdate, ProgressData } from '../types';

export const enrollCourse = async (courseId: string): Promise<Enrollment> => {
  const res = await api.post<ApiResponse<Enrollment>>('/enrollments', { courseId });
  return res.data.data;
};

export const getMyCourses = async (): Promise<Enrollment[]> => {
  const res = await api.get<ApiResponse<Enrollment[]>>('/enrollments/my-courses');
  return res.data.data;
};

export const updateProgress = async (id: string, progress: number): Promise<Enrollment> => {
  const res = await api.patch<ApiResponse<Enrollment>>(`/enrollments/${id}/progress`, { progress });
  return res.data.data;
};

export const getAllEnrollments = async (): Promise<Enrollment[]> => {
  const res = await api.get<ApiResponse<Enrollment[]>>('/enrollments/all');
  return res.data.data;
};

// Progress tracking endpoints
export const markLessonComplete = async (
  enrollmentId: string,
  lessonId: string,
): Promise<Enrollment> => {
  const res = await api.post<ApiResponse<Enrollment>>('/progress/complete-lesson', {
    enrollmentId,
    lessonId,
  });
  return res.data.data;
};

export const updateWatchProgress = async (
  enrollmentId: string,
  lessonId: string,
  percentage: number,
): Promise<ProgressUpdate> => {
  const res = await api.patch<ApiResponse<ProgressUpdate>>('/progress/watch-progress', {
    enrollmentId,
    lessonId,
    percentage,
  });
  return res.data.data;
};

export const getProgress = async (enrollmentId: string): Promise<ProgressData> => {
  const res = await api.get<ApiResponse<ProgressData>>(`/progress/${enrollmentId}`);
  return res.data.data;
};
