import type {
  AppData,
  AttendanceRecord,
  Cadet,
  FitnessLevel,
  FitnessTestResult,
  ScoreEntry,
  Team,
  TestPeriod,
  WeekendMission,
} from '@/types';
import { average, round } from '@/lib/utils';

export function cadetAttendanceRecords(data: AppData, cadetId: string): AttendanceRecord[] {
  return data.attendance.filter((a) => a.cadetId === cadetId);
}

export function attendancePercent(records: AttendanceRecord[]): number {
  if (records.length === 0) return 0;
  const countable = records.filter((r) => r.status !== 'medical');
  if (countable.length === 0) return 100;
  const present = countable.filter((r) => r.status === 'present' || r.status === 'listener').length;
  return round((present / countable.length) * 100, 0);
}

export function cadetAttendancePercent(data: AppData, cadetId: string): number {
  return attendancePercent(cadetAttendanceRecords(data, cadetId));
}

export function overallAttendancePercent(data: AppData): number {
  return attendancePercent(data.attendance);
}

export function cadetScoreEntries(data: AppData, cadetId: string): ScoreEntry[] {
  return data.scores.filter((s) => s.cadetId === cadetId);
}

export function cadetTotalScore(data: AppData, cadetId: string): number {
  return cadetScoreEntries(data, cadetId).reduce((sum, s) => sum + s.points, 0);
}

export function totalScore(data: AppData): number {
  return data.scores.reduce((sum, s) => sum + s.points, 0);
}

export function cadetFitnessTests(data: AppData, cadetId: string): FitnessTestResult[] {
  return data.fitnessTests
    .filter((t) => t.cadetId === cadetId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function testByPeriod(data: AppData, cadetId: string, period: TestPeriod): FitnessTestResult | undefined {
  return data.fitnessTests.find((t) => t.cadetId === cadetId && t.period === period);
}

export type TrendDirection = 'improved' | 'same' | 'declined';

/** Lower is better for run/plank isn't true for plank (higher=better); this handles both directions. */
export function compareMetric(previous: number, current: number, higherIsBetter: boolean): TrendDirection {
  if (previous === current) return 'same';
  const better = higherIsBetter ? current > previous : current < previous;
  return better ? 'improved' : 'declined';
}

export function averageMetrics(tests: FitnessTestResult[]) {
  return {
    run3km: round(average(tests.map((t) => t.run3kmSeconds)), 0),
    pushups: round(average(tests.map((t) => t.pushups)), 1),
    pullups: round(average(tests.map((t) => t.pullups)), 1),
    plank: round(average(tests.map((t) => t.plankSeconds)), 0),
  };
}

export function latestTestPerCadet(data: AppData, period: TestPeriod): FitnessTestResult[] {
  return data.fitnessTests.filter((t) => t.period === period);
}

export function missionCompletionCount(mission: WeekendMission): number {
  return mission.completions.filter((c) => c.completed).length;
}

export function totalMissionsCompleted(data: AppData): number {
  return data.weekendMissions.reduce((sum, m) => sum + missionCompletionCount(m), 0);
}

export function cadetMissionsCompleted(data: AppData, cadetId: string): number {
  return data.weekendMissions.filter((m) => m.completions.some((c) => c.cadetId === cadetId && c.completed)).length;
}

export function fitnessLevelDistribution(cadets: Cadet[]): Record<FitnessLevel, number> {
  return cadets.reduce(
    (acc, c) => {
      acc[c.fitnessLevel] += 1;
      return acc;
    },
    { green: 0, yellow: 0, red: 0 } as Record<FitnessLevel, number>,
  );
}

export function teamDistribution(cadets: Cadet[]): Record<Team, number> {
  return cadets.reduce(
    (acc, c) => {
      acc[c.team] += 1;
      return acc;
    },
    { green: 0, blue: 0, orange: 0 } as Record<Team, number>,
  );
}

export interface LeaderboardRow {
  cadet: Cadet;
  rank: number;
  score: number;
  attendance: number;
  improvementSeconds: number;
  missionsCompleted: number;
}

export function buildLeaderboard(data: AppData): LeaderboardRow[] {
  const rows = data.cadets.map((cadet) => {
    const opening = testByPeriod(data, cadet.id, 'opening');
    const final = testByPeriod(data, cadet.id, 'final');
    const improvementSeconds = opening && final ? opening.run3kmSeconds - final.run3kmSeconds : 0;
    return {
      cadet,
      rank: 0,
      score: cadetTotalScore(data, cadet.id),
      attendance: cadetAttendancePercent(data, cadet.id),
      improvementSeconds,
      missionsCompleted: cadetMissionsCompleted(data, cadet.id),
    };
  });
  rows.sort((a, b) => b.score - a.score);
  rows.forEach((row, i) => {
    row.rank = i + 1;
  });
  return rows;
}

export function daysBetweenDates(startISO: string, endISO: string): number {
  const start = new Date(startISO).setHours(0, 0, 0, 0);
  const end = new Date(endISO).setHours(0, 0, 0, 0);
  return Math.round((end - start) / 86_400_000);
}

export function courseProgress(courseStart: string, courseEnd: string, now = new Date()) {
  const nowISO = now.toISOString().slice(0, 10);
  const totalDays = daysBetweenDates(courseStart, courseEnd);
  const passedDaysRaw = daysBetweenDates(courseStart, nowISO);
  const passedDays = Math.min(Math.max(passedDaysRaw, 0), totalDays);
  const remainingDays = Math.max(totalDays - passedDays, 0);
  const percent = totalDays > 0 ? round((passedDays / totalDays) * 100, 0) : 0;
  return { totalDays, passedDays, remainingDays, percent };
}

export interface CadetHighlight {
  cadet: Cadet;
  value: number;
}

export function topCadetsByScore(data: AppData, count: number, ascending = false): CadetHighlight[] {
  const rows = data.cadets.map((c) => ({ cadet: c, value: cadetTotalScore(data, c.id) }));
  rows.sort((a, b) => (ascending ? a.value - b.value : b.value - a.value));
  return rows.slice(0, count);
}

export function mostAbsences(data: AppData, count: number): CadetHighlight[] {
  const rows = data.cadets.map((c) => ({
    cadet: c,
    value: cadetAttendanceRecords(data, c.id).filter((r) => r.status === 'absent').length,
  }));
  rows.sort((a, b) => b.value - a.value);
  return rows.slice(0, count);
}

export function mostImproved(data: AppData, count: number): CadetHighlight[] {
  const rows = data.cadets.map((c) => {
    const opening = testByPeriod(data, c.id, 'opening');
    const final = testByPeriod(data, c.id, 'final');
    const value = opening && final ? opening.run3kmSeconds - final.run3kmSeconds : 0;
    return { cadet: c, value };
  });
  rows.sort((a, b) => b.value - a.value);
  return rows.slice(0, count);
}

export function needsAttention(data: AppData, count: number): CadetHighlight[] {
  const rows = data.cadets.map((c) => {
    const attendance = cadetAttendancePercent(data, c.id);
    const score = cadetTotalScore(data, c.id);
    // Lower composite = needs more attention
    const value = attendance * 0.6 + score * 0.4;
    return { cadet: c, value };
  });
  rows.sort((a, b) => a.value - b.value);
  return rows.slice(0, count);
}

export function weekNumberOf(dateISO: string, courseStart: string): number {
  const diff = daysBetweenDates(courseStart, dateISO);
  return Math.max(1, Math.floor(diff / 7) + 1);
}

export function weeklyAttendanceTrend(data: AppData): { name: string; value: number }[] {
  const byWeek = new Map<number, AttendanceRecord[]>();
  for (const record of data.attendance) {
    const week = weekNumberOf(record.date, data.settings.courseStart);
    if (!byWeek.has(week)) byWeek.set(week, []);
    byWeek.get(week)!.push(record);
  }
  return Array.from(byWeek.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([week, records]) => ({ name: `שבוע ${week}`, value: attendancePercent(records) }));
}

export function weeklyScoreTrend(data: AppData): { name: string; value: number }[] {
  const byWeek = new Map<number, number>();
  for (const entry of data.scores) {
    const dateForWeek = /^\d{4}-\d{2}-\d{2}$/.test(entry.date) ? entry.date : data.settings.courseStart;
    const week = weekNumberOf(dateForWeek, data.settings.courseStart);
    byWeek.set(week, (byWeek.get(week) ?? 0) + entry.points);
  }
  const weeks = Array.from(byWeek.keys()).sort((a, b) => a - b);
  let running = 0;
  return weeks.map((week) => {
    running += byWeek.get(week) ?? 0;
    return { name: `שבוע ${week}`, value: running };
  });
}

export function mostActive(data: AppData, count: number): CadetHighlight[] {
  const rows = data.cadets.map((c) => ({
    cadet: c,
    value: cadetAttendanceRecords(data, c.id).filter((r) => r.status === 'present').length + cadetMissionsCompleted(data, c.id),
  }));
  rows.sort((a, b) => b.value - a.value);
  return rows.slice(0, count);
}
