import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Award, Zap } from 'lucide-react';
import { getCourses } from '../../services/courseService';
import CourseCard from '../../components/shared/CourseCard';
import SectionHeader from '../../components/shared/SectionHeader';
import Skeleton from '../../components/ui/Skeleton';
import type { Course } from '../../types';
import { getSkeletonArray } from '@/utils/array';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Courses Available', value: courses.length || '20+', icon: BookOpen },
    { label: 'Expert Instructors', value: '5+', icon: Users },
    { label: 'Students Enrolled', value: '50+', icon: Award },
    { label: 'Categories', value: '5', icon: Zap },
  ];

  return (
    <div className="bg-alabaster">
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.stockcake.com/public/4/f/f/4fff8819-d7d8-40f3-b180-6ba65ea25fd3/futuristic-robot-portrait-stockcake.jpg"
            alt="Tech learning environment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/70" />
        </div>

        {/* Vertical grid lines */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white/5" />
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/5" />
          <div className="absolute left-[75%] top-0 bottom-0 w-px bg-white/5" />
        </div>

        <div className="relative z-10 max-w-400 mx-auto w-full px-6 md:px-12 lg:px-16 pb-20 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-10 bg-gold" />
              <span className="text-overline text-gold">Techify Platform</span>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8">
              Master Modern{' '}
              <em className="not-italic text-gold">Technology</em>
              {' '}with Precision
            </h1>

            <p className="text-base md:text-xl text-white/70 max-w-xl leading-relaxed mb-12">
              Curated technical courses taught by industry professionals. Learn at the intersection of theory and practice.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-3 h-14 px-10 bg-gold text-charcoal font-body font-semibold text-sm uppercase tracking-[0.2em] hover:bg-white transition-colors duration-500 w-fit"
              >
                Explore Courses
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 h-14 px-10 border border-white/40 text-white font-body font-medium text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-charcoal transition-all duration-500 w-fit"
              >
                Start Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────── */}
      <section className="border-b border-charcoal/10">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-start px-8 py-10 border-r border-charcoal/10 last:border-r-0 odd:border-r lg:odd:border-r"
              >
                <stat.icon size={20} strokeWidth={1} className="text-gold mb-4" />
                <p className="font-heading text-4xl md:text-5xl text-charcoal leading-none mb-2">
                  {stat.value}
                </p>
                <p className="text-overline">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COURSES ────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <SectionHeader
              overline="Curriculum"
              title={`The Course\nCatalog`}
              subtitle="Rigorous, practical courses built for engineers who want mastery, not just familiarity."
            />
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-label text-warm-grey hover:text-gold transition-colors duration-300 shrink-0"
            >
              View all courses
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getSkeletonArray(6).map((id) => (
                <div key={id} className="space-y-4">
                  <Skeleton variant="rect" className="h-56" />
                  <Skeleton variant="text" className="w-1/3 h-3" />
                  <Skeleton variant="text" className="w-3/4 h-5" />
                  <Skeleton variant="text" className="h-3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {courses.map((course, i) => (
                <CourseCard key={course._id} course={course} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── WHY TECHIFY ─────────────────────────────── */}
      <section className="py-24 md:py-32 bg-charcoal">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-8 bg-gold" />
                <span className="text-overline text-gold">Why Techify</span>
              </div>
              <h2 className="font-heading text-4xl md:text-6xl text-white leading-[1.05] mb-8">
                Built for{' '}
                <em className="not-italic text-gold">serious</em>{' '}
                engineers
              </h2>
              <p className="text-base text-white/60 leading-relaxed max-w-lg">
                Every course on Techify is crafted by working professionals with real-world experience. We believe in depth over breadth — a complete understanding rather than surface-level familiarity.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10">
              {[
                { title: 'Expert Instructors', desc: 'Learn from senior engineers and architects with years of production experience.' },
                { title: 'Structured Curriculum', desc: 'Every course follows a deliberate progression from fundamentals to mastery.' },
                { title: 'Real Projects', desc: 'Build portfolio-worthy projects that demonstrate genuine competence.' },
                { title: 'Self-Paced', desc: 'Learn on your schedule with lifetime access to all course materials.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-charcoal p-8 border border-white/10 hover:border-gold/30 transition-colors duration-500"
                >
                  <h3 className="font-heading text-xl text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-t border-charcoal/10">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-overline text-gold mb-6">Begin Today</p>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl text-charcoal leading-[1.05] mb-8">
              Your next level<br />
              <em className="not-italic text-gold">starts here.</em>
            </h2>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 h-14 px-12 bg-charcoal text-white font-body font-medium text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-charcoal transition-all duration-500"
            >
              Create Free Account
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
