import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Trash2, ShieldCheck } from 'lucide-react';
import { getAllUsers, deleteUser, updateUserRole } from '../../services/userService';
import { useToast } from '../../context/useToast';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import Avatar from '../../components/ui/Avatar';
import { format } from 'date-fns';
import { ROLE_COLORS } from '../../constants';
import type { User } from '../../types';
import { getSkeletonArray } from '@/utils/array';

interface SearchForm {
  search: string;
}

interface RoleForm {
  role: 'student' | 'instructor' | 'admin';
}

export default function ManageUsersPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'student' | 'instructor' | 'admin'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [roleModal, setRoleModal] = useState<User | null>(null);

  const { register: regSearch, control: controlSearch } = useForm<SearchForm>({
    defaultValues: { search: '' },
  });
  const search = useWatch({ control: controlSearch, name: 'search' });

  const {
    register: regRole,
    handleSubmit: handleRoleSubmit,
    setValue: setRoleValue,
    control: controlRole,
    formState: { isSubmitting: savingRole },
  } = useForm<RoleForm>();

  const newRole = useWatch({ control: controlRole, name: 'role' });

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const matchRole = filter === 'all' || u.role === filter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteUser(deleteId);
      setUsers((prev) => prev.filter((u) => u._id !== deleteId));
      setDeleteId(null);
      addToast('success', 'User deleted');
    } catch {
      addToast('error', 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const openRoleModal = (user: User) => {
    setRoleModal(user);
    setRoleValue('role', user.role);
  };

  const onRoleUpdate = async (data: RoleForm) => {
    if (!roleModal) return;
    try {
      const updated = await updateUserRole(roleModal._id, data.role);
      setUsers((prev) => prev.map((u) => (u._id === roleModal._id ? updated : u)));
      setRoleModal(null);
      addToast('success', 'Role updated');
    } catch {
      addToast('error', 'Failed to update role');
    }
  };


  return (
    <div>
      <div className="mb-10 border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Administration</p>
        <h1 className="font-heading text-4xl text-charcoal">Manage Users</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'student', 'instructor', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer ${
                filter === r
                  ? 'bg-charcoal text-white'
                  : 'border border-charcoal/20 text-warm-grey hover:border-charcoal hover:text-charcoal'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          {...regSearch('search')}
          className="w-full sm:w-64 px-4 py-2.5 bg-transparent border border-charcoal/20 text-sm text-charcoal placeholder:text-warm-grey/50 focus:border-gold focus:outline-none transition-colors duration-300"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {getSkeletonArray(4).map((id) => (
            <Skeleton key={id} variant="rect" className="h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user, i) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
              className="flex items-center gap-4 p-5 border border-charcoal/10 hover:border-charcoal/20 transition-colors duration-300"
            >
              <Avatar name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{user.name}</p>
                <p className="text-xs text-warm-grey truncate">{user.email}</p>
              </div>
              <Badge variant={ROLE_COLORS[user.role as keyof typeof ROLE_COLORS]} className="hidden sm:inline-flex shrink-0">
                {user.role}
              </Badge>

              <span className="text-xs text-warm-grey shrink-0 hidden md:block">
                {user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : '—'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openRoleModal(user)}
                  className="w-8 h-8 flex items-center justify-center border border-charcoal/15 text-warm-grey hover:border-gold hover:text-gold transition-colors duration-300 cursor-pointer"
                  title="Change Role"
                >
                  <ShieldCheck size={14} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setDeleteId(user._id)}
                  className="w-8 h-8 flex items-center justify-center border border-charcoal/15 text-warm-grey hover:border-error hover:text-error transition-colors duration-300 cursor-pointer"
                  title="Delete User"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Role Change Modal */}
      <Modal isOpen={!!roleModal} onClose={() => setRoleModal(null)} title="Change User Role">
        <form onSubmit={handleRoleSubmit(onRoleUpdate)}>
          <p className="text-sm text-warm-grey mb-6">
            Changing role for <strong className="text-charcoal">{roleModal?.name}</strong>
          </p>
          <div className="flex gap-3 mb-6">
            {(['student', 'instructor', 'admin'] as const).map((r) => (
              <label key={r} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  value={r}
                  className="sr-only"
                  {...regRole('role')}
                />
                <div
                  className={`py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-center transition-all duration-300 ${
                    newRole === r ? 'bg-charcoal text-white' : 'border border-charcoal/20 text-warm-grey hover:border-charcoal'
                  }`}
                >
                  {r}
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={savingRole}
              className="h-10 px-6 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-300 disabled:opacity-60 cursor-pointer"
            >
              {savingRole ? 'Saving...' : 'Update Role'}
            </button>
            <button
              type="button"
              onClick={() => setRoleModal(null)}
              className="h-10 px-6 border border-charcoal/20 text-label text-warm-grey hover:border-charcoal transition-colors duration-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>


      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete User">
        <p className="text-sm text-warm-grey mb-6">This will permanently remove the user and all their data.</p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="h-10 px-6 bg-error text-white text-label cursor-pointer disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete User'}
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
