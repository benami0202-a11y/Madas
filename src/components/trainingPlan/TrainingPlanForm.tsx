import { useState } from 'react';
import type { TrainingPlanWeek, TrainingType } from '@/types';
import { TRAINING_TYPE_LABELS } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const ALL_TYPES = Object.keys(TRAINING_TYPE_LABELS) as TrainingType[];

export function TrainingPlanForm({
  initial,
  nextWeekNumber,
  onSubmit,
  onCancel,
}: {
  initial?: TrainingPlanWeek;
  nextWeekNumber: number;
  onSubmit: (values: Omit<TrainingPlanWeek, 'id'>) => void;
  onCancel: () => void;
}) {
  const [weekNumber, setWeekNumber] = useState(initial?.weekNumber ?? nextWeekNumber);
  const [startDate, setStartDate] = useState(initial?.startDate ?? new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(initial?.endDate ?? new Date().toISOString().slice(0, 10));
  const [objectives, setObjectives] = useState(initial?.objectives ?? '');
  const [types, setTypes] = useState<TrainingType[]>(initial?.trainingTypes ?? []);
  const [notes, setNotes] = useState(initial?.notes ?? '');

  function toggleType(t: TrainingType) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ weekNumber, startDate, endDate, objectives, trainingTypes: types, notes });
      }}
    >
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">שבוע מס'</label>
          <input type="number" value={weekNumber} onChange={(e) => setWeekNumber(Number(e.target.value))} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">תחילת שבוע</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">סוף שבוע</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">מטרות השבוע</label>
        <input required value={objectives} onChange={(e) => setObjectives(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold text-gray-500">סוגי אימון</label>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => toggleType(t)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                types.includes(t) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
              )}
            >
              {TRAINING_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">הערות</label>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" fullWidth>
          שמירה
        </Button>
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          ביטול
        </Button>
      </div>
    </form>
  );
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';
