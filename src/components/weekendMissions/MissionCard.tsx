import { useState } from 'react';
import { ChevronDown, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Cadet, WeekendMission } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { missionCompletionCount } from '@/lib/selectors';
import { formatDateHe, cn } from '@/lib/utils';

export function MissionCard({
  mission,
  cadets,
  onToggle,
  onEdit,
  onDelete,
}: {
  mission: WeekendMission;
  cadets: Cadet[];
  onToggle: (cadetId: string, completed: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const completed = missionCompletionCount(mission);
  const percent = cadets.length ? Math.round((completed / cadets.length) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{mission.title}</CardTitle>
          <p className="text-xs text-gray-400">שבוע {mission.weekNumber}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800">
            <Pencil size={16} />
          </button>
          <button onClick={onDelete} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800">
            <Trash2 size={16} />
          </button>
        </div>
      </CardHeader>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">{mission.description}</p>
      {mission.videoUrl && (
        <a
          href={mission.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          <ExternalLink size={14} />
          צפייה בסרטון הדרכה
        </a>
      )}
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          {completed}/{cadets.length} השלימו
        </span>
        <span className="font-bold text-teal-600 dark:text-teal-400">{percent}%</span>
      </div>
      <ProgressBar value={percent} colorClass="bg-teal-500" />

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-gray-50 py-2 text-xs font-semibold text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
      >
        {expanded ? 'הסתר רשימת חניכים' : 'הצג רשימת חניכים'}
        <ChevronDown size={14} className={cn('transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 max-h-64 space-y-1 overflow-y-auto">
          {cadets.map((cadet) => {
            const completion = mission.completions.find((c) => c.cadetId === cadet.id);
            return (
              <label
                key={cadet.id}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              >
                <div className="flex items-center gap-2">
                  <Avatar name={cadet.fullName} team={cadet.team} size="sm" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{cadet.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {completion?.completed && completion.completionDate && (
                    <span className="text-xs text-gray-400">{formatDateHe(completion.completionDate)}</span>
                  )}
                  <input
                    type="checkbox"
                    checked={completion?.completed ?? false}
                    onChange={(e) => onToggle(cadet.id, e.target.checked)}
                    className="h-5 w-5 rounded accent-teal-600"
                  />
                </div>
              </label>
            );
          })}
        </motion.div>
      )}
    </Card>
  );
}
