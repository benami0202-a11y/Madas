import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon?: ReactNode;
  colorClass?: string;
  trend?: string;
}

export function StatCard({ label, value, suffix = '', decimals = 0, icon, colorClass, trend }: StatCardProps) {
  const animated = useAnimatedCounter(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500 sm:text-sm dark:text-gray-400">{label}</p>
        {icon && (
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', colorClass ?? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400')}>
            {icon}
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-gray-50">
        {animated.toFixed(decimals)}
        <span className="ms-1 text-base font-semibold text-gray-400 dark:text-gray-500">{suffix}</span>
      </p>
      {trend && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{trend}</p>}
    </motion.div>
  );
}
