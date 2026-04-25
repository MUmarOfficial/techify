import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'gold' | 'muted' | 'success' | 'error';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: Readonly<BadgeProps>) {
  const variants = {
    default: 'bg-charcoal text-white',
    gold: 'bg-gold/15 text-gold border border-gold/30',
    muted: 'bg-taupe text-warm-grey',
    success: 'bg-success/10 text-success border border-success/20',
    error: 'bg-error/10 text-error border border-error/20',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1',
        'text-[10px] font-semibold uppercase tracking-[0.15em]',
        'font-body',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
