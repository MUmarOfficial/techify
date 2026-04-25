import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { getCourses, deleteCourse } from '../../services/courseService';
import { useToast } from '../../context/useToast';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/shared/EmptyState';
import { format } from 'date-fns';
import { getSkeletonArray } from '../../utils/array';
import type { Course } from '../../types';

interface SearchForm {
  search: string;
}

export default function AdminCoursesPage() {
  const { addToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { register, control } = useForm<SearchForm>({
    defaultValues: { search: '' },
  });
  const search = useWatch({ control, name: 'search' });

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);


  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteCourse(deleteId);
      setCourses((prev) => prev.filter((c) => c._id !== deleteId));
      setDeleteId(null);
      addToast('success', 'Course deleted');
    } catch {
      addToast('error', 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 border-b border-charcoal/10 pb-8 gap-4">
        <div>
          <p className="text-overline text-gold mb-2">Administration</p>
          <h1 className="font-heading text-4xl text-charcoal">All Courses</h1>
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          {...register('search')}
          className="w-full sm:w-64 px-4 py-2.5 bg-transparent border border-charcoal/20 text-sm text-charcoal placeholder:text-warm-grey/50 focus:border-gold focus:outline-none transition-colors duration-300"
        />

      </div>

      {/* List */}
      {(() => {
        if (loading) {
          return (
            <div className="space-y-4">
              {getSkeletonArray(6).map((id) => (
                <Skeleton key={id} variant="rect" className="h-24" />
              ))}
            </div>
          );
        }

        if (filtered.length === 0) {
          return <EmptyState title="No courses found" message="Try adjusting your search." />;
        }

        return (
          <div className="space-y-2">
            {filtered.map((course, i) => {
              const instructor = typeof course.instructor === 'object' ? course.instructor : null;
              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.5) }}
                  className="flex items-center gap-4 p-5 border border-charcoal/10 hover:border-charcoal/20 transition-colors duration-300"
                >
                  {course.thumbnail && (
                    <img
                      src={`${course.thumbnail}?w=80&h=60&fit=crop`}
                      alt={course.title}
                      className="w-16 h-12 object-cover shrink-0 hidden sm:block"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{course.title}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <Badge variant="muted">{course.category}</Badge>
                      {instructor && <span className="text-xs text-warm-grey">by {instructor.name}</span>}
                      <span className="text-xs text-warm-grey">${course.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-warm-grey shrink-0 hidden lg:block">
                    {course.createdAt ? format(new Date(course.createdAt), 'MMM d, yyyy') : '—'}
                  </span>
                  <button
                    onClick={() => setDeleteId(course._id)}
                    className="w-8 h-8 flex items-center justify-center border border-charcoal/15 text-warm-grey hover:border-error hover:text-error transition-colors duration-300 cursor-pointer shrink-0"
                    title="Delete Course"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        );
      })()}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Course">
        <p className="text-sm text-warm-grey mb-6">This will permanently delete the course and all its lessons.</p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="h-10 px-6 bg-error text-white text-label cursor-pointer disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={() => setDeleteId(null)}
            className="h-10 px-6 border border-charcoal/20 text-label text-warm-grey cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
