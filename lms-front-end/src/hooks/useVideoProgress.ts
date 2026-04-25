import { useCallback, useEffect, useRef, useState } from 'react';
import { updateWatchProgress } from '../services/enrollmentService';

export const useVideoProgress = (enrollmentId?: string, lessonId?: string) => {
  const [watchPercentage, setWatchPercentage] = useState(0);
  const [isWatchComplete, setIsWatchComplete] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastUpdateRef = useRef(0); // Track last update to avoid too many API calls

  // Handle time update on video
  const handleTimeUpdate = async (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!videoRef.current || !enrollmentId || !lessonId) return;

    const video = e.currentTarget;
    const percentage = Math.round((video.currentTime / video.duration) * 100);
    const now = Date.now();

    // Mark as complete when video reaches 95%
    const shouldMarkComplete = percentage >= 95 && !isWatchComplete && !isUpdating && now - lastUpdateRef.current > 1000;
    if (shouldMarkComplete) {
      setIsUpdating(true);
      try {
        await updateWatchProgress(enrollmentId, lessonId, percentage);
        setIsWatchComplete(true);
      } catch (error) {
        console.error('Failed to update watch progress:', error);
      } finally {
        setIsUpdating(false);
        lastUpdateRef.current = now;
      }
      return;
    }

    // Update every 10% for regular progress
    const shouldUpdateProgress = percentage % 10 === 0 && now - lastUpdateRef.current > 5000 && !isUpdating;
    if (shouldUpdateProgress) {
      setWatchPercentage(percentage);
      setIsUpdating(true);
      try {
        await updateWatchProgress(enrollmentId, lessonId, percentage);
      } catch (error) {
        console.error('Failed to update watch progress:', error);
      } finally {
        setIsUpdating(false);
        lastUpdateRef.current = now;
      }
      return;
    }

    // Always update watch percentage in UI
    setWatchPercentage(percentage);
  };

  // Handle video ended
  const handleVideoEnded = () => {
    setWatchPercentage(100);
    setIsWatchComplete(true);
  };

  // Reset when lesson changes - use callback to wrap state updates
  const resetProgress = useCallback(() => {
    lastUpdateRef.current = 0;
    setWatchPercentage(0);
    setIsWatchComplete(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetProgress();
  }, [lessonId, resetProgress]);

  return {
    watchPercentage,
    isWatchComplete,
    videoRef,
    handleTimeUpdate,
    handleVideoEnded,
    setWatchPercentage,
  };
};
