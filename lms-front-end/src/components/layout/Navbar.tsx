import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

import { ROUTES } from '../../constants';

const publicLinks = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.COURSES, label: 'Courses' },
  { to: '/about', label: 'About' },
];

const dashboardLink = {
  student: ROUTES.DASHBOARD.STUDENT.HOME,
  instructor: ROUTES.DASHBOARD.INSTRUCTOR.HOME,
  admin: ROUTES.DASHBOARD.ADMIN.HOME,
};

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-alabaster/95 backdrop-blur-sm border-b border-charcoal/10">
      <div className="max-w-400 mx-auto px-6 md:px-8 lg:px-12 py-2 md:py-0">
        <div className="flex items-center justify-between md:h-20">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-charcoal flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
              <Zap size={16} strokeWidth={2} className="text-white" />
            </div>
            <span className="font-body font-bold text-sm tracking-[0.25em] uppercase text-charcoal">
              Techify
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === ROUTES.HOME}
                className={({ isActive }) =>
                  `text-label transition-colors duration-300 ${
                    isActive ? 'text-gold' : 'text-warm-grey hover:text-charcoal'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={dashboardLink[user.role]}
                  className="text-label text-warm-grey hover:text-charcoal transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-label text-warm-grey hover:text-charcoal transition-colors duration-300 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="text-label text-warm-grey hover:text-charcoal transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="inline-flex items-center justify-center h-10 px-6 bg-charcoal text-white text-label hover:bg-gold transition-colors duration-500"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-charcoal p-2 cursor-pointer"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-charcoal/10 bg-alabaster"
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              {publicLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === ROUTES.HOME}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-label ${isActive ? 'text-gold' : 'text-warm-grey'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="h-px bg-charcoal/10" />
              {isAuthenticated && user ? (
                <>
                  <Link
                    to={dashboardLink[user.role]}
                    onClick={() => setMenuOpen(false)}
                    className="text-label text-warm-grey"
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-label text-warm-grey text-left cursor-pointer">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} onClick={() => setMenuOpen(false)} className="text-label text-warm-grey">
                    Login
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center h-10 px-6 bg-charcoal text-white text-label w-full"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
