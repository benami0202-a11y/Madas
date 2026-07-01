import { Medal } from 'lucide-react';

const MEDAL_COLORS: Record<number, string> = {
  1: 'text-yellow-500',
  2: 'text-gray-400',
  3: 'text-orange-600',
};

export function MedalIcon({ rank }: { rank: number }) {
  if (rank > 3) return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
  return <Medal className={MEDAL_COLORS[rank]} size={22} />;
}
