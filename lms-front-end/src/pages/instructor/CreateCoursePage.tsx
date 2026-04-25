import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createCourse } from '../../services/courseService';
import { getCategories } from '../../services/categoryService';
import { useToast } from '../../context/useToast';
import Input from '../../components/ui/Input';
import { ROUTES } from '../../constants';
import type { Course, Category } from '../../types';

type FormData = Pick<Course, 'title' | 'description' | 'category' | 'price'> & { thumbnail: string };


const UNSPLASH_THUMBNAILS = [
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
  'https://images.unsplash.com/photo-1667372393086-9d4001d4d732',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
];

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { thumbnail: UNSPLASH_THUMBNAILS[0] } });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        addToast('error', 'Failed to load categories');
      } finally {

        setLoadingCats(false);
      }
    };
    fetchCats();
  }, [addToast]);


  const onSubmit = async (data: FormData) => {
    try {
      await createCourse({ ...data, price: Number(data.price) });
      addToast('success', 'Course created successfully!');
      navigate(ROUTES.DASHBOARD.INSTRUCTOR.COURSES);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to create course';
      addToast('error', msg);
    }
  };

  const selectedThumb = useWatch({
    control,
    name: 'thumbnail',
  });

  return (
    <div className="max-w-2xl">
      <div className="mb-10 border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Instructor</p>
        <h1 className="font-heading text-4xl text-charcoal">Create Course</h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        <Input
          id="course-title"
          label="Course Title"
          placeholder="e.g. Advanced TypeScript Engineering"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required', maxLength: { value: 120, message: 'Max 120 chars' } })}
        />

        <div>
          <span className="text-label text-warm-grey block mb-2">Description</span>
          <textarea
            id="course-description"
            placeholder="Describe what students will learn..."
            rows={5}
            className="w-full px-0 py-2 bg-transparent border-0 border-b border-charcoal/30 text-sm text-charcoal placeholder:font-heading placeholder:italic placeholder:text-warm-grey/60 focus:border-gold focus:outline-none transition-colors duration-300 resize-none"
            {...register('description', { required: 'Description is required', maxLength: { value: 2000, message: 'Max 2000 chars' } })}
          />
          {errors.description && <p className="mt-1.5 text-xs text-error">{errors.description.message}</p>}
        </div>

        {/* Category */}
        <div>
          <span className="text-label text-warm-grey block mb-2">Category</span>
          <select
            id="course-category"
            className="w-full h-12 px-0 py-2 bg-transparent border-0 border-b border-charcoal/30 text-sm text-charcoal focus:border-gold focus:outline-none transition-colors duration-300 cursor-pointer appearance-none"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">{loadingCats ? 'Loading categories...' : 'Select a category'}</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}

          </select>
          {errors.category && <p className="mt-1.5 text-xs text-error">{errors.category.message}</p>}
        </div>

        <Input
          id="course-price"
          label="Price (USD)"
          type="number"
          placeholder="0.00"
          error={errors.price?.message}
          {...register('price', {
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' },
          })}
        />

        {/* Thumbnail Picker */}
        <div>
          <span className="text-label text-warm-grey block mb-4">Course Thumbnail</span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {UNSPLASH_THUMBNAILS.map((url, i) => (
              <label key={url} className="cursor-pointer">
                <input type="radio" value={url} className="sr-only" {...register('thumbnail')} />
                <div className={`aspect-square overflow-hidden border-2 transition-colors duration-300 ${selectedThumb === url ? 'border-gold' : 'border-transparent'}`}>
                  <img src={`${url}?w=120&h=120&fit=crop`} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              </label>
            ))}
          </div>
          <Input
            id="course-thumbnail-url"
            label="Or enter custom URL"
            type="url"
            placeholder="https://images.unsplash.com/..."
            {...register('thumbnail')}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 px-8 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-500 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.DASHBOARD.INSTRUCTOR.COURSES)}
            className="h-12 px-8 border border-charcoal/20 text-label text-warm-grey hover:border-charcoal hover:text-charcoal transition-colors duration-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
}
