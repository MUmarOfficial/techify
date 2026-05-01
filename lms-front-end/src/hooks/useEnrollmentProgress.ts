import { useCallback, useEffect, useState } from "react";
import {
  markLessonComplete as markLessonCompleteAPI,
  getProgress,
} from "../services/enrollmentService";

export interface LessonProgress {
  _id: string;
  title: string;
  order: number;
  isCompleted: boolean;
  watchPercentage: number;
  isCurrent: boolean;
}

export interface ProgressData {
  enrollmentId: string;
  progress: number;
  completedCount: number;
  totalLessons: number;
  lastAccessedLesson?: string;
  lessons: LessonProgress[];
}

export const useEnrollmentProgress = (enrollmentId?: string) => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch progress data from backend
  const fetchProgress = useCallback(async () => {
    if (!enrollmentId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getProgress(enrollmentId);
      setProgressData(data as unknown as ProgressData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch progress";
      setError(errorMessage);
      console.error("Failed to fetch progress:", err);
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  // Mark lesson as complete
  const markLessonComplete = async (lessonId: string) => {
    if (!enrollmentId) return;

    try {
      setError(null);
      const result = await markLessonCompleteAPI(enrollmentId, lessonId);

      // Update local state with new progress
      setProgressData((prev) => {
        if (!prev) return prev;

        // Update completedCount and progress
        const newCompletedCount = (result.completedLessons ?? []).length;
        const newProgress = Math.round(
          (newCompletedCount / prev.totalLessons) * 100,
        );

        // Update lesson status
        const updatedLessons = prev.lessons.map((lesson) =>
          lesson._id === lessonId ? { ...lesson, isCompleted: true } : lesson,
        );

        return {
          ...prev,
          progress: newProgress,
          completedCount: newCompletedCount,
          lessons: updatedLessons,
        };
      });

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to mark lesson complete";
      setError(errorMessage);
      console.error("Failed to mark lesson complete:", err);
      throw err;
    }
  };

  // Get completion status for a specific lesson
  const getLessonStatus = (lessonId: string) => {
    if (!progressData) return null;

    return progressData.lessons.find((lesson) => lesson._id === lessonId);
  };

  // Get next lesson to navigate to
  const getNextLesson = () => {
    if (!progressData) return null;

    const currentIndex = progressData.lessons.findIndex(
      (lesson) => lesson.isCurrent,
    );

    if (currentIndex >= 0 && currentIndex < progressData.lessons.length - 1) {
      return progressData.lessons[currentIndex + 1];
    }

    return null;
  };

  // Initial fetch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProgress();
  }, [fetchProgress]);

  return {
    progressData,
    loading,
    error,
    markLessonComplete,
    fetchProgress,
    getLessonStatus,
    getNextLesson,
  };
};
