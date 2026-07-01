import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScores } from '@/hooks/useScores';
import { useCadets } from '@/hooks/useCadets';
import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AddScoreForm } from '@/components/scoreboard/AddScoreForm';
import { MedalIcon } from '@/components/scoreboard/MedalIcon';
import { Avatar } from '@/components/ui/Avatar';
import { TeamBadge } from '@/components/cadets/TeamBadge';
import { cn } from '@/lib/utils';

export default function Scoreboard() {
  const { leaderboard, addScore } = useScores();
  const { cadets } = useCadets();
  const { settings } = useSettings();
  const [addingScore, setAddingScore] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">טבלת ניקוד</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">דירוג חניכים לפי ניקוד, נוכחות ושיפור</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setAddingScore(true)}>
          הוסף ניקוד ידני
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {leaderboard.slice(0, 3).map((row, i) => (
          <motion.button
            key={row.cadet.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/cadets/${row.cadet.id}`)}
            className={cn(
              'flex items-center gap-3 rounded-2xl border p-4 text-right shadow-sm',
              i === 0 && 'border-yellow-300 bg-yellow-50 dark:border-yellow-500/40 dark:bg-yellow-500/10',
              i === 1 && 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/40',
              i === 2 && 'border-orange-300 bg-orange-50 dark:border-orange-500/40 dark:bg-orange-500/10',
            )}
          >
            <MedalIcon rank={row.rank} />
            <Avatar name={row.cadet.fullName} team={row.cadet.team} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-gray-900 dark:text-gray-100">{row.cadet.fullName}</p>
              <TeamBadge team={row.cadet.team} />
            </div>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{row.score}</span>
          </motion.button>
        ))}
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800">
                <th className="p-3 text-center font-semibold">דירוג</th>
                <th className="p-3 text-right font-semibold">חניך</th>
                <th className="p-3 text-center font-semibold">ניקוד</th>
                <th className="p-3 text-center font-semibold">נוכחות</th>
                <th className="p-3 text-center font-semibold">שיפור (שנ')</th>
                <th className="p-3 text-center font-semibold">משימות</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row) => (
                <tr
                  key={row.cadet.id}
                  onClick={() => navigate(`/cadets/${row.cadet.id}`)}
                  className="cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50 dark:border-gray-800/60 dark:hover:bg-gray-800/40"
                >
                  <td className="p-3 text-center">
                    <MedalIcon rank={row.rank} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={row.cadet.fullName} team={row.cadet.team} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{row.cadet.fullName}</p>
                        <TeamBadge team={row.cadet.team} />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center text-base font-extrabold text-indigo-600 dark:text-indigo-400">{row.score}</td>
                  <td className="p-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">{row.attendance}%</td>
                  <td className={cn('p-3 text-center font-semibold', row.improvementSeconds >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                    {row.improvementSeconds > 0 ? '+' : ''}
                    {row.improvementSeconds}
                  </td>
                  <td className="p-3 text-center">{row.missionsCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={addingScore} onClose={() => setAddingScore(false)} title="הוספת ניקוד ידני">
        <AddScoreForm
          cadets={cadets}
          settings={settings}
          onSubmit={(values) => {
            addScore(values);
            setAddingScore(false);
          }}
          onCancel={() => setAddingScore(false)}
        />
      </Modal>
    </div>
  );
}
