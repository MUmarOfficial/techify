import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Trash2, BookOpen, X, Check } from 'lucide-react';
import { getMyCourses, updateCourse, deleteCourse } from '../../services/courseService';
import { useToast } from '../../context/useToast';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/shared/EmptyState';
import Input from '../../components/ui/Input';
import { getMediaUrl } from '../../utils/url';
import { CATEGORIES, ROUTES } from '../../constants';
import type { Course } from '../../types';
import { getSkeletonArray } from '@/utils/array';

interface EditCourseForm {
  title: string;
  price: number;
  category: string;
}


export default function ManageCoursesPage() {
  const { addToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: saving, isValid },
  } = useForm<EditCourseForm>({
    mode: 'onChange',
  });

  useEffect(() => {
    getMyCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (course: Course) => {
    setEditCourse(course);
    reset({
      title: course.title,
      price: course.price,
      category: course.category,
    });
  };

  const onSave = async (data: EditCourseForm) => {
    if (!editCourse) return;
    try {
      const updated = await updateCourse(editCourse._id, {
        ...data,
        price: Number(data.price),
      });
      setCourses((prev) => prev.map((c) => (c._id === editCourse._id ? updated : c)));
      setEditCourse(null);
      addToast('success', 'Course updated successfully');
    } catch {
      addToast('error', 'Failed to update course');
    }
  };


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

  return (
    <div>
      <div className="flex items-end justify-between mb-10 border-b border-charcoal/10 pb-8">
        <div>
          <p className="text-overline text-gold mb-2">Instructor</p>
          <h1 className="font-heading text-4xl text-charcoal">My Courses</h1>
        </div>
        <Link
          to={ROUTES.DASHBOARD.INSTRUCTOR.CREATE_COURSE}
          className="inline-flex items-center h-10 px-6 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-300"
        >
          + New Course
        </Link>
      </div>

      {(() => {
        if (loading) {
          return (
            <div className="space-y-4">
              {getSkeletonArray(4).map((id) => (
                <Skeleton key={id} variant="rect" className="h-24" />
              ))}
            </div>
          );
        }

        if (courses.length === 0) {
          return (
            <EmptyState
              title="No courses yet"
              message="Create your first course to start sharing your knowledge."
              action={
                <Link
                  to={ROUTES.DASHBOARD.INSTRUCTOR.CREATE_COURSE}
                  className="inline-flex h-10 px-6 bg-charcoal text-white text-label items-center hover:bg-gold hover:text-charcoal transition-colors duration-300"
                >
                  Create First Course
                </Link>
              }
            />
          );
        }

        return (
          <div className="space-y-3">
            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-4 p-5 border border-charcoal/10 hover:border-gold/30 transition-colors duration-300"
              >
                {course.thumbnail && (
                  <img
                    src={getMediaUrl(course.thumbnail)}
                    alt={course.title}
                    className="w-16 h-12 object-cover shrink-0 hidden sm:block"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{course.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="muted">{course.category}</Badge>
                    <span className="text-xs text-warm-grey">${course.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={ROUTES.DASHBOARD.INSTRUCTOR.LESSONS(course._id)}
                    className="w-8 h-8 flex items-center justify-center border border-charcoal/15 text-warm-grey hover:border-gold hover:text-gold transition-colors duration-300"
                    title="Manage Lessons"
                  >
                    <BookOpen size={14} strokeWidth={1.5} />
                  </Link>
                  <button
                    onClick={() => openEdit(course)}
                    className="w-8 h-8 flex items-center justify-center border border-charcoal/15 text-warm-grey hover:border-gold hover:text-gold transition-colors duration-300 cursor-pointer"
                    title="Edit Course"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setDeleteId(course._id)}
                    className="w-8 h-8 flex items-center justify-center border border-charcoal/15 text-warm-grey hover:border-error hover:text-error transition-colors duration-300 cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        );
      })()}

      {/* Edit Modal */}
      <Modal isOpen={!!editCourse} onClose={() => setEditCourse(null)} title="Edit Course">
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <Input 
            label="Title" 
            id="edit-title"
            {...register('title', { required: true })} 
          />
          <div>
            <span className="text-label text-warm-grey block mb-2">Category</span>
            <select
              className="w-full h-12 px-0 py-2 bg-transparent border-0 border-b border-charcoal/30 text-sm text-charcoal focus:border-gold focus:outline-none transition-colors duration-300 cursor-pointer"
              {...register('category', { required: true })}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input 
            label="Price (USD)" 
            type="number" 
            id="edit-price"
            {...register('price', { required: true, min: 0 })} 
          />
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !isValid}
              className="flex items-center gap-2 h-10 px-6 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-300 disabled:opacity-60 cursor-pointer"
            >
              <Check size={14} strokeWidth={1.5} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditCourse(null)}
              className="flex items-center gap-2 h-10 px-6 border border-charcoal/20 text-label text-warm-grey hover:border-charcoal hover:text-charcoal transition-colors duration-300 cursor-pointer"
            >
              <X size={14} strokeWidth={1.5} />
              Cancel
            </button>
          </div>
        </form>
      </Modal>


      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Course">
        <p className="text-sm text-warm-grey mb-6 leading-relaxed">
          Are you sure you want to delete this course? This action cannot be undone and will remove all associated lessons.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="h-10 px-6 bg-error text-white text-label hover:opacity-80 transition-opacity duration-300 disabled:opacity-60 cursor-pointer"
          >
            {deleting ? 'Deleting...' : 'Delete Course'}
          </button>
          <button
            onClick={() => setDeleteId(null)}
            className="h-10 px-6 border border-charcoal/20 text-label text-warm-grey hover:border-charcoal hover:text-charcoal transition-colors duration-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
