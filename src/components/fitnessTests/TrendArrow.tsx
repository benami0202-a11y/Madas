import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { TrendDirection } from '@/lib/selectors';
import { cn } from '@/lib/utils';

const CONFIG: Record<TrendDirection, { icon: typeof ArrowUp; className: string; label: string }> = {
  improved: { icon: ArrowUp, className: 'text-emerald-600 dark:text-emerald-400', label: 'שיפור' },
  same: { icon: Minus, className: 'text-gray-400', label: 'ללא שינוי' },
  declined: { icon: ArrowDown, className: 'text-red-500', label: 'ירידה' },
};

export function TrendArrow({ direction, showLabel }: { direction: TrendDirection; showLabel?: boolean }) {
  const { icon: Icon, className, label } = CONFIG[direction];
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-bold', className)}>
      <Icon size={14} />
      {showLabel && label}
    </span>
  );
}
