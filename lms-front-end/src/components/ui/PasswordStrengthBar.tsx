import { motion } from 'framer-motion';
import { getPasswordStrength } from '../../utils/passwordStrength';

interface PasswordStrengthBarProps {
  password: string;
}

export default function PasswordStrengthBar({ password }: Readonly<PasswordStrengthBarProps>) {
  if (!password) return null;

  const { score, label, color } = getPasswordStrength(password);

  const segments = [0, 1, 2, 3] as const;

  const segmentColor = (idx: number): string => {
    if (idx >= score) return 'bg-charcoal/10';
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-amber-500';
    return 'bg-green-600';
  };

  return (
    <div className="mt-2 space-y-1.5">
      {/* Segments */}
      <div className="flex gap-1.5">
        {segments.map((idx) => (
          <motion.div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-colors duration-400 ${segmentColor(idx)}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            style={{ transformOrigin: 'left' }}
          />
        ))}
      </div>

      {/* Label + hint */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color }}>
          {label}
        </span>
        {score < 3 && (
          <span className="text-xs text-warm-grey/70">
            {score === 0 && 'Add 8+ chars, letter, number & symbol'}
            {score === 1 && 'Add a number & symbol'}
            {score === 2 && 'Add a symbol (e.g. @, !, #)'}
          </span>
        )}
      </div>
    </div>
  );
}
