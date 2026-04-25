import type { ReactNode, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'featured' | 'flat';
  hoverable?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  hoverable = false,
  className,
  ...props
}: Readonly<CardProps>) {
  const variants = {
    default: 'border-t border-charcoal/15',
    featured: 'border-t-[3px] border-t-gold',
    flat: 'bg-taupe/30',
  };

  return (
    <div
      className={clsx(
        'p-6 md:p-8 transition-all duration-500',
        variants[variant],
        hoverable && 'hover:bg-charcoal/2 hover:shadow-card cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
