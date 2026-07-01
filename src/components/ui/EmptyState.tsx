import type { ReactNode } from 'react';

export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
      {icon && <div className="mb-1 text-gray-300 dark:text-gray-600">{icon}</div>}
      <p className="font-semibold text-gray-700 dark:text-gray-300">{title}</p>
      {description && <p className="max-w-xs text-sm text-gray-400 dark:text-gray-500">{description}</p>}
    </div>
  );
}
