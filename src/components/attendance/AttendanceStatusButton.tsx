import type { AttendanceStatus } from '@/types';
import { cn } from '@/lib/utils';

const CONFIG: Record<AttendanceStatus, { label: string; active: string; idle: string }> = {
  present: {
    label: 'נוכח',
    active: 'bg-emerald-500 text-white border-emerald-500',
    idle: 'border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-400',
  },
  listener: {
    label: 'מאזין',
    active: 'bg-blue-500 text-white border-blue-500',
    idle: 'border-blue-200 text-blue-700 dark:border-blue-900 dark:text-blue-400',
  },
  medical: {
    label: 'פטור',
    active: 'bg-gray-500 text-white border-gray-500',
    idle: 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300',
  },
  absent: {
    label: 'נעדר',
    active: 'bg-red-500 text-white border-red-500',
    idle: 'border-red-200 text-red-700 dark:border-red-900 dark:text-red-400',
  },
};

export function AttendanceStatusButton({
  status,
  active,
  points,
  onClick,
}: {
  status: AttendanceStatus;
  active: boolean;
  points: number;
  onClick: () => void;
}) {
  const cfg = CONFIG[status];
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 flex-col items-center gap-0.5 rounded-xl border-2 py-2.5 text-xs font-bold transition-colors sm:text-sm',
        active ? cfg.active : cn('bg-white dark:bg-gray-900', cfg.idle),
      )}
    >
      {cfg.label}
      <span className="text-[10px] font-medium opacity-80">
        {points > 0 ? '+' : ''}
        {points}
      </span>
    </button>
  );
}
