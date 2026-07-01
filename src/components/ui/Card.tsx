import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  noPadding?: boolean;
}

export function Card({ children, className, noPadding, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
        !noPadding && 'p-4 sm:p-5',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-3 flex items-center justify-between gap-2', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-base font-bold text-gray-900 dark:text-gray-100', className)}>{children}</h3>;
}
