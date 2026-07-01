import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Cadet } from '@/types';
import { TEAM_COLORS } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { TeamBadge } from '@/components/cadets/TeamBadge';
import { FitnessLevelBadge } from '@/components/cadets/FitnessLevelBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function CadetCard({ cadet, score, attendance }: { cadet: Cadet; score: number; attendance: number }) {
  const navigate = useNavigate();
  const colors = TEAM_COLORS[cadet.team];

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/cadets/${cadet.id}`)}
      className={`flex flex-col gap-3 rounded-2xl border p-4 text-right shadow-sm transition-shadow hover:shadow-md ${colors.ring} border-transparent bg-white dark:bg-gray-900`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={cadet.fullName} team={cadet.team} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-gray-900 dark:text-gray-100">{cadet.fullName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <TeamBadge team={cadet.team} />
            <FitnessLevelBadge level={cadet.fitnessLevel} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-gray-50 py-2 dark:bg-gray-800/60">
          <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{score}</p>
          <p className="text-[11px] text-gray-400">ניקוד</p>
        </div>
        <div className="rounded-xl bg-gray-50 py-2 dark:bg-gray-800/60">
          <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{attendance}%</p>
          <p className="text-[11px] text-gray-400">נוכחות</p>
        </div>
      </div>
      <ProgressBar value={attendance} colorClass={colors.solid} />
    </motion.button>
  );
}
