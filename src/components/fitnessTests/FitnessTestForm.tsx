import { useEffect, useState } from 'react';
import type { FitnessTestResult, TestPeriod } from '@/types';
import { Button } from '@/components/ui/Button';

interface FitnessTestFormProps {
  cadetId: string;
  period: TestPeriod;
  existing?: FitnessTestResult;
  onSubmit: (values: Omit<FitnessTestResult, 'id'>) => void;
}

function secondsFromClock(clock: string): number {
  const [m, s] = clock.split(':').map(Number);
  return (m || 0) * 60 + (s || 0);
}

function clockFromSeconds(seconds: number | undefined): string {
  if (seconds === undefined) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function FitnessTestForm({ cadetId, period, existing, onSubmit }: FitnessTestFormProps) {
  const [run3km, setRun3km] = useState(clockFromSeconds(existing?.run3kmSeconds));
  const [plank, setPlank] = useState(clockFromSeconds(existing?.plankSeconds));
  const [pushups, setPushups] = useState(existing?.pushups?.toString() ?? '');
  const [pullups, setPullups] = useState(existing?.pullups?.toString() ?? '');
  const [burpees, setBurpees] = useState(existing?.burpees?.toString() ?? '');
  const [date, setDate] = useState(existing?.date ?? new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setRun3km(clockFromSeconds(existing?.run3kmSeconds));
    setPlank(clockFromSeconds(existing?.plankSeconds));
    setPushups(existing?.pushups?.toString() ?? '');
    setPullups(existing?.pullups?.toString() ?? '');
    setBurpees(existing?.burpees?.toString() ?? '');
    setDate(existing?.date ?? new Date().toISOString().slice(0, 10));
  }, [existing, period]);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          cadetId,
          period,
          date,
          run3kmSeconds: secondsFromClock(run3km || '0:00'),
          pushups: Number(pushups) || 0,
          pullups: Number(pullups) || 0,
          plankSeconds: secondsFromClock(plank || '0:00'),
          burpees: burpees ? Number(burpees) : undefined,
        });
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="תאריך מבחן">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </Field>
        <Field label='ריצת 3 ק"מ (מ:ש)'>
          <input value={run3km} onChange={(e) => setRun3km(e.target.value)} placeholder="13:30" className={inputClass} />
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="שכיבות סמיכה">
          <input value={pushups} onChange={(e) => setPushups(e.target.value)} inputMode="numeric" className={inputClass} />
        </Field>
        <Field label="עליות מתח">
          <input value={pullups} onChange={(e) => setPullups(e.target.value)} inputMode="numeric" className={inputClass} />
        </Field>
        <Field label="ברפיז">
          <input value={burpees} onChange={(e) => setBurpees(e.target.value)} inputMode="numeric" className={inputClass} />
        </Field>
      </div>
      <Field label='פלאנק (מ:ש)'>
        <input value={plank} onChange={(e) => setPlank(e.target.value)} placeholder="2:30" className={inputClass} />
      </Field>
      <Button type="submit" fullWidth>
        שמור תוצאות
      </Button>
    </form>
  );
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</label>
      {children}
    </div>
  );
}
