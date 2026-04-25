import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function ProgressBar({
  value,
  showLabel = true,
  size = 'md',
  className,
}: Readonly<ProgressBarProps>) {
  const clamped = Math.min(100, Math.max(0, value));
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-overline">Progress</span>
          <span className="text-xs font-medium text-charcoal">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-taupe/50 border border-charcoal/10', sizeClasses[size])}>
        <motion.div
          className={clsx('h-full bg-gold', sizeClasses[size])}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
