import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: Readonly<ModalProps>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-90 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-alabaster/95"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative z-10 bg-alabaster border border-charcoal/15 shadow-elevated w-full max-w-lg mx-4 p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              {title && (
                <h2 className="font-heading text-2xl text-charcoal">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto text-warm-grey hover:text-charcoal transition-colors duration-300 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
