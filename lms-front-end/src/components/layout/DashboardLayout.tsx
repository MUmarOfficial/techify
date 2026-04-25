import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Avatar from '../ui/Avatar';
import { ROUTES, ROLE_LABELS } from '../../constants';

const navMap = {
  student: [
    { to: ROUTES.DASHBOARD.STUDENT.HOME, label: 'Overview' },
    { to: ROUTES.DASHBOARD.STUDENT.MY_COURSES, label: 'My Courses' },
    { to: ROUTES.DASHBOARD.STUDENT.PROFILE, label: 'Profile' },
  ],
  instructor: [
    { to: ROUTES.DASHBOARD.INSTRUCTOR.HOME, label: 'Overview' },
    { to: ROUTES.DASHBOARD.INSTRUCTOR.COURSES, label: 'My Courses' },
    { to: ROUTES.DASHBOARD.INSTRUCTOR.CREATE_COURSE, label: 'Create Course' },
    { to: ROUTES.DASHBOARD.INSTRUCTOR.PROFILE, label: 'Profile' },
  ],
  admin: [
    { to: ROUTES.DASHBOARD.ADMIN.HOME, label: 'Overview' },
    { to: ROUTES.DASHBOARD.ADMIN.USERS, label: 'Users' },
    { to: ROUTES.DASHBOARD.ADMIN.COURSES, label: 'Courses' },
    { to: ROUTES.DASHBOARD.ADMIN.CATEGORIES, label: 'Categories' },
    { to: ROUTES.DASHBOARD.ADMIN.ANALYTICS, label: 'Analytics' },
    { to: ROUTES.DASHBOARD.ADMIN.PROFILE, label: 'Profile' },
  ],
};

function getDashboardHome(role: string): string {
  return navMap[role as keyof typeof navMap]?.[0]?.to ?? ROUTES.HOME;
}


export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = user ? (navMap[user.role] ?? []) : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-alabaster flex">
      {/* ── Sidebar Desktop ──────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-charcoal/10 bg-alabaster sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 px-8 py-6 border-b border-charcoal/10 group shrink-0">
          <div className="w-7 h-7 bg-charcoal flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
            <Zap size={14} strokeWidth={2} className="text-white" />
          </div>
          <span className="font-body font-bold text-xs tracking-[0.25em] uppercase text-charcoal">
            Techify
          </span>
        </Link>

        {/* User Info */}
        {user && (
          <div className="px-8 py-6 border-b border-charcoal/10 shrink-0">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} src={user.avatar} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{user.name}</p>
                <p className="text-xs text-warm-grey/70 uppercase tracking-widest">
                  {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ?? user.role}
                </p>

              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="sidebar-link group flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] text-warm-grey hover:text-charcoal hover:bg-black/3 transition-all duration-300 relative"
                >
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6 border-t border-charcoal/10 pt-4 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-xs font-medium uppercase tracking-[0.15em] text-warm-grey hover:text-charcoal transition-colors duration-300 cursor-pointer"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar ────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-charcoal/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-alabaster z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10">
                <span className="font-body font-bold text-xs tracking-[0.25em] uppercase">Techify</span>
                <button onClick={() => setSidebarOpen(false)} className="text-warm-grey cursor-pointer">
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-1">
                  {links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] text-warm-grey hover:text-charcoal transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="px-4 pb-6 border-t border-charcoal/10 pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-xs font-medium uppercase tracking-[0.15em] text-warm-grey cursor-pointer"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-alabaster/95 backdrop-blur-sm border-b border-charcoal/10">
          <div className="flex items-center justify-between px-6 md:px-10 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-charcoal cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <div className="hidden md:block" />
            {user && (
              <div className="flex items-center gap-4">
                <Link
                  to={getDashboardHome(user.role)}
                  className="flex items-center gap-2.5 group"
                >
                  <span className="text-xs text-warm-grey group-hover:text-charcoal transition-colors hidden sm:block">
                    {user.name}
                  </span>
                  <Avatar name={user.name} src={user.avatar} size="sm" />
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 md:px-10 py-8 md:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
