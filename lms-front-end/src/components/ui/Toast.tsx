import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useToast } from '../../context/useToast';
import { clsx } from 'clsx';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  const iconColors = {
    success: 'border-l-success',
    error: 'border-l-error',
    info: 'border-l-gold',
  };

  return (
    <div className="fixed top-6 right-6 z-100 flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={clsx(
              'bg-alabaster border border-charcoal/10 shadow-elevated',
              'px-5 py-4 flex items-start gap-3',
              'border-l-[3px]',
              iconColors[toast.type],
            )}
          >
            <p className="text-sm font-body text-charcoal flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-warm-grey hover:text-charcoal transition-colors duration-300 shrink-0 mt-0.5"
              aria-label="Dismiss"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
