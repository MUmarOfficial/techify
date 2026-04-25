import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/shared/SectionHeader';

const values = [
  {
    num: '01',
    title: 'Depth Over Breadth',
    desc: 'We believe in teaching complete mastery of a topic. Every course is designed to take you from foundational understanding to production-grade proficiency.',
  },
  {
    num: '02',
    title: 'Practice-First Learning',
    desc: 'Theory without application is hollow. Every module includes real-world exercises, code reviews, and project milestones.',
  },
  {
    num: '03',
    title: 'Expert Instruction',
    desc: 'Our instructors are active practitioners — engineers, architects, and designers working at the frontier of their fields.',
  },
  {
    num: '04',
    title: 'Community & Accountability',
    desc: 'Learning in isolation stalls progress. Techify connects you with a cohort of serious engineers on the same journey.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-alabaster">
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="py-24 md:py-36 border-b border-charcoal/10">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-px w-8 bg-gold" />
                <span className="text-overline text-gold">Our Story</span>
              </div>
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-charcoal leading-[0.95] mb-10">
                We believe<br />
                <em className="not-italic text-gold">learning</em><br />
                is craft.
              </h1>
              <p className="text-base md:text-lg text-warm-grey max-w-xl leading-relaxed drop-cap">
                Techify was founded on a simple conviction: that the best technology education looks more like an apprenticeship than a lecture. We set out to build a platform where engineers learn with the same rigour that craftspeople have always used — through deliberate practice, expert mentorship, and high standards.
              </p>
            </div>

            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <img
                src="https://images.stockcake.com/public/8/d/8/8d864a57-334a-4d32-a3ef-55faf91136bd_large/futuristic-tech-portrait-stockcake.jpg"
                alt="Engineers at work"
                className="w-full aspect-4/5 object-cover shadow-card-hover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── VALUES ───────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16">
          <SectionHeader
            overline="Core Values"
            title="What we stand for"
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-charcoal/10">
            {values.map((v, i) => (
              <motion.div
                key={v.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-alabaster p-10 md:p-14"
              >
                <span className="font-heading text-6xl text-charcoal/10 leading-none block mb-6">
                  {v.num}
                </span>
                <h3 className="font-heading text-2xl text-charcoal mb-4">{v.title}</h3>
                <p className="text-sm text-warm-grey leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DARK BLOCK ───────────────────────────────── */}
      <section className="py-24 md:py-32 bg-charcoal">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <img
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop"
              alt="Code on screen"
              className="w-full aspect-4/3 object-cover"
            />
            <div>
              <p className="text-overline text-gold mb-6">Our Mission</p>
              <p className="font-heading text-3xl md:text-5xl text-white leading-[1.1] mb-8">
                Closing the gap between knowing and <em className="not-italic text-gold">doing</em>.
              </p>
              <p className="text-sm text-white/60 leading-relaxed max-w-md mb-10">
                The technology industry has a paradox: an abundance of information, and a scarcity of genuine understanding. Techify exists to resolve that tension by providing the structured, expert-led pathways that turn curious learners into confident practitioners.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-3 h-12 px-8 bg-gold text-charcoal font-body font-medium text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors duration-500"
              >
                Browse Courses
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
