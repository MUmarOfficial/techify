import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({
  title = 'Nothing here yet',
  message,
  action,
}: Readonly<EmptyStateProps>) {
  return (
    <div className="py-20 text-center">
      <h3 className="font-heading text-2xl text-charcoal mb-3">{title}</h3>
      <p className="text-sm text-warm-grey max-w-md mx-auto leading-relaxed mb-6">
        {message}
      </p>
      {action}
    </div>
  );
}
