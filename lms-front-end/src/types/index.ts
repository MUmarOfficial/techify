export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: User | string;
  category: string;
  price: number;
  thumbnail?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Lesson {
  _id: string;
  title: string;
  content: string;
  videoUrl?: string;
  thumbnail?: string;
  course: string;
  order: number;
}

export interface Enrollment {
  _id: string;
  student: User | string;
  course: Course | string;
  progress: number;
  enrolledAt: string;
  createdAt?: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod?: string;
  transactionId?: string;
  completedLessons?: string[];
  lastAccessedLesson?: string;
  videoWatchProgress?: Array<{
    lessonId: string;
    percentage: number;
  }>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "student" | "instructor";
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export interface ProgressUpdate {
  unlocked: boolean;
  percentage: number;
}

export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  watchPercentage: number;
}

export interface ProgressData {
  progress: number;
  completedCount: number;
  totalLessons: number;
  lessons: LessonProgress[];
}
