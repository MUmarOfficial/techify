import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMyCourses } from '../../services/enrollmentService';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/shared/EmptyState';
import { ROUTES } from '../../constants';
import type { Enrollment } from '../../types';
import { getSkeletonArray } from '@/utils/array';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCourses()
      .then(setEnrollments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-10 border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Learning</p>
        <h1 className="font-heading text-4xl text-charcoal">My Courses</h1>
      </div>

      {(() => {
        if (loading) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {getSkeletonArray(6).map((id) => (
                <div key={id} className="space-y-4">
                  <Skeleton variant="rect" className="h-40" />
                  <Skeleton variant="text" className="w-2/3 h-4" />
                  <Skeleton variant="text" className="h-2" />
                </div>
              ))}
            </div>
          );
        }

        if (enrollments.length === 0) {
          return (
            <EmptyState
              title="No enrollments yet"
              message="Browse our catalog and enroll in a course to start learning."
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {enrollments.map((enrollment, i) => {
              const course = typeof enrollment.course === 'object' ? enrollment.course : null;
              if (!course) return null;
              const isComplete = enrollment.progress === 100;
              return (
                <motion.div
                  key={enrollment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="border border-charcoal/10 hover:border-gold/30 transition-colors duration-300"
                >
                  {course.thumbnail && (
                    <Link to={ROUTES.DASHBOARD.STUDENT.WATCH(course._id)}>
                      <img
                        src={course.thumbnail.startsWith('data:') ? course.thumbnail : `${course.thumbnail}?w=600&h=250&fit=crop`}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                    </Link>
                  )}
                  <div className="p-6">
                    <Badge variant={isComplete ? 'gold' : 'muted'} className="mb-3">
                      {isComplete ? 'Completed' : 'In Progress'}
                    </Badge>
                    <Link to={ROUTES.DASHBOARD.STUDENT.WATCH(course._id)}>
                      <h3 className="font-heading text-xl text-charcoal mb-1 hover:text-gold transition-colors duration-300">
                        {course.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-warm-grey mb-4 uppercase tracking-widest">{course.category}</p>
                    <ProgressBar value={enrollment.progress} />
                    
                    <Link 
                      to={ROUTES.DASHBOARD.STUDENT.WATCH(course._id)}
                      className="mt-6 w-full h-10 border border-charcoal text-charcoal text-label flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors duration-300"
                    >
                      {enrollment.progress === 0 ? 'Start Learning' : 'Continue Watching'}
                    </Link>
                  </div>

                </motion.div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}
