import { clsx } from 'clsx';
import { getMediaUrl } from '../../utils/url';

interface AvatarProps {
  name: string;
  src?: string;        // base64 data URL or external URL
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ name, src, size = 'md', className }: Readonly<AvatarProps>) {
  const mediaUrl = getMediaUrl(src);
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center shrink-0',
        'bg-charcoal text-white font-heading font-medium',
        'border border-charcoal',
        'rounded-full overflow-hidden',
        sizeClasses[size],
        className,
      )}
      aria-label={name}
    >
      {src ? (
        <img
          src={mediaUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (

        getInitials(name)
      )}
    </div>
  );
}
