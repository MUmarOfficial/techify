import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import Input from '../../components/ui/Input';
import PasswordStrengthBar from '../../components/ui/PasswordStrengthBar';
import { isPasswordStrong } from '../../utils/passwordStrength';
import { ROUTES, ROLES } from '../../constants';
import type { RegisterPayload } from '../../types';

const dashboardLink = {
  [ROLES.STUDENT]: ROUTES.DASHBOARD.STUDENT.HOME,
  [ROLES.INSTRUCTOR]: ROUTES.DASHBOARD.INSTRUCTOR.HOME,
  [ROLES.ADMIN]: ROUTES.DASHBOARD.ADMIN.HOME,
};

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload & { confirmPassword: string }>({
    defaultValues: { role: 'student' },
  });

  const selectedRole = useWatch({ control, name: 'role' });
  const passwordValue = useWatch({ control, name: 'password' });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(dashboardLink[user.role], { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: RegisterPayload & { confirmPassword: string }) => {
    const payload = { ...data };
    delete (payload as Partial<typeof payload>).confirmPassword;

    try {
      await registerUser(payload);
      addToast('success', 'Account created! Welcome to Techify.');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Registration failed';
      addToast('error', msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left — Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://img.freepik.com/fotos-premium/curandeiro-cyborg-doutor-retrato-digital_998274-16309.jpg?w=900&fit=crop"
          alt="Start learning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/65" />
        <div className="absolute bottom-16 left-16 right-16">
          <p className="font-heading text-3xl text-white leading-tight mb-4">
            Begin your journey<br />with{' '}
            <em className="not-italic text-gold">Techify</em>
          </p>
          <p className="text-sm text-white/60">Join thousands of engineers mastering modern technology.</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-8 h-8 bg-charcoal flex items-center justify-center">
              <Zap size={16} strokeWidth={2} className="text-white" />
            </div>
            <span className="font-body font-bold text-sm tracking-[0.25em] uppercase">Techify</span>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-8 bg-gold" />
              <span className="text-overline text-gold">Create Account</span>
            </div>
            <h1 className="font-heading text-4xl text-charcoal">Join Techify</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
            <Input
              id="reg-name"
              label="Full Name"
              type="text"
              placeholder="Your full name"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Min 2 characters' },
              })}
            />
            <Input
              id="reg-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
              })}
            />
            <div>
              <Input
                id="reg-password"
                label="Password"
                type="password"
                placeholder="Min 8 chars — letter, number & symbol"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  validate: (v) =>
                    isPasswordStrong(v) ||
                    'Must be 8+ chars with a letter, a number & a symbol',
                })}
              />
              <PasswordStrengthBar password={passwordValue ?? ''} />
            </div>
            <Input
              id="reg-confirm"
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                validate: (v) => v === passwordValue || 'Passwords do not match',
              })}
            />

            {/* Role Select */}
            <div>
              <span className="text-label text-warm-grey block mb-2">I am a...</span>
              <div className="flex gap-3">
                {([ROLES.STUDENT, ROLES.INSTRUCTOR] as const).map((role) => (

                  <label key={role} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      value={role}
                      className="sr-only"
                      {...register('role')}
                    />
                    <div
                      className={`px-4 py-3 border text-xs font-semibold uppercase tracking-[0.15em] text-center transition-all duration-300 ${selectedRole === role
                          ? 'bg-charcoal text-white border-charcoal'
                          : 'border-charcoal/20 text-warm-grey hover:border-charcoal hover:text-charcoal'
                        }`}
                    >
                      {role}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-500 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-sm text-warm-grey">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-charcoal hover:text-gold transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
