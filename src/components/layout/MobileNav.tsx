import { NavLink } from 'react-router-dom';
import { MOBILE_NAV_ITEMS } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden dark:border-gray-800 dark:bg-gray-900/95">
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors',
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400',
            )
          }
        >
          <item.icon size={20} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
