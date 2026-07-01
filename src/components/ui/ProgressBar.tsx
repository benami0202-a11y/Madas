import { cn } from '@/lib/utils';

export function ProgressBar({
  value,
  className,
  colorClass = 'bg-indigo-600',
  trackClass,
  height = 'h-2',
}: {
  value: number;
  className?: string;
  colorClass?: string;
  trackClass?: string;
  height?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800', height, trackClass, className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700 ease-out', colorClass)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
