import api from './api';
import type { ApiResponse } from '../types';

export interface StatValue {
  value: number;
  trend: 'up' | 'down';
  change: string;
}

export interface AdminStats {
  totalUsers: StatValue;
  totalCourses: StatValue;
  totalEnrollments: StatValue;
  totalInstructors: StatValue;
  recentActivity: Array<{ id: string; action: string; time: string }>;
  enrollmentsByMonth: Array<{ label: string; value: number }>;
  categoryDistribution: Array<{ label: string; value: number }>;
}

export interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
}

export interface StudentStats {
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await api.get<ApiResponse<AdminStats>>('/stats/admin');
  return res.data.data;
};

export const getInstructorStats = async (): Promise<InstructorStats> => {
  const res = await api.get<ApiResponse<InstructorStats>>('/stats/instructor');
  return res.data.data;
};

export const getStudentStats = async (): Promise<StudentStats> => {
  const res = await api.get<ApiResponse<StudentStats>>('/stats/student');
  return res.data.data;
};
