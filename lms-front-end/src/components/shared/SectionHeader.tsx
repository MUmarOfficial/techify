import { motion } from 'framer-motion';

interface SectionHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  overline,
  title,
  subtitle,
  align = 'left',
  className = '',
}: Readonly<SectionHeaderProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
    >
      {overline && (
        <div className={`flex items-center gap-4 mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="h-px w-8 bg-gold" />
          <span className="text-overline text-gold">{overline}</span>
        </div>
      )}

      <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-charcoal leading-[1.1] mb-4">
        {title}
      </h2>

      {subtitle && (
        <p className="text-base md:text-lg text-warm-grey max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
