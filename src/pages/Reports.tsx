import { useMemo, useState } from 'react';
import { FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  cadetAttendancePercent,
  cadetAttendanceRecords,
  cadetTotalScore,
  cadetMissionsCompleted,
  testByPeriod,
  mostAbsences,
  mostImproved,
  needsAttention,
  mostActive,
  topCadetsByScore,
  weekNumberOf,
} from '@/lib/selectors';
import { exportToCSV, exportToExcel, exportToPDF, type ReportRow } from '@/lib/exporters';
import { formatSecondsToClock, cn } from '@/lib/utils';
import { TEAM_LABELS, FITNESS_LEVEL_LABELS } from '@/types';

type ReportKey = 'attendance' | 'fitness' | 'score' | 'training' | 'weekly' | 'commander';

const REPORT_TABS: { key: ReportKey; label: string }[] = [
  { key: 'attendance', label: 'דוח נוכחות' },
  { key: 'fitness', label: 'דוח כושר' },
  { key: 'score', label: 'דוח ניקוד' },
  { key: 'training', label: 'דוח אימונים' },
  { key: 'weekly', label: 'דוח שבועי' },
  { key: 'commander', label: 'תמונת מצב מפקדים' },
];

export default function Reports() {
  const data = useAppData();
  const [active, setActive] = useState<ReportKey>('attendance');

  const attendanceRows: ReportRow[] = useMemo(
    () =>
      data.cadets.map((c) => {
        const records = cadetAttendanceRecords(data, c.id);
        return {
          שם: c.fullName,
          צוות: TEAM_LABELS[c.team],
          'סה"כ אימונים': records.length,
          נוכח: records.filter((r) => r.status === 'present').length,
          מאזין: records.filter((r) => r.status === 'listener').length,
          פטור: records.filter((r) => r.status === 'medical').length,
          נעדר: records.filter((r) => r.status === 'absent').length,
          'אחוז נוכחות': `${cadetAttendancePercent(data, c.id)}%`,
        };
      }),
    [data],
  );

  const fitnessRows: ReportRow[] = useMemo(
    () =>
      data.cadets.map((c) => {
        const opening = testByPeriod(data, c.id, 'opening');
        const final = testByPeriod(data, c.id, 'final');
        return {
          שם: c.fullName,
          צוות: TEAM_LABELS[c.team],
          'רמת כושר': FITNESS_LEVEL_LABELS[c.fitnessLevel],
          '3 ק"מ פתיחה': opening ? formatSecondsToClock(opening.run3kmSeconds) : '—',
          '3 ק"מ סיום': final ? formatSecondsToClock(final.run3kmSeconds) : '—',
          'שיפור (שנ")': opening && final ? opening.run3kmSeconds - final.run3kmSeconds : 0,
        };
      }),
    [data],
  );

  const scoreRows: ReportRow[] = useMemo(
    () =>
      [...data.cadets]
        .map((c) => ({ c, score: cadetTotalScore(data, c.id) }))
        .sort((a, b) => b.score - a.score)
        .map(({ c, score }, i) => ({
          דירוג: i + 1,
          שם: c.fullName,
          צוות: TEAM_LABELS[c.team],
          ניקוד: score,
          'אחוז נוכחות': `${cadetAttendancePercent(data, c.id)}%`,
          "משימות סופ'ש": cadetMissionsCompleted(data, c.id),
        })),
    [data],
  );

  const trainingRows: ReportRow[] = useMemo(
    () =>
      data.trainingPlans.map((p) => ({
        שבוע: p.weekNumber,
        'תאריך התחלה': p.startDate,
        'תאריך סיום': p.endDate,
        מטרות: p.objectives,
        'סוגי אימון': p.trainingTypes.join(', '),
        הערות: p.notes,
      })),
    [data.trainingPlans],
  );

  const weeklyRows: ReportRow[] = useMemo(() => {
    const weeks = new Set<number>();
    for (const a of data.attendance) weeks.add(weekNumberOf(a.date, data.settings.courseStart));
    return Array.from(weeks)
      .sort((a, b) => a - b)
      .map((week) => {
        const weekAttendance = data.attendance.filter((a) => weekNumberOf(a.date, data.settings.courseStart) === week);
        const present = weekAttendance.filter((a) => a.status === 'present' || a.status === 'listener').length;
        const countable = weekAttendance.filter((a) => a.status !== 'medical').length;
        const mission = data.weekendMissions.find((m) => m.weekNumber === week);
        return {
          שבוע: week,
          'אחוז נוכחות': countable ? `${Math.round((present / countable) * 100)}%` : '—',
          "משימת סופ'ש": mission?.title ?? '—',
          'הושלמו משימה': mission ? mission.completions.filter((c) => c.completed).length : 0,
        };
      });
  }, [data]);

  const commanderLists = useMemo(
    () => ({
      strongest: topCadetsByScore(data, 5, false),
      weakest: topCadetsByScore(data, 5, true),
      improved: mostImproved(data, 5),
      attention: needsAttention(data, 5),
      absences: mostAbsences(data, 5),
      active: mostActive(data, 5),
    }),
    [data],
  );

  const rowsByReport: Record<ReportKey, ReportRow[]> = {
    attendance: attendanceRows,
    fitness: fitnessRows,
    score: scoreRows,
    training: trainingRows,
    weekly: weeklyRows,
    commander: [],
  };

  const titleByReport: Record<ReportKey, string> = {
    attendance: 'דוח נוכחות',
    fitness: 'דוח כושר',
    score: 'דוח ניקוד',
    training: 'דוח תוכנית אימונים',
    weekly: 'דוח שבועי',
    commander: 'תמונת מצב מפקדים',
  };

  const currentRows = rowsByReport[active];

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">דוחות</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">הפקת דוחות וייצוא לאקסל, PDF ו-CSV</p>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto">
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              active === tab.key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active !== 'commander' && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" icon={<FileSpreadsheet size={16} />} onClick={() => exportToExcel(titleByReport[active], titleByReport[active], currentRows)}>
            ייצוא לאקסל
          </Button>
          <Button size="sm" variant="secondary" icon={<FileDown size={16} />} onClick={() => exportToCSV(titleByReport[active], currentRows)}>
            ייצוא ל-CSV
          </Button>
          <Button size="sm" variant="secondary" icon={<FileText size={16} />} onClick={() => exportToPDF(titleByReport[active], currentRows)}>
            ייצוא ל-PDF
          </Button>
        </div>
      )}

      {active === 'commander' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <HighlightCard title="החניכים החזקים ביותר" items={commanderLists.strongest.map((h) => ({ name: h.cadet.fullName, value: `${h.value} נק'` }))} />
          <HighlightCard title="דורשים תשומת לב" items={commanderLists.weakest.map((h) => ({ name: h.cadet.fullName, value: `${h.value} נק'` }))} />
          <HighlightCard title="המשתפרים ביותר" items={commanderLists.improved.map((h) => ({ name: h.cadet.fullName, value: `${h.value} שנ' שיפור` }))} />
          <HighlightCard title="דורשים מעקב" items={commanderLists.attention.map((h) => ({ name: h.cadet.fullName, value: `ציון ${Math.round(h.value)}` }))} />
          <HighlightCard title="הכי הרבה היעדרויות" items={commanderLists.absences.map((h) => ({ name: h.cadet.fullName, value: `${h.value} היעדרויות` }))} />
          <HighlightCard title="הכי פעילים" items={commanderLists.active.map((h) => ({ name: h.cadet.fullName, value: `${h.value} פעילויות` }))} />
        </div>
      ) : (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800">
                  {currentRows[0] &&
                    Object.keys(currentRows[0]).map((col) => (
                      <th key={col} className="p-3 text-center font-semibold">
                        {col}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 dark:border-gray-800/60">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="p-3 text-center text-gray-700 dark:text-gray-300">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function HighlightCard({ title, items }: { title: string; items: { name: string; value: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {i + 1}
              </span>
              {item.name}
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.value}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
