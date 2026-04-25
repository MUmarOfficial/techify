import { useEffect, useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getCourses } from '../../services/courseService';
import CourseCard from '../../components/shared/CourseCard';
import SectionHeader from '../../components/shared/SectionHeader';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/shared/EmptyState';
import type { Course } from '../../types';
import { getSkeletonArray } from '@/utils/array';

interface SearchForm {
  search: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const { register, control, reset } = useForm<SearchForm>({
    defaultValues: { search: '' },
  });
  const search = useWatch({ control, name: 'search' });

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);


  const categories = useMemo(() => {
    const cats = Array.from(new Set(courses.map((c) => c.category)));
    return ['All', ...cats];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchCat = activeCategory === 'All' || c.category === activeCategory;
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [courses, activeCategory, search]);

  return (
    <div className="bg-alabaster min-h-screen">
      {/* ─── HEADER ───────────────────────────────────── */}
      <section className="pt-16 md:pt-24 pb-16 border-b border-charcoal/10">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16">
          <SectionHeader
            overline="The Curriculum"
            title="All Courses"
            subtitle="Explore our complete catalog of expert-led technical courses."
          />
        </div>
      </section>

      {/* ─── FILTERS ──────────────────────────────────── */}
      <section className="sticky top-16 md:top-20 z-20 bg-alabaster/95 backdrop-blur-sm border-b border-charcoal/10">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-charcoal text-white'
                      : 'bg-transparent border border-charcoal/20 text-warm-grey hover:border-charcoal hover:text-charcoal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-grey/60" />
              <input
                type="text"
                placeholder="Search courses..."
                {...register('search')}
                className="w-full pl-9 pr-4 py-2.5 bg-transparent border border-charcoal/20 text-sm text-charcoal placeholder:text-warm-grey/50 focus:border-gold focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── COURSE GRID ──────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-400 mx-auto px-6 md:px-12 lg:px-16">
          {/* Count */}
          {!loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-overline text-warm-grey mb-10"
            >
              {filtered.length} {filtered.length === 1 ? 'course' : 'courses'} found
            </motion.p>
          )}

          {(() => {
            if (loading) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {getSkeletonArray(8).map((id) => (
                    <div key={id} className="space-y-4">
                      <Skeleton variant="rect" className="h-48" />
                      <Skeleton variant="text" className="w-1/3 h-3" />
                      <Skeleton variant="text" className="w-3/4 h-5" />
                      <Skeleton variant="text" className="h-3" />
                    </div>
                  ))}
                </div>
              );
            }

            if (filtered.length === 0) {
              return (
                <EmptyState
                  title="No courses found"
                  message="Try adjusting your search or filter to find what you're looking for."
                  action={
                    <button
                      onClick={() => {
                        reset();
                        setActiveCategory('All');
                      }}
                      className="inline-flex items-center h-10 px-6 border border-charcoal text-xs font-medium uppercase tracking-[0.15em] hover:bg-charcoal hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  }
                />
              );
            }


            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {filtered.map((course, i) => (
                  <CourseCard key={course._id} course={course} index={i} />
                ))}
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
