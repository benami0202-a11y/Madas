import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { useCadets } from '@/hooks/useCadets';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { TeamBadge } from '@/components/cadets/TeamBadge';
import { AttendanceStatusButton } from '@/components/attendance/AttendanceStatusButton';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { attendancePercent } from '@/lib/selectors';
import { formatDateHe, cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import type { AttendanceStatus, Team } from '@/types';

export default function Attendance() {
  const { attendance, sessions, setAttendance } = useAttendance();
  const { cadets } = useCadets();
  const { settings } = useSettings();
  const [teamFilter, setTeamFilter] = useState<Team | 'all'>('all');
  const [creatingNew, setCreatingNew] = useState(sessions.length === 0);
  const [date, setDate] = useState(sessions[0]?.date ?? new Date().toISOString().slice(0, 10));
  const [sessionName, setSessionName] = useState(sessions[0]?.sessionName ?? 'אימון בוקר');

  const currentKey = `${date}__${sessionName}`;

  const currentSessionRecords = useMemo(
    () => attendance.filter((a) => `${a.date}__${a.sessionName}` === currentKey),
    [attendance, currentKey],
  );

  const sessionPercent = attendancePercent(currentSessionRecords);

  const filteredCadets = teamFilter === 'all' ? cadets : cadets.filter((c) => c.team === teamFilter);

  const rules = settings.scoringRules;
  const pointsMap: Record<AttendanceStatus, number> = {
    present: rules.attendancePresent,
    listener: rules.attendanceListener,
    medical: rules.attendanceMedical,
    absent: rules.attendanceAbsent,
  };

  function selectSession(s: { date: string; sessionName: string }) {
    setDate(s.date);
    setSessionName(s.sessionName);
    setCreatingNew(false);
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">נוכחות</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">סימון נוכחות לאימון וצבירת ניקוד אוטומטית</p>
        </div>
        <Button icon={<CalendarPlus size={18} />} variant="secondary" onClick={() => setCreatingNew((v) => !v)}>
          אימון חדש
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {creatingNew ? (
            <>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-gray-500">תאריך</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-gray-500">שם האימון</label>
                <input
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="לדוגמה: אימון בוקר - ריצה"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </>
          ) : (
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-gray-500">בחר אימון קיים</label>
              <select
                value={currentKey}
                onChange={(e) => {
                  const found = sessions.find((s) => `${s.date}__${s.sessionName}` === e.target.value);
                  if (found) selectSession(found);
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                {sessions.map((s) => (
                  <option key={`${s.date}__${s.sessionName}`} value={`${s.date}__${s.sessionName}`}>
                    {formatDateHe(s.date)} · {s.sessionName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {currentSessionRecords.length} רשומות · {formatDateHe(date)}
          </p>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{sessionPercent}% נוכחות</span>
        </div>
        <ProgressBar value={sessionPercent} colorClass="bg-emerald-500" className="mt-2" />
      </Card>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={teamFilter === 'all'} onClick={() => setTeamFilter('all')}>
          כל הצוותים
        </FilterChip>
        <FilterChip active={teamFilter === 'green'} onClick={() => setTeamFilter('green')}>
          צוות ירוק
        </FilterChip>
        <FilterChip active={teamFilter === 'blue'} onClick={() => setTeamFilter('blue')}>
          צוות כחול
        </FilterChip>
        <FilterChip active={teamFilter === 'orange'} onClick={() => setTeamFilter('orange')}>
          צוות כתום
        </FilterChip>
      </div>

      <div className="space-y-2">
        {filteredCadets.map((cadet) => {
          const record = currentSessionRecords.find((r) => r.cadetId === cadet.id);
          return (
            <motion.div
              key={cadet.id}
              layout
              className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-1 items-center gap-3">
                <Avatar name={cadet.fullName} team={cadet.team} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{cadet.fullName}</p>
                  <TeamBadge team={cadet.team} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:w-96">
                {(['present', 'listener', 'medical', 'absent'] as AttendanceStatus[]).map((status) => (
                  <AttendanceStatusButton
                    key={status}
                    status={status}
                    active={record?.status === status}
                    points={pointsMap[status]}
                    onClick={() => setAttendance(cadet.id, date, sessionName, status)}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700',
      )}
    >
      {children}
    </button>
  );
}
