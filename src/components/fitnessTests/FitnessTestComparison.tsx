import type { FitnessTestResult } from '@/types';
import { TEST_PERIOD_LABELS } from '@/types';
import { compareMetric } from '@/lib/selectors';
import { formatSecondsToClock } from '@/lib/utils';
import { TrendArrow } from '@/components/fitnessTests/TrendArrow';

interface Row {
  label: string;
  key: keyof Pick<FitnessTestResult, 'run3kmSeconds' | 'pushups' | 'pullups' | 'plankSeconds' | 'burpees'>;
  higherIsBetter: boolean;
  format: (v: number) => string;
}

const ROWS: Row[] = [
  { label: 'ריצת 3 ק"מ', key: 'run3kmSeconds', higherIsBetter: false, format: formatSecondsToClock },
  { label: 'שכיבות סמיכה', key: 'pushups', higherIsBetter: true, format: (v) => `${v}` },
  { label: 'עליות מתח', key: 'pullups', higherIsBetter: true, format: (v) => `${v}` },
  { label: 'פלאנק', key: 'plankSeconds', higherIsBetter: true, format: formatSecondsToClock },
  { label: 'ברפיז', key: 'burpees', higherIsBetter: true, format: (v) => `${v}` },
];

export function FitnessTestComparison({ tests }: { tests: Partial<Record<'opening' | 'middle' | 'final', FitnessTestResult>> }) {
  const periods = (['opening', 'middle', 'final'] as const).filter((p) => tests[p]);

  if (periods.length === 0) {
    return <p className="p-4 text-center text-sm text-gray-400">אין נתוני מבחני כושר עדיין</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800">
            <th className="py-2 text-right font-semibold">מדד</th>
            {periods.map((p) => (
              <th key={p} className="py-2 text-center font-semibold">
                {TEST_PERIOD_LABELS[p]}
              </th>
            ))}
            {periods.length > 1 && <th className="py-2 text-center font-semibold">מגמה</th>}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const values = periods.map((p) => tests[p]?.[row.key]).filter((v): v is number => v !== undefined);
            if (values.length === 0) return null;
            const first = periods.map((p) => tests[p]?.[row.key]).find((v) => v !== undefined);
            const last = [...periods].reverse().map((p) => tests[p]?.[row.key]).find((v) => v !== undefined);
            return (
              <tr key={row.key} className="border-b border-gray-50 last:border-0 dark:border-gray-800/60">
                <td className="py-2.5 font-medium text-gray-700 dark:text-gray-300">{row.label}</td>
                {periods.map((p) => {
                  const v = tests[p]?.[row.key];
                  return (
                    <td key={p} className="py-2.5 text-center font-bold text-gray-900 dark:text-gray-100">
                      {v !== undefined ? row.format(v) : '—'}
                    </td>
                  );
                })}
                {periods.length > 1 && first !== undefined && last !== undefined && (
                  <td className="py-2.5 text-center">
                    <TrendArrow direction={compareMetric(first, last, row.higherIsBetter)} />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
