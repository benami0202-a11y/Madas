import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Dumbbell } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function Sidebar() {
  const { settings } = useSettings();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-l border-gray-200 bg-white lg:flex dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 dark:border-gray-800">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
          <Dumbbell size={22} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-extrabold text-gray-900 dark:text-gray-50">{settings.appName}</h1>
          <p className="truncate text-xs text-gray-400">{settings.subtitle}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4 dark:border-gray-800">
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{settings.adminName}</p>
          <p className="text-xs text-gray-400">{settings.adminRole}</p>
        </div>
      </div>
    </aside>
  );
}
