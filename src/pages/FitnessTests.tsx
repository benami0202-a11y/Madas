import { useMemo, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useFitnessTests } from '@/hooks/useFitnessTests';
import { useCadets } from '@/hooks/useCadets';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { FitnessTestForm } from '@/components/fitnessTests/FitnessTestForm';
import { FitnessTestComparison } from '@/components/fitnessTests/FitnessTestComparison';
import { Avatar } from '@/components/ui/Avatar';
import { TeamBadge } from '@/components/cadets/TeamBadge';
import { averageMetrics } from '@/lib/selectors';
import { formatSecondsToClock, cn } from '@/lib/utils';
import { TEST_PERIOD_LABELS, type TestPeriod } from '@/types';

const PERIODS: TestPeriod[] = ['opening', 'middle', 'final'];

export default function FitnessTests() {
  const { fitnessTests, upsertFitnessTest } = useFitnessTests();
  const { cadets } = useCadets();
  const [period, setPeriod] = useState<TestPeriod>('opening');
  const [editingCadetId, setEditingCadetId] = useState<string | null>(null);
  const [compareCadetId, setCompareCadetId] = useState<string>(cadets[0]?.id ?? '');

  const periodTests = useMemo(() => fitnessTests.filter((t) => t.period === period), [fitnessTests, period]);
  const avg = useMemo(() => averageMetrics(periodTests), [periodTests]);

  const editingCadet = cadets.find((c) => c.id === editingCadetId);
  const editingResult = periodTests.find((t) => t.cadetId === editingCadetId);

  const compareCadet = cadets.find((c) => c.id === compareCadetId);
  const compareTests = useMemo(() => {
    const map: Partial<Record<TestPeriod, (typeof fitnessTests)[number]>> = {};
    for (const t of fitnessTests) if (t.cadetId === compareCadetId) map[t.period] = t;
    return map;
  }, [fitnessTests, compareCadetId]);

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">מבחני כושר</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">מבחן פתיחה, אמצע וסיום - מעקב שיפור אוטומטי</p>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              period === p ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700',
            )}
          >
            {TEST_PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label='ממוצע 3 ק"מ' value={formatSecondsToClock(avg.run3km)} />
        <MiniStat label="ממוצע שכיבות" value={avg.pushups.toString()} />
        <MiniStat label="ממוצע מתח" value={avg.pullups.toString()} />
        <MiniStat label="ממוצע פלאנק" value={formatSecondsToClock(avg.plank)} />
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800">
                <th className="p-3 text-right font-semibold">חניך</th>
                <th className="p-3 text-center font-semibold">3 ק"מ</th>
                <th className="p-3 text-center font-semibold">שכיבות</th>
                <th className="p-3 text-center font-semibold">מתח</th>
                <th className="p-3 text-center font-semibold">פלאנק</th>
                <th className="p-3 text-center font-semibold">ברפיז</th>
                <th className="p-3 text-center font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {cadets.map((cadet) => {
                const t = periodTests.find((r) => r.cadetId === cadet.id);
                return (
                  <tr key={cadet.id} className="border-b border-gray-50 last:border-0 dark:border-gray-800/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={cadet.fullName} team={cadet.team} size="sm" />
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{cadet.fullName}</p>
                          <TeamBadge team={cadet.team} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-gray-800 dark:text-gray-200">{t ? formatSecondsToClock(t.run3kmSeconds) : '—'}</td>
                    <td className="p-3 text-center">{t?.pushups ?? '—'}</td>
                    <td className="p-3 text-center">{t?.pullups ?? '—'}</td>
                    <td className="p-3 text-center">{t ? formatSecondsToClock(t.plankSeconds) : '—'}</td>
                    <td className="p-3 text-center">{t?.burpees ?? '—'}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setEditingCadetId(cadet.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>השוואת מגמה אישית</CardTitle>
        </CardHeader>
        <select
          value={compareCadetId}
          onChange={(e) => setCompareCadetId(e.target.value)}
          className="mb-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          {cadets.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </select>
        <FitnessTestComparison tests={compareTests} />
      </Card>

      <Modal open={!!editingCadetId} onClose={() => setEditingCadetId(null)} title={`${editingCadet?.fullName ?? ''} · ${TEST_PERIOD_LABELS[period]}`}>
        {editingCadetId && (
          <FitnessTestForm
            cadetId={editingCadetId}
            period={period}
            existing={editingResult}
            onSubmit={(values) => {
              upsertFitnessTest({ ...values, id: editingResult?.id });
              setEditingCadetId(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-3 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="text-lg font-extrabold text-gray-900 dark:text-gray-50">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
