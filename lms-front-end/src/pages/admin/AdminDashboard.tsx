import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, ArrowRight, TrendingUp } from 'lucide-react';
import { getAdminStats } from '../../services/statService';
import StatCard from '../../components/shared/StatCard';
import Skeleton from '../../components/ui/Skeleton';
import { getSkeletonArray } from '../../utils/array';
import { ROUTES } from '../../constants';
import type { AdminStats } from '../../services/statService';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statItems = stats
    ? [
      { label: 'Total Users', value: stats.totalUsers.value, trend: stats.totalUsers.trend, change: stats.totalUsers.change, icon: Users },
      { label: 'Total Courses', value: stats.totalCourses.value, trend: stats.totalCourses.trend, change: stats.totalCourses.change, icon: BookOpen },
      { label: 'Enrollments', value: stats.totalEnrollments.value, trend: stats.totalEnrollments.trend, change: stats.totalEnrollments.change, icon: GraduationCap },
      { label: 'Instructors', value: stats.totalInstructors.value, trend: stats.totalInstructors.trend, change: stats.totalInstructors.change, icon: TrendingUp },
    ]
    : [];

  const quickLinks = [
    { to: ROUTES.DASHBOARD.ADMIN.USERS, label: 'Manage Users', desc: 'View and edit all platform users' },
    { to: ROUTES.DASHBOARD.ADMIN.COURSES, label: 'Manage Courses', desc: 'Moderate and delete courses' },
    { to: ROUTES.DASHBOARD.ADMIN.ANALYTICS, label: 'Analytics', desc: 'Enrollment trends and statistics' },
  ];

  return (
    <div>
      <div className="mb-12 border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Administrator</p>
        <h1 className="font-heading text-4xl md:text-5xl text-charcoal">Platform Overview</h1>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {getSkeletonArray(4).map((id) => (
            <div key={id} className="border-t border-charcoal/15 pt-6 space-y-3">
              <Skeleton variant="text" className="w-1/2 h-3" />
              <Skeleton variant="text" className="w-1/3 h-10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statItems.map((s, i) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              trend={s.trend}
              change={s.change}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Category Distribution */}
      {stats?.categoryDistribution && stats.categoryDistribution.length > 0 && (
        <div className="mb-16">
          <h2 className="font-heading text-2xl text-charcoal mb-6">Courses by Category</h2>
          <div className="space-y-4">
            {stats.categoryDistribution.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center gap-4"
              >
                <span className="text-xs text-warm-grey w-36 shrink-0 uppercase tracking-widest truncate">{item.label}</span>
                <div className="flex-1 h-px bg-taupe/50 relative">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gold"
                    style={{ height: '2px' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.value, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.07 }}
                  />
                </div>
                <span className="text-sm font-medium text-charcoal w-10 text-right shrink-0">
                  {Math.round(item.value)}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div className="mb-16">
          <h2 className="font-heading text-2xl text-charcoal mb-6">Recent Activity</h2>
          <div className="space-y-2">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border border-charcoal/8 hover:border-charcoal/15 transition-colors duration-300">
                <p className="text-sm text-charcoal">{activity.action}</p>
                <span className="text-xs text-warm-grey shrink-0 ml-6">
                  {new Date(activity.time).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="font-heading text-2xl text-charcoal mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center justify-between p-6 border border-charcoal/10 hover:border-gold/40 transition-colors duration-300 group"
            >
              <div>
                <p className="text-sm font-medium text-charcoal mb-1">{link.label}</p>
                <p className="text-xs text-warm-grey">{link.desc}</p>
              </div>
              <ArrowRight size={14} strokeWidth={1.5} className="text-warm-grey group-hover:text-gold transition-colors duration-300 shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
