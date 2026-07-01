import { cn } from '@/lib/utils';
import type { Team } from '@/types';
import { TEAM_COLORS } from '@/types';

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

export function Avatar({ name, team, size = 'md' }: { name: string; team: Team; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-9 w-9 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-20 w-20 text-xl' }[size];
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold ring-2',
        sizeClasses,
        TEAM_COLORS[team].bg,
        TEAM_COLORS[team].text,
        TEAM_COLORS[team].ring,
      )}
    >
      {initialsOf(name)}
    </div>
  );
}
