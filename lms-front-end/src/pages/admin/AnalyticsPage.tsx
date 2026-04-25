import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAdminStats } from '../../services/statService';
import { getAllEnrollments } from '../../services/enrollmentService';
import Skeleton from '../../components/ui/Skeleton';
import type { AdminStats } from '../../services/statService';
import type { Enrollment } from '../../types';
import { format } from 'date-fns';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminStats().then(setStats),
      getAllEnrollments().then(setEnrollments),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // enrollmentsByMonth comes directly from the backend
  const monthEntries = stats?.enrollmentsByMonth ?? [];
  const maxMonth = Math.max(...monthEntries.map((e) => e.value), 1);

  return (
    <div>
      <div className="mb-10 border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Administration</p>
        <h1 className="font-heading text-4xl text-charcoal">Analytics</h1>
      </div>

      {loading ? (
        <div className="space-y-8">
          <Skeleton variant="rect" className="h-48" />
          <Skeleton variant="rect" className="h-64" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { label: 'Total Users', value: stats?.totalUsers.value ?? 0 },
              { label: 'Total Courses', value: stats?.totalCourses.value ?? 0 },
              { label: 'Total Enrollments', value: stats?.totalEnrollments.value ?? 0 },
              { label: 'Instructors', value: stats?.totalInstructors.value ?? 0 },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="border-t border-charcoal/15 pt-6"
              >
                <p className="text-overline mb-2">{s.label}</p>
                <p className="font-heading text-4xl text-charcoal">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Enrollments by Month — from backend aggregate */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl text-charcoal mb-8">Enrollments by Month</h2>
            {monthEntries.length === 0 ? (
              <p className="text-sm text-warm-grey italic">No enrollment data available</p>
            ) : (
              <div className="flex items-end gap-4 h-48 border-b border-charcoal/15 pb-4">
                {monthEntries.map(({ label, value }, i) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-charcoal font-medium">{value}</span>
                    <motion.div
                      className="w-full bg-gold"
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / maxMonth) * 160}px` }}
                      transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                    />
                    <span className="text-[10px] text-warm-grey uppercase tracking-widest text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Distribution — percentage from backend */}
          {stats?.categoryDistribution && stats.categoryDistribution.length > 0 && (
            <div className="mb-16">
              <h2 className="font-heading text-2xl text-charcoal mb-8">Courses by Category</h2>
              <div className="space-y-4">
                {stats.categoryDistribution.map(({ label, value }, idx) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-xs text-warm-grey w-40 shrink-0 uppercase tracking-widest truncate">{label}</span>
                    <div className="flex-1 h-2 bg-taupe/40 relative">
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-charcoal"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(value, 100)}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: idx * 0.06 }}
                      />
                    </div>
                    <span className="text-sm font-medium text-charcoal w-10 text-right shrink-0">
                      {Math.round(value)}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Enrollments */}
          <div>
            <h2 className="font-heading text-2xl text-charcoal mb-6">
              Recent Enrollments <span className="font-body text-sm font-normal text-warm-grey ml-3">({enrollments.length} total)</span>
            </h2>
            <div className="space-y-2">
              {enrollments.slice(0, 20).map((e) => {
                const course = typeof e.course === 'object' ? e.course : null;
                const student = typeof e.student === 'object' ? e.student : null;
                return (
                  <div key={e._id} className="flex items-center justify-between p-4 border border-charcoal/10 hover:border-charcoal/20 transition-colors duration-300">
                    <div className="min-w-0">
                      <p className="text-sm text-charcoal truncate">{course?.title ?? 'Unknown Course'}</p>
                      <p className="text-xs text-warm-grey">{student?.name ?? 'Unknown Student'}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-6">
                      <span className="text-xs text-warm-grey">{Math.round(e.progress)}%</span>
                      <span className="text-xs text-warm-grey hidden sm:block">
                        {e.createdAt ? format(new Date(e.createdAt), 'MMM d, yyyy') : '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
