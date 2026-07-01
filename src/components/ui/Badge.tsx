import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeColor = 'gray' | 'green' | 'yellow' | 'red' | 'blue' | 'orange' | 'purple';

const COLOR_CLASSES: Record<BadgeColor, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
};

export function Badge({
  children,
  color = 'gray',
  className,
}: {
  children: ReactNode;
  color?: BadgeColor;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        COLOR_CLASSES[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
