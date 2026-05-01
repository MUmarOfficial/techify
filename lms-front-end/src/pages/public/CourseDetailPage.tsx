import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, Lock, DollarSign, User, Tag } from 'lucide-react';
import { getCourseById } from '../../services/courseService';
import { getLessonsByCourse, getCourseLessonsPreview } from '../../services/lessonService';
import { enrollCourse, getMyCourses } from '../../services/enrollmentService';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import type { Course, Lesson, Enrollment } from '../../types';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);

        // If authenticated student, check for enrollment
        if (isAuthenticated && user?.role === 'student') {
          const enrollments = await getMyCourses();
          const found = enrollments.find((e) => {
            const c = e.course;
            return typeof c === 'object' ? c._id === id : c === id;
          });

          if (found) {
            setEnrollment(found);
            if (found.paymentStatus === 'completed') {
              const lessonData = await getLessonsByCourse(id);
              setLessons(lessonData);
            } else {
              const previewLessons = await getCourseLessonsPreview(id);
              setLessons(previewLessons);
            }
          } else {
            // Not enrolled - show preview
            const previewLessons = await getCourseLessonsPreview(id);
            setLessons(previewLessons);
          }
        } else {
          // Unauthenticated - show preview
          const previewLessons = await getCourseLessonsPreview(id);
          setLessons(previewLessons);
        }
      } catch (err) {
        console.error('Failed to fetch course details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!id) return;

    if (enrollment?.paymentStatus === 'pending') {
      return navigate(`/checkout/${enrollment._id}`);
    }

    setEnrolling(true);
    try {
      const newEnrollment = await enrollCourse(id);
      navigate(`/checkout/${newEnrollment._id}`);
    } catch {
      addToast('error', 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <CourseDetailSkeleton />;
  if (!course) return <CourseNotFound />;

  const instructor = course.instructor && typeof course.instructor === 'object' ? course.instructor : null;

  return (
    <div className="bg-alabaster min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={`${course.thumbnail}?w=1600&h=600&fit=crop`}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-taupe/30" />
        )}
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16 max-w-400 mx-auto">
          <Badge variant="muted">{course.category}</Badge>
        </div>
      </div>

      <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-label text-warm-grey hover:text-charcoal transition-colors duration-300 mb-10 cursor-pointer"
        >
          <ArrowLeft size={14} strokeWidth={1.5} /> All Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Main Content */}
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-3xl md:text-5xl text-charcoal leading-tight mb-6"
            >
              {course.title}
            </motion.h1>

            <p className="text-base text-warm-grey leading-relaxed mb-10 drop-cap">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-6 mb-12 border-t border-charcoal/10 pt-8">
              {instructor && (
                <div className="flex items-center gap-2">
                  <User size={14} strokeWidth={1.5} className="text-gold" />
                  <span className="text-sm text-charcoal">{instructor.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag size={14} strokeWidth={1.5} className="text-gold" />
                <span className="text-sm text-charcoal">{course.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={14} strokeWidth={1.5} className="text-gold" />
                <span className="text-sm text-charcoal">{lessons.length} lessons</span>
              </div>
            </div>

            {enrollment?.paymentStatus === 'completed' && (
              <div className="space-y-12">
                <ProgressBar value={enrollment.progress} />
                {lessons.length > 0 ? (
                  <div>
                    <h2 className="font-heading text-2xl text-charcoal mb-6">Course Lessons</h2>
                    <ul className="space-y-2">
                      {lessons.map((lesson, i) => (
                        <LessonItem key={lesson._id} lesson={lesson} index={i} isPreview={false} />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="border border-charcoal/10 p-8 text-center italic text-warm-grey">
                    No lessons published yet
                  </div>
                )}
              </div>
            )}

            {enrollment?.paymentStatus !== 'completed' && lessons.length > 0 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-2xl text-charcoal mb-6">Course Curriculum Preview</h2>
                  <p className="text-sm text-warm-grey mb-4">Get a preview of what you'll learn. Sign in to access full lessons.</p>
                  <ul className="space-y-2">
                    {lessons.map((lesson, i) => (
                      <LessonItem key={lesson._id} lesson={lesson} index={i} isPreview={true} />
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {enrollment?.paymentStatus !== 'completed' && lessons.length === 0 && (
              <div className="border border-charcoal/10 p-8 text-center">
                <Lock size={24} strokeWidth={1} className="text-warm-grey mx-auto mb-3" />
                <p className="text-sm text-warm-grey">Enroll and complete payment to access all lessons</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <EnrollmentCard
                course={course}
                enrollment={enrollment}
                onEnroll={handleEnroll}
                enrolling={enrolling}
                isAuthenticated={isAuthenticated}
                userRole={user?.role}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────

function LessonItem({ lesson, index, isPreview }: Readonly<{ lesson: Lesson; index: number; isPreview?: boolean }>) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex items-center gap-4 p-5 border border-charcoal/10 hover:border-gold/30 transition-colors duration-300"
    >
      <span className="font-heading text-lg text-warm-grey/40 w-6 shrink-0">
        {String(lesson.order).padStart(2, '0')}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal">{lesson.title}</p>
      </div>
      {isPreview ? (
        <Lock size={16} strokeWidth={1.5} className="text-warm-grey/40 shrink-0" />
      ) : (
        <CheckCircle size={16} strokeWidth={1.5} className="text-gold shrink-0" />
      )}
    </motion.li>
  );
}

function EnrollmentCard({
  course,
  enrollment,
  onEnroll,
  enrolling,
  isAuthenticated,
  userRole,
}: Readonly<{
  course: Course;
  enrollment: Enrollment | null;
  onEnroll: () => void;
  enrolling: boolean;
  isAuthenticated: boolean;
  userRole?: string;
}>) {
  const buttonText = (() => {
    if (enrolling) return 'Processing...';
    if (!isAuthenticated) return 'Sign in to Enroll';
    if (userRole !== 'student') return 'Students Only';
    if (enrollment?.paymentStatus === 'pending') return 'Complete Payment';
    return 'Enroll Now';
  })();

  return (
    <div className="border border-charcoal/15 p-8 shadow-card bg-white">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign size={20} strokeWidth={1} className="text-gold" />
        <span className="font-heading text-4xl text-charcoal">
          {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
        </span>
      </div>

      {enrollment?.paymentStatus === 'completed' ? (
        <div className="space-y-4">
          <div className="bg-taupe/40 px-5 py-3 text-center">
            <p className="text-label text-charcoal">You're enrolled</p>
          </div>
          <ProgressBar value={enrollment.progress} />
        </div>
      ) : (
        <button
          onClick={onEnroll}
          disabled={enrolling || (userRole !== 'student' && isAuthenticated)}
          className="w-full h-12 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {buttonText}
        </button>
      )}

      {!isAuthenticated && (
        <p className="text-xs text-warm-grey text-center mt-4">
          <Link to="/register" className="text-gold hover:underline">Create a free account</Link> to get started
        </p>
      )}
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16 py-16">
      <Skeleton variant="rect" className="h-80 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton variant="text" className="w-1/3 h-3" />
          <Skeleton variant="text" className="h-10 w-3/4" />
          <Skeleton variant="text" className="h-4" />
          <Skeleton variant="text" className="h-4 w-5/6" />
        </div>
        <div className="space-y-4">
          <Skeleton variant="rect" className="h-48" />
        </div>
      </div>
    </div>
  );
}

function CourseNotFound() {
  return (
    <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16 py-32 text-center">
      <p className="font-heading text-3xl text-charcoal mb-4">Course not found</p>
      <Link to="/courses" className="text-label text-gold">← Back to courses</Link>
    </div>
  );
}
