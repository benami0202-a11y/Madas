import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CalendarCheck,
  CalendarClock,
  Percent,
  Timer,
  Dumbbell,
  Activity,
  Trophy,
  Tent,
  Flame,
} from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { DonutChart } from '@/components/charts/DonutChart';
import { SimpleBarChart } from '@/components/charts/SimpleBarChart';
import { SimpleLineChart } from '@/components/charts/SimpleLineChart';
import { Avatar } from '@/components/ui/Avatar';
import {
  courseProgress,
  overallAttendancePercent,
  fitnessLevelDistribution,
  teamDistribution,
  totalMissionsCompleted,
  totalScore,
  weeklyAttendanceTrend,
  weeklyScoreTrend,
  latestTestPerCadet,
  averageMetrics,
} from '@/lib/selectors';
import { formatDateHe, formatSecondsToClock } from '@/lib/utils';
import { FITNESS_LEVEL_LABELS, TEAM_LABELS, SCORE_EVENT_LABELS } from '@/types';

export default function Dashboard() {
  const data = useAppData();

  const progress = useMemo(() => courseProgress(data.settings.courseStart, data.settings.courseEnd), [data.settings]);
  const attendancePct = useMemo(() => overallAttendancePercent(data), [data]);
  const levels = useMemo(() => fitnessLevelDistribution(data.cadets), [data.cadets]);
  const teams = useMemo(() => teamDistribution(data.cadets), [data.cadets]);
  const finalTests = useMemo(() => latestTestPerCadet(data, 'final'), [data]);
  const avgMetrics = useMemo(() => averageMetrics(finalTests), [finalTests]);
  const missionsCompleted = useMemo(() => totalMissionsCompleted(data), [data]);
  const score = useMemo(() => totalScore(data), [data]);
  const attendanceTrend = useMemo(() => weeklyAttendanceTrend(data), [data]);
  const scoreTrend = useMemo(() => weeklyScoreTrend(data), [data]);

  const recentActivity = useMemo(() => {
    const cadetName = (id: string) => data.cadets.find((c) => c.id === id)?.fullName ?? 'לא ידוע';
    const cadetTeam = (id: string) => data.cadets.find((c) => c.id === id)?.team ?? 'green';
    const items = [
      ...data.scores.map((s) => ({
        id: s.id,
        cadetId: s.cadetId,
        date: s.date,
        text: `${SCORE_EVENT_LABELS[s.type]} • ${s.note ?? ''} (${s.points > 0 ? '+' : ''}${s.points})`,
      })),
    ];
    return items
      .filter((i) => /^\d{4}-\d{2}-\d{2}$/.test(i.date))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8)
      .map((i) => ({ ...i, cadetName: cadetName(i.cadetId), team: cadetTeam(i.cadetId) }));
  }, [data]);

  const teamBarData = (Object.keys(teams) as (keyof typeof teams)[]).map((team) => ({
    name: TEAM_LABELS[team],
    value: teams[team],
  }));

  return (
    <div className="animate-fade-in space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-gray-50">לוח בקרה</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDateHe(new Date().toISOString().slice(0, 10))} · יום {progress.passedDays} מתוך {progress.totalDays} בקורס
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="ימים שחלפו" value={progress.passedDays} icon={<CalendarCheck size={18} />} />
        <StatCard label="ימים שנותרו" value={progress.remainingDays} icon={<CalendarClock size={18} />} colorClass="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" />
        <StatCard label="אחוז נוכחות כולל" value={attendancePct} suffix="%" icon={<Percent size={18} />} colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" />
        <StatCard label='סה"כ חניכים' value={data.cadets.length} icon={<Users size={18} />} colorClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" />
        <StatCard label="רמת כושר ירוקה" value={levels.green} icon={<Activity size={18} />} colorClass="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" />
        <StatCard label="רמת כושר צהובה" value={levels.yellow} icon={<Activity size={18} />} colorClass="bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400" />
        <StatCard label="רמת כושר אדומה" value={levels.red} icon={<Activity size={18} />} colorClass="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" />
        <StatCard label='סה"כ ניקוד' value={score} icon={<Trophy size={18} />} colorClass="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label='ממוצע ריצת 3 ק"מ' value={avgMetrics.run3km} decimals={0} icon={<Timer size={16} />} trend={formatSecondsToClock(avgMetrics.run3km)} />
        <StatCard label="ממוצע שכיבות סמיכה" value={avgMetrics.pushups} icon={<Dumbbell size={16} />} />
        <StatCard label="ממוצע עליות מתח" value={avgMetrics.pullups} decimals={1} icon={<Dumbbell size={16} />} />
        <StatCard label='ממוצע פלאנק (שנ")' value={avgMetrics.plank} icon={<Flame size={16} />} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label='משימות סופ"ש שהושלמו' value={missionsCompleted} icon={<Tent size={18} />} colorClass="bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400" />
        <StatCard label="ימים שחלפו מתוך הקורס (%)" value={progress.percent} suffix="%" icon={<CalendarClock size={18} />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>התפלגות רמות כושר</CardTitle>
          </CardHeader>
          <DonutChart
            data={[
              { name: FITNESS_LEVEL_LABELS.green, value: levels.green, color: '#22c55e' },
              { name: FITNESS_LEVEL_LABELS.yellow, value: levels.yellow, color: '#eab308' },
              { name: FITNESS_LEVEL_LABELS.red, value: levels.red, color: '#ef4444' },
            ]}
          />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>חניכים לפי צוות</CardTitle>
          </CardHeader>
          <SimpleBarChart data={teamBarData} color="#6366f1" />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>מגמת נוכחות שבועית</CardTitle>
          </CardHeader>
          <SimpleLineChart data={attendanceTrend} color="#10b981" unit="%" />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>מגמת ניקוד מצטבר</CardTitle>
          </CardHeader>
          <SimpleLineChart data={scoreTrend} color="#f59e0b" />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>פעילות אחרונה</CardTitle>
          </CardHeader>
          <div className="scrollbar-none max-h-72 space-y-3 overflow-y-auto">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <Avatar name={item.cadetName} team={item.team} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{item.cadetName}</p>
                  <p className="truncate text-xs text-gray-400">{item.text}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">{formatDateHe(item.date)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
