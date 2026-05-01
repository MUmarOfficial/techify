import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, BookOpen, ArrowRight } from 'lucide-react';
import { getInstructorStats } from '../../services/statService';
import { getMyCourses } from '../../services/courseService';
import StatCard from '../../components/shared/StatCard';
import Skeleton from '../../components/ui/Skeleton';
import { useAuth } from '../../context/useAuth';
import { ROUTES } from '../../constants';
import type { InstructorStats } from '../../services/statService';
import type { Course } from '../../types';
import { getSkeletonArray } from '@/utils/array';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getInstructorStats().then(setStats),
      getMyCourses().then((data) => setCourses(data.slice(0, 5))),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-12 border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Instructor Overview</p>
        <h1 className="font-heading text-4xl md:text-5xl text-charcoal">
          Studio, <em className="not-italic">{user?.name?.split(' ')[0]}</em>
        </h1>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 gap-8 mb-16">
          {getSkeletonArray(2).map((id) => (
            <div key={id} className="border-t border-charcoal/15 pt-6 space-y-3">
              <Skeleton variant="text" className="w-1/2 h-3" />
              <Skeleton variant="text" className="w-1/3 h-10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8 mb-16">
          <StatCard label="Total Courses" value={stats?.totalCourses ?? 0} index={0} />
          <StatCard label="Total Students" value={stats?.totalStudents ?? 0} index={1} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        <Link
          to={ROUTES.DASHBOARD.INSTRUCTOR.CREATE_COURSE}
          className="flex items-center gap-4 p-6 border border-charcoal/15 hover:border-gold/40 transition-colors duration-300 group"
        >
          <div className="w-10 h-10 bg-charcoal flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
            <Plus size={16} strokeWidth={1.5} className="text-white group-hover:text-charcoal" />
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">Create Course</p>
            <p className="text-xs text-warm-grey">Publish a new course</p>
          </div>
        </Link>
        <Link
          to={ROUTES.DASHBOARD.INSTRUCTOR.COURSES}
          className="flex items-center gap-4 p-6 border border-charcoal/15 hover:border-gold/40 transition-colors duration-300 group"
        >
          <div className="w-10 h-10 bg-taupe/50 flex items-center justify-center group-hover:bg-charcoal transition-colors duration-500">
            <BookOpen size={16} strokeWidth={1.5} className="text-warm-grey group-hover:text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal">Manage Courses</p>
            <p className="text-xs text-warm-grey">Edit, update, or delete</p>
          </div>
        </Link>
      </div>

      {/* Recent Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl text-charcoal">My Courses</h2>
          <Link
            to={ROUTES.DASHBOARD.INSTRUCTOR.COURSES}
            className="flex items-center gap-1.5 text-label text-warm-grey hover:text-gold transition-colors duration-300"
          >
            View all <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="space-y-3">
          {loading
            ? ['sk-c1', 'sk-c2', 'sk-c3'].map((id) => <Skeleton key={id} variant="rect" className="h-20" />)
            : courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center justify-between p-5 border border-charcoal/10 hover:border-gold/30 transition-colors duration-300"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{course.title}</p>
                  <p className="text-xs text-warm-grey mt-0.5">{course.category}</p>
                </div>
                <Link
                  to={ROUTES.DASHBOARD.INSTRUCTOR.LESSONS(course._id)}
                  className="text-label text-warm-grey hover:text-gold transition-colors duration-300 shrink-0 ml-6"
                >
                  Lessons →
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
