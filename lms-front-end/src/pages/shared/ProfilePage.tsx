import { useState, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Lock, ShieldCheck, UserPen, Camera, AlertTriangle } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import PasswordStrengthBar from '../../components/ui/PasswordStrengthBar';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import { changePassword, updateProfile } from '../../services/authService';
import { isPasswordStrong } from '../../utils/passwordStrength';
import ImageCropper from '../../components/ui/ImageCropper';
import { ROLE_COLORS, MEDIA_LIMITS } from '../../constants';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface EditProfileForm {
  name: string;
  email: string;
}

const MAX_FILE_BYTES = MEDIA_LIMITS.AVATAR_MAX_SIZE;


export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  // Sections open/close
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  // Avatar preview state (local base64)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit profile form
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
    reset: resetProfile,
  } = useForm<EditProfileForm>({
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  // Change password form
  const {
    register: regPwd,
    handleSubmit: handlePwdSubmit,
    control,
    reset: resetPwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm<ChangePasswordForm>();

  const newPasswordValue = useWatch({ control, name: 'newPassword' }) ?? '';

  if (!user) return null;

  const joined = user.createdAt
    ? format(new Date(user.createdAt), 'MMMM yyyy')
    : 'N/A';

  // The avatar to show: freshly selected preview > saved avatar > null (initials)
  const displayAvatar = avatarPreview ?? user.avatar ?? undefined;

  /* ── Handlers ───────────────────────────────────────── */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatarError(null);
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setAvatarError('Image must be less than 1 MB. Please choose a smaller image.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    // Clear input so same file can be picked again if cancelled
    e.target.value = '';
  };

  const onCropComplete = (croppedBase64: string) => {
    setAvatarPreview(croppedBase64);
    setIsCropperOpen(false);
    setRawImage(null);
  };

  const onSaveProfile = async (data: EditProfileForm) => {
    try {
      const updatedUser = await updateProfile({
        name: data.name,
        email: data.email,
        avatar: avatarPreview ?? undefined, // only send if changed
      });
      updateUser(updatedUser);
      setAvatarPreview(null); // preview consumed — user object now holds it
      addToast('success', 'Profile updated successfully');
      setEditingProfile(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to update profile';
      addToast('error', msg);
    }
  };

  const onChangePassword = async (data: ChangePasswordForm) => {
    if (!isPasswordStrong(data.newPassword)) {
      addToast('error', 'New password must be 8+ chars with letter, number & symbol');
      return;
    }
    try {
      await changePassword(data.currentPassword, data.newPassword);
      addToast('success', 'Password changed successfully');
      resetPwd();
      setChangingPwd(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to change password';
      addToast('error', msg);
    }
  };

  /* ── Render ─────────────────────────────────────────── */

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div className="border-b border-charcoal/10 pb-8">
        <p className="text-overline text-gold mb-2">Account</p>
        <h1 className="font-heading text-4xl text-charcoal">Profile</h1>
      </div>

      {/* ── Profile Card ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="border border-charcoal/15"
      >
        {/* Top strip — avatar + info + edit toggle */}
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-6">
            {/* Avatar with camera overlay */}
            <div className="relative group shrink-0">
              <Avatar name={user.name} src={displayAvatar} size="lg" />
              {editingProfile && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  title="Upload photo"
                >
                  <Camera size={16} strokeWidth={1.5} className="text-white" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-2xl text-charcoal truncate">{user.name}</h2>
              <Badge variant={ROLE_COLORS[user.role as keyof typeof ROLE_COLORS]} className="mt-2">
                {user.role}
              </Badge>

            </div>

            <button
              type="button"
              onClick={() => {
                setEditingProfile((v) => !v);
                if (editingProfile) {
                  resetProfile({ name: user.name, email: user.email });
                  setAvatarPreview(null);
                  setAvatarError(null);
                }
              }}
              className="flex items-center gap-2 h-9 px-5 border border-charcoal/20 text-xs font-medium uppercase tracking-[0.15em] text-warm-grey hover:border-charcoal hover:text-charcoal transition-colors duration-300 cursor-pointer shrink-0"
            >
              <UserPen size={13} strokeWidth={1.5} />
              {editingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Avatar error */}
          {avatarError && (
            <div className="mt-4 flex items-start gap-3 p-3 border border-amber-400/40 bg-amber-50">
              <AlertTriangle size={14} strokeWidth={1.5} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">{avatarError}</p>
            </div>
          )}
        </div>

        {/* Edit form */}
        {editingProfile ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.35 }}
            className="border-t border-charcoal/10 px-8 md:px-10 pb-8 md:pb-10 pt-6"
          >
            {/* Upload hint */}
            <p className="text-xs text-warm-grey mb-6">
              Hover your avatar and click <strong>the camera icon</strong> to upload a new photo (max 1 MB).
            </p>

            <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-6" noValidate>
              <Input
                id="profile-name"
                label="Full Name"
                type="text"
                placeholder="Your full name"
                error={profileErrors.name?.message}
                {...regProfile('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                  maxLength: { value: 50, message: 'Max 50 characters' },
                })}
              />
              <Input
                id="profile-email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={profileErrors.email?.message}
                {...regProfile('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                })}
              />

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="h-10 px-6 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-300 disabled:opacity-60 cursor-pointer"
                >
                  {profileSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(false);
                    resetProfile({ name: user.name, email: user.email });
                    setAvatarPreview(null);
                    setAvatarError(null);
                  }}
                  className="h-10 px-6 border border-charcoal/20 text-label text-warm-grey hover:border-charcoal hover:text-charcoal transition-colors duration-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Read-only info rows */
          <div className="border-t border-charcoal/10 px-8 md:px-10 pb-8 md:pb-10">
            {[
              { label: 'Full Name', value: user.name },
              { label: 'Email Address', value: user.email },
              {
                label: 'Role',
                value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
              },
              { label: 'Member Since', value: joined },
            ].map((field) => (
              <div
                key={field.label}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-charcoal/10 last:border-b-0"
              >
                <span className="text-overline mb-1 sm:mb-0">{field.label}</span>
                <span className="text-sm text-charcoal font-medium">{field.value}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Change Password Card ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="border border-charcoal/15"
      >
        <button
          type="button"
          onClick={() => setChangingPwd((v) => !v)}
          className="w-full flex items-center justify-between p-8 md:p-10 cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 flex items-center justify-center border border-charcoal/20 group-hover:border-gold transition-colors duration-300">
              <Lock size={14} strokeWidth={1.5} className="text-warm-grey group-hover:text-gold transition-colors duration-300" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-charcoal">Change Password</p>
              <p className="text-xs text-warm-grey mt-0.5">Update your account password</p>
            </div>
          </div>
          <span className="text-xs text-warm-grey group-hover:text-charcoal transition-colors duration-300 uppercase tracking-widest">
            {changingPwd ? 'Cancel' : 'Update'}
          </span>
        </button>

        {changingPwd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.35 }}
            className="border-t border-charcoal/10 px-8 md:px-10 pb-8 md:pb-10 pt-6"
          >
            <form onSubmit={handlePwdSubmit(onChangePassword)} className="space-y-6" noValidate>
              <Input
                id="current-password"
                label="Current Password"
                type="password"
                placeholder="Your current password"
                error={pwdErrors.currentPassword?.message}
                {...regPwd('currentPassword', { required: 'Current password is required' })}
              />

              <div>
                <Input
                  id="new-password"
                  label="New Password"
                  type="password"
                  placeholder="Min 8 chars — letter, number & symbol"
                  error={pwdErrors.newPassword?.message}
                  {...regPwd('newPassword', {
                    required: 'New password is required',
                    validate: (v) =>
                      isPasswordStrong(v) || 'Must be 8+ chars with letter, number & symbol',
                  })}
                />
                <PasswordStrengthBar password={newPasswordValue} />
              </div>

              <Input
                id="confirm-password"
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                error={pwdErrors.confirmPassword?.message}
                {...regPwd('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === newPasswordValue || 'Passwords do not match',
                })}
              />

              {newPasswordValue && !isPasswordStrong(newPasswordValue) && (
                <div className="flex items-start gap-3 p-4 border border-amber-400/40 bg-amber-50">
                  <ShieldCheck size={15} strokeWidth={1.5} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    Your password is <strong>weak</strong>. Use at least 8 characters including a
                    letter, a number, and a symbol (e.g. @, !, #) for better security.
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={pwdSubmitting}
                  className="h-10 px-6 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-300 disabled:opacity-60 cursor-pointer"
                >
                  {pwdSubmitting ? 'Saving...' : 'Save Password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setChangingPwd(false); resetPwd(); }}
                  className="h-10 px-6 border border-charcoal/20 text-label text-warm-grey hover:border-charcoal hover:text-charcoal transition-colors duration-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>

      {/* Image Cropper Modal */}
      {rawImage && (
        <ImageCropper
          key={rawImage}
          isOpen={isCropperOpen}
          image={rawImage}
          aspectRatio={1}
          shape="circle"
          onClose={() => {
            setIsCropperOpen(false);
            setRawImage(null);
          }}
          onCrop={onCropComplete}
        />

      )}
    </div>
  );
}
