import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Dumbbell } from 'lucide-react';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useTheme } from '@/hooks/useTheme';
import { Avatar } from '@/components/ui/Avatar';
import { TeamBadge } from '@/components/cadets/TeamBadge';

export function Header() {
  const { query, setQuery, results } = useGlobalSearch();
  const { theme, toggleTheme } = useTheme();
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showResults = focused && query.trim().length > 0;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 dark:border-gray-800 dark:bg-gray-900/90">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <Dumbbell size={18} />
        </div>
      </div>

      <div ref={containerRef} className="relative flex-1">
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="חיפוש חניך, צוות, רמת כושר..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pe-10 ps-3 text-sm outline-none ring-indigo-500 transition focus:ring-2 sm:max-w-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        {showResults && (
          <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl sm:max-w-sm dark:border-gray-700 dark:bg-gray-900">
            {results.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">לא נמצאו תוצאות</p>
            ) : (
              results.map(({ cadet, score, attendance }) => (
                <button
                  key={cadet.id}
                  onClick={() => {
                    navigate(`/cadets/${cadet.id}`);
                    setQuery('');
                    setFocused(false);
                  }}
                  className="flex w-full items-center gap-3 border-b border-gray-100 p-3 text-right last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                >
                  <Avatar name={cadet.fullName} team={cadet.team} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{cadet.fullName}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <TeamBadge team={cadet.team} />
                      <span className="text-xs text-gray-400">{attendance}% נוכחות</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <button
        onClick={toggleTheme}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label="החלף מצב תצוגה"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
