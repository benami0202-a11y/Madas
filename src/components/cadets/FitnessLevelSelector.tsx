import { motion } from 'framer-motion';
import type { FitnessLevel } from '@/types';
import { cn } from '@/lib/utils';

const OPTIONS: { level: FitnessLevel; label: string; letter: string; classes: string; active: string }[] = [
  { level: 'green', label: 'ירוק', letter: 'A', classes: 'border-green-200 text-green-700 dark:border-green-900 dark:text-green-400', active: 'bg-green-500 text-white border-green-500' },
  { level: 'yellow', label: 'צהוב', letter: 'B', classes: 'border-yellow-200 text-yellow-700 dark:border-yellow-900 dark:text-yellow-400', active: 'bg-yellow-500 text-white border-yellow-500' },
  { level: 'red', label: 'אדום', letter: 'C', classes: 'border-red-200 text-red-700 dark:border-red-900 dark:text-red-400', active: 'bg-red-500 text-white border-red-500' },
];

export function FitnessLevelSelector({ value, onChange }: { value: FitnessLevel; onChange: (level: FitnessLevel) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {OPTIONS.map((opt) => (
        <motion.button
          key={opt.level}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(opt.level)}
          className={cn(
            'flex flex-col items-center gap-1 rounded-2xl border-2 py-5 font-bold transition-colors',
            value === opt.level ? opt.active : cn('bg-white dark:bg-gray-900', opt.classes),
          )}
        >
          <span className="text-2xl">{opt.letter}</span>
          <span className="text-sm">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
