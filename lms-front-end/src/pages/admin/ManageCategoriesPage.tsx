import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';
import { getCategories, createCategory, deleteCategory } from '../../services/categoryService';
import { useToast } from '../../context/useToast';
import Input from '../../components/ui/Input';
import type { Category } from '../../types';

interface CategoryForm {
  name: string;
}

export default function ManageCategoriesPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<CategoryForm>({
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const data = await getCategories();
        if (!ignore) {
          setCategories(data);
        }
      } catch {
        if (!ignore) addToast('error', 'Failed to load categories');
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [addToast]);


  const onAdd = async (data: CategoryForm) => {
    try {
      const created = await createCategory(data.name.trim());
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      reset();
      addToast('success', 'Category added');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add category';
      addToast('error', msg);
    }
  };



  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      addToast('success', 'Category deleted');
    } catch {
      addToast('error', 'Failed to delete category');
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-10 border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Admin</p>
        <h1 className="font-heading text-4xl text-charcoal">Manage Categories</h1>
      </div>

      {/* Add Category Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onAdd)}
        className="flex items-end gap-4 mb-10"
      >
        <div className="flex-1">
          <Input
            id="new-category"
            label="New Category Name"
            placeholder="e.g. Data Science"
            {...register('name', { required: true, minLength: 2 })}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="h-12 px-6 bg-charcoal text-white text-label flex items-center gap-2 hover:bg-gold hover:text-charcoal transition-colors duration-300 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Add
        </button>
      </motion.form>


      {/* Categories List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {categories.map((cat) => (
              <motion.div
                key={cat._id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between p-4 border border-charcoal/10 bg-alabaster hover:border-charcoal/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-charcoal/5 text-warm-grey group-hover:text-gold transition-colors">
                    <Tag size={14} />
                  </div>
                  <span className="text-sm font-medium text-charcoal">{cat.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 text-warm-grey hover:text-error transition-colors"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && categories.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-charcoal/10">
              <Tag size={40} className="mx-auto text-charcoal/10 mb-4" />
              <p className="text-warm-grey font-heading text-lg italic">No categories found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
