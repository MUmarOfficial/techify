import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className,
  disabled,
  ...props
}: Readonly<ButtonProps>) {
  const sizeClasses = {
    sm: 'h-10 px-6 text-[10px]',
    md: 'h-12 px-8 text-xs',
    lg: 'h-14 px-10 text-xs',
  };

  const base = clsx(
    'relative overflow-hidden inline-flex items-center justify-center',
    'font-body font-medium uppercase tracking-[0.2em]',
    'transition-all duration-500 ease-out cursor-pointer',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size],
  );

  const variants = {
    primary: 'bg-charcoal text-white shadow-button hover:shadow-button-hover',
    secondary: 'bg-transparent border border-charcoal text-charcoal hover:bg-charcoal hover:text-white',
    ghost: 'bg-transparent text-charcoal hover:text-gold',
  };

  return (
    <motion.button
      type={props.type ?? 'button'}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={clsx(base, variants[variant], className)}
      disabled={disabled || isLoading}
      onClick={props.onClick}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      id={props.id}
      name={props.name}
      form={props.form}
      aria-label={props['aria-label']}
    >
      {/* Gold overlay for primary */}
      {variant === 'primary' && (
        <span
          className="absolute inset-0 bg-gold -translate-x-full hover-target transition-transform duration-500 ease-out"
          aria-hidden="true"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </span>
    </motion.button>
  );
}
