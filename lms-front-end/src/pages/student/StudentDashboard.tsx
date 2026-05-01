import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { getStudentStats } from '../../services/statService';
import { getMyCourses } from '../../services/enrollmentService';
import StatCard from '../../components/shared/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/shared/EmptyState';
import { useAuth } from '../../context/useAuth';
import { ROUTES } from '../../constants';
import type { StudentStats } from '../../services/statService';
import type { Enrollment } from '../../types';
import { getSkeletonArray } from '@/utils/array';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStudentStats().then(setStats),
      getMyCourses().then((data) => setEnrollments(data.slice(0, 4))),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statItems = stats
    ? [
      { label: 'Enrolled Courses', value: stats.enrolledCourses },
      { label: 'Completed', value: stats.completedCourses },
      { label: 'In Progress', value: stats.inProgressCourses },
    ]
    : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-12 border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Student Overview</p>
        <h1 className="font-heading text-4xl md:text-5xl text-charcoal">
          Welcome back, <em className="not-italic">{user?.name?.split(' ')[0]}</em>
        </h1>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {getSkeletonArray(3).map((id) => (
            <div key={id} className="border-t border-charcoal/15 pt-6 space-y-3">
              <Skeleton variant="text" className="w-1/2 h-3" />
              <Skeleton variant="text" className="w-1/3 h-10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {statItems.map((s, i) => (
            <StatCard key={s.label} label={s.label} value={s.value} index={i} />
          ))}
        </div>
      )}

      {/* Recent Courses */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl text-charcoal">My Learning</h2>
          <Link
            to={ROUTES.DASHBOARD.STUDENT.MY_COURSES}
            className="flex items-center gap-1.5 text-label text-warm-grey hover:text-gold transition-colors duration-300"
          >
            View all <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        </div>

        {(() => {
          if (loading) {
            return (
              <div className="space-y-4">
                {['sk4', 'sk5', 'sk6'].map((id) => (
                  <Skeleton key={id} variant="rect" className="h-24" />
                ))}
              </div>
            );
          }

          if (enrollments.length === 0) {
            return (
              <EmptyState
                title="No courses yet"
                message="Start your learning journey by enrolling in a course."
                action={
                  <Link
                    to={ROUTES.COURSES}
                    className="inline-flex items-center h-10 px-6 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-300"
                  >
                    Browse Courses
                  </Link>
                }
              />
            );
          }

          return (
            <div className="space-y-4">
              {enrollments.map((enrollment, i) => {
                const course = typeof enrollment.course === 'object' ? enrollment.course : null;
                if (!course) return null;
                let Icon = BookOpen;
                if (enrollment.progress === 100) {
                  Icon = CheckCircle2;
                } else if (enrollment.progress > 0) {
                  Icon = Clock;
                }

                return (
                  <motion.div
                    key={enrollment._id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-center gap-6 p-6 border border-charcoal/10 hover:border-gold/30 transition-colors duration-300"
                  >
                    <div className="w-10 h-10 bg-taupe/50 flex items-center justify-center shrink-0">
                      <Icon size={16} strokeWidth={1.5} className="text-warm-grey" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate mb-2">{course.title}</p>
                      <ProgressBar value={enrollment.progress} showLabel={false} size="sm" />
                    </div>
                    <span className="text-xs text-warm-grey shrink-0">{Math.round(enrollment.progress)}%</span>
                  </motion.div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
