import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, PlayCircle, BookOpen, Clock, CheckCircle, Circle } from 'lucide-react';
import { getCourseById } from '../../services/courseService';
import { getLessonsByCourse } from '../../services/lessonService';
import { getMyCourses } from '../../services/enrollmentService';
import VideoPlayer from '../../components/ui/VideoPlayer';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants';
import { useVideoProgress } from '../../hooks/useVideoProgress';
import { useEnrollmentProgress } from '../../hooks/useEnrollmentProgress';
import type { Course, Lesson, Enrollment } from '../../types';

export default function WatchCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  // Progress tracking hooks
  const videoProgress = useVideoProgress(enrollment?._id, selectedLesson?._id);
  const enrollmentProgress = useEnrollmentProgress(enrollment?._id);

  // Helper functions to reduce ternary complexity
  const getStatusColor = (isCompleted: boolean, isActive: boolean): string => {
    if (isCompleted) return 'text-green-600';
    if (isActive) return 'text-gold';
    return 'text-warm-grey/40';
  };

  const getStatusIcon = (isActive: boolean) => {
    if (isActive) return <PlayCircle size={18} fill="currentColor" />;
    return <Circle size={18} />;
  };

  const getStatusTextColor = (isActive: boolean, isCompleted: boolean): string => {
    if (isActive) return 'text-gold';
    if (isCompleted) return 'text-green-600';
    return 'text-warm-grey';
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      try {
        const [courseData, lessonsData, enrollmentsData] = await Promise.all([
          getCourseById(courseId),
          getLessonsByCourse(courseId),
          getMyCourses(),
        ]);
        
        setCourse(courseData);
        setLessons(lessonsData);
        
        // Find enrollment for this course
        const currentEnrollment = enrollmentsData.find((e) => {
          const c = e.course as { _id?: string } | string;
          return typeof c === 'object' && c._id === courseId || c === courseId;
        });
        setEnrollment(currentEnrollment || null);
        
        // Set first lesson or last accessed lesson
        if (lessonsData.length > 0) {
          const lastAccessedId = currentEnrollment?.lastAccessedLesson;
          const lessonToShow = lastAccessedId
            ? lessonsData.find((l) => l._id === lastAccessedId) || lessonsData[0]
            : lessonsData[0];
          setSelectedLesson(lessonToShow);
        }
      } catch (err) {
        console.error('Failed to fetch course content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleCompleteLesson = async () => {
    if (!selectedLesson || !enrollment) return;

    try {
      await enrollmentProgress.markLessonComplete(selectedLesson._id);
      // Show success toast here if available
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    }
  };

  const handleNextLesson = () => {
    if (!selectedLesson || !lessons) return;

    const currentIndex = lessons.findIndex((l) => l._id === selectedLesson._id);
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
      videoProgress.setWatchPercentage(0);
    }
  };

  const getLessonCompletionStatus = (lessonId: string) => {
    return enrollmentProgress.progressData?.lessons.find((l) => l._id === lessonId);
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <Skeleton variant="rect" className="aspect-video w-full" />
          <Skeleton variant="text" className="h-8 w-1/2" />
          <Skeleton variant="text" className="h-24 w-full" />
        </div>
        <div className="w-full lg:w-80 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} variant="rect" className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="text-center py-20">
        <h2 className="font-heading text-2xl mb-4">Course not found</h2>
        <Link to={ROUTES.DASHBOARD.STUDENT.MY_COURSES} className="text-gold hover:underline">Return to My Courses</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6">
          <button 
            onClick={() => navigate(ROUTES.DASHBOARD.STUDENT.MY_COURSES)}
            className="flex items-center gap-2 text-label text-warm-grey hover:text-charcoal transition-colors mb-4"
          >
            <ChevronLeft size={16} />
            Back to Learning
          </button>
          
          <VideoPlayer 
            url={selectedLesson?.videoUrl} 
            thumbnail={selectedLesson?.thumbnail}
            videoRef={videoProgress.videoRef}
            onTimeUpdate={videoProgress.handleTimeUpdate}
            onEnded={videoProgress.handleVideoEnded}
          />
        </div>

        {/* Watch Progress Bar */}
        {videoProgress.watchPercentage > 0 && !videoProgress.isWatchComplete && (
          <div className="mb-4 p-4 bg-alabaster rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-charcoal">Watch Progress</span>
              <span className="text-sm font-bold text-gold">{videoProgress.watchPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-charcoal/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-300"
                style={{ width: `${videoProgress.watchPercentage}%` }}
              />
            </div>
            {videoProgress.watchPercentage < 95 && (
              <p className="text-xs text-warm-grey mt-2">
                Watch to 100% to unlock the Complete button
              </p>
            )}
          </div>
        )}

        {/* Complete & Next Buttons */}
        {videoProgress.isWatchComplete && (
          <div className="mb-6 flex gap-3">
            <Button
              onClick={handleCompleteLesson}
              disabled={enrollmentProgress.loading}
              className="flex-1"
            >
              {selectedLesson && getLessonCompletionStatus(selectedLesson._id)?.isCompleted
                ? '✓ Completed'
                : '✓ Mark Complete'}
            </Button>
            {lessons.length > (lessons.findIndex((l) => l._id === selectedLesson?._id) || 0) + 1 && (
              <Button
                onClick={handleNextLesson}
                variant="secondary"
                className="flex-1"
              >
                Next Lesson →
              </Button>
            )}
          </div>
        )}

        <div className="space-y-6">
          <div className="border-b border-charcoal/10 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="gold">Lesson {selectedLesson?.order}</Badge>
              <p className="text-overline text-warm-grey">Module 1</p>
            </div>
            <h1 className="font-heading text-3xl text-charcoal">{selectedLesson?.title}</h1>
          </div>

          <div>
            <h3 className="text-label text-charcoal mb-4 uppercase tracking-widest">About this lesson</h3>
            <div className="prose prose-sm max-w-none text-warm-grey leading-relaxed">
              {selectedLesson?.content.split('\n').filter(p => p.trim()).map((para) => (
                <p key={para} className="mb-4">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Lesson List */}
      <div className="w-full lg:w-96 shrink-0">
        <div className="sticky top-24 border border-charcoal/10 bg-white shadow-elevated overflow-hidden">
          <div className="p-5 border-b border-charcoal/10 bg-alabaster">
            <h3 className="font-heading text-lg text-charcoal">Course Content</h3>
            <div className="flex items-center gap-4 mt-2 text-[10px] uppercase tracking-widest text-warm-grey">
              <span className="flex items-center gap-1"><BookOpen size={10} /> {lessons.length} Lessons</span>
              <span className="flex items-center gap-1"><Clock size={10} /> 4h 30m</span>
            </div>
            {enrollmentProgress.progressData && (
              <div className="mt-3 pt-3 border-t border-charcoal/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-charcoal">Progress</span>
                  <span className="text-xs font-bold text-gold">{Math.round(enrollmentProgress.progressData.progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-300"
                    style={{ width: `${enrollmentProgress.progressData.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {lessons.map((lesson) => {
              const isActive = selectedLesson?._id === lesson._id;
              const lessonStatus = getLessonCompletionStatus(lesson._id);
              const isCompleted = lessonStatus?.isCompleted ?? false;

              return (
                <button
                  key={lesson._id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full flex items-start gap-4 p-5 text-left transition-colors border-b border-charcoal/5 last:border-0 ${
                    isActive ? 'bg-gold/5 border-l-4 border-l-gold' : 'hover:bg-charcoal/5'
                  }`}
                >
                  <div className={`mt-1 shrink-0 ${getStatusColor(isCompleted, isActive)}`}>
                    {isCompleted ? (
                      <CheckCircle size={18} fill="currentColor" />
                    ) : (
                      getStatusIcon(isActive)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-heading italic mb-0.5 ${getStatusTextColor(isActive, isCompleted)}`}>
                      Lesson {lesson.order}
                    </p>
                    <p className={`text-sm font-medium leading-tight ${isActive ? 'text-charcoal' : 'text-charcoal/70'}`}>
                      {lesson.title}
                    </p>
                    {lessonStatus && lessonStatus.watchPercentage > 0 && !isCompleted && (
                      <p className="text-xs text-warm-grey mt-1">{lessonStatus.watchPercentage}% watched</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
