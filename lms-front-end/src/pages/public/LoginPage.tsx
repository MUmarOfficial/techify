import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import Input from '../../components/ui/Input';
import type { LoginPayload } from '../../types';

import { ROUTES } from '../../constants';

const dashboardLink = {
  student: ROUTES.DASHBOARD.STUDENT.HOME,
  instructor: ROUTES.DASHBOARD.INSTRUCTOR.HOME,
  admin: ROUTES.DASHBOARD.ADMIN.HOME,
};

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(dashboardLink[user.role], { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: LoginPayload) => {
    try {
      await login(data);
      addToast('success', 'Welcome back!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid credentials';
      addToast('error', msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left — Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.stockcake.com/public/0/7/2/072bbebb-8513-4b6a-9713-6d18f37990da/futuristic-robot-sentinel-stockcake.jpg"
          alt="Technology learning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute bottom-16 left-16 right-16">
          <p className="font-heading text-3xl text-white leading-tight mb-4">
            Welcome back to<br />
            <em className="not-italic text-gold">Techify</em>
          </p>
          <p className="text-sm text-white/60">Continue your learning journey.</p>
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
              <span className="text-overline text-gold">Sign In</span>
            </div>
            <h1 className="font-heading text-4xl text-charcoal">Access your account</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
              })}
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="Your password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Min 6 characters' },
              })}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-charcoal text-white text-label hover:bg-gold hover:text-charcoal transition-colors duration-500 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-sm text-warm-grey">
            No account?{' '}
            <Link to={ROUTES.REGISTER} className="text-charcoal hover:text-gold transition-colors duration-300">
              Create one free
            </Link>

          </p>
        </motion.div>
      </div>
    </div>
  );
}
