import { useState } from 'react';
import type { Cadet, ScoreEventType, Settings } from '@/types';
import { SCORE_EVENT_LABELS } from '@/types';
import { Button } from '@/components/ui/Button';

const MANUAL_TYPES: ScoreEventType[] = ['helping_friends', 'leadership', 'excellent_performance', 'improvement', 'manual'];

function pointsForType(type: ScoreEventType, rules: Settings['scoringRules']): number {
  switch (type) {
    case 'helping_friends':
      return rules.helpingFriends;
    case 'leadership':
      return rules.leadership;
    case 'excellent_performance':
      return rules.excellentPerformance;
    case 'improvement':
      return rules.improvement;
    default:
      return 5;
  }
}

export function AddScoreForm({
  cadets,
  settings,
  onSubmit,
  onCancel,
}: {
  cadets: Cadet[];
  settings: Settings;
  onSubmit: (values: { cadetId: string; type: ScoreEventType; points: number; note: string; date: string }) => void;
  onCancel: () => void;
}) {
  const [cadetId, setCadetId] = useState(cadets[0]?.id ?? '');
  const [type, setType] = useState<ScoreEventType>('helping_friends');
  const [points, setPoints] = useState(pointsForType('helping_friends', settings.scoringRules));
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ cadetId, type, points, note, date });
      }}
    >
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">חניך</label>
        <select value={cadetId} onChange={(e) => setCadetId(e.target.value)} className={inputClass}>
          {cadets.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">סוג אירוע</label>
          <select
            value={type}
            onChange={(e) => {
              const newType = e.target.value as ScoreEventType;
              setType(newType);
              setPoints(pointsForType(newType, settings.scoringRules));
            }}
            className={inputClass}
          >
            {MANUAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {SCORE_EVENT_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">נקודות</label>
          <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">תאריך</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">הערה</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" fullWidth>
          הוסף ניקוד
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
