import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
}

export default function Skeleton({
  className,
  variant = 'rect',
  count = 1,
}: Readonly<SkeletonProps>) {
  const baseClasses = 'bg-taupe/50 animate-pulse';

  const variantClasses = {
    text: 'h-4 w-full rounded-none',
    rect: 'h-48 w-full rounded-none',
    circle: 'w-10 h-10 rounded-full',
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={clsx(baseClasses, variantClasses[variant], className)}
        />
      ))}
    </>
  );
}
