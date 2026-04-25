import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: 'up' | 'down';
  change?: string;
  index?: number;
}

export default function StatCard({ label, value, trend, change, index = 0 }: Readonly<StatCardProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="border-t border-charcoal/15 pt-6 pb-4"
    >
      <p className="text-overline mb-3">{label}</p>

      <div className="flex items-end justify-between">
        <motion.span
          className="font-heading text-4xl md:text-5xl text-charcoal leading-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
        >
          {value}
        </motion.span>

        {trend && change && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-medium',
            trend === 'up' ? 'text-success' : 'text-error',
          )}>
            {trend === 'up' ? (
              <TrendingUp size={14} strokeWidth={1.5} />
            ) : (
              <TrendingDown size={14} strokeWidth={1.5} />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
