import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, ShieldAlert, MessageSquarePlus, Trash2 } from 'lucide-react';
import { useCadet } from '@/hooks/useCadets';
import { useNotes } from '@/hooks/useNotes';
import { Avatar } from '@/components/ui/Avatar';
import { TeamBadge } from '@/components/cadets/TeamBadge';
import { FitnessLevelBadge } from '@/components/cadets/FitnessLevelBadge';
import { FitnessLevelSelector } from '@/components/cadets/FitnessLevelSelector';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { SimpleLineChart } from '@/components/charts/SimpleLineChart';
import { FitnessTestComparison } from '@/components/fitnessTests/FitnessTestComparison';
import {
  cadetAttendancePercent,
  cadetAttendanceRecords,
  cadetFitnessTests,
  cadetScoreEntries,
  cadetTotalScore,
  cadetMissionsCompleted,
} from '@/lib/selectors';
import { formatDateHe, cn } from '@/lib/utils';
import { ATTENDANCE_STATUS_LABELS, SCORE_EVENT_LABELS, type NoteType } from '@/types';
import { useAppData } from '@/hooks/useAppData';

const TABS = ['סקירה', 'נוכחות', 'כושר', 'ניקוד', 'הערות'] as const;

export default function CadetProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cadet, updateCadet } = useCadet(id);
  const data = useAppData();
  const [tab, setTab] = useState<(typeof TABS)[number]>('סקירה');
  const { notes, addNote, deleteNote } = useNotes(id);
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('coach');

  const attendanceRecords = useMemo(() => (id ? cadetAttendanceRecords(data, id) : []), [data, id]);
  const attendancePct = id ? cadetAttendancePercent(data, id) : 0;
  const tests = useMemo(() => (id ? cadetFitnessTests(data, id) : []), [data, id]);
  const testsByPeriod = useMemo(() => {
    const map: Record<string, (typeof tests)[number]> = {};
    for (const t of tests) map[t.period] = t;
    return map;
  }, [tests]);
  const scoreEntries = useMemo(() => (id ? cadetScoreEntries(data, id) : []), [data, id]);
  const totalScoreValue = id ? cadetTotalScore(data, id) : 0;
  const missionsCompleted = id ? cadetMissionsCompleted(data, id) : 0;

  const run3kmTrend = useMemo(
    () =>
      tests.map((t) => ({
        name: t.period === 'opening' ? 'פתיחה' : t.period === 'middle' ? 'אמצע' : 'סיום',
        value: Math.round(t.run3kmSeconds / 60 * 10) / 10,
      })),
    [tests],
  );

  if (!cadet) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <p className="text-gray-500">חניך לא נמצא</p>
        <Button variant="secondary" onClick={() => navigate('/cadets')}>
          חזרה לרשימת חניכים
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4 pb-8">
      <button
        onClick={() => navigate('/cadets')}
        className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowRight size={16} />
        חזרה לחניכים
      </button>

      <Card>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-right">
          <Avatar name={cadet.fullName} team={cadet.team} size="lg" />
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl dark:text-gray-50">{cadet.fullName}</h1>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
              <TeamBadge team={cadet.team} />
              <FitnessLevelBadge level={cadet.fitnessLevel} />
              <Badge color="purple">{cadet.trainingGroup}</Badge>
              {cadet.exemption && <Badge color="red">פטור מלא</Badge>}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:max-w-md">
              <div className="rounded-xl bg-gray-50 py-2 text-center dark:bg-gray-800/60">
                <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{totalScoreValue}</p>
                <p className="text-[11px] text-gray-400">ניקוד</p>
              </div>
              <div className="rounded-xl bg-gray-50 py-2 text-center dark:bg-gray-800/60">
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{attendancePct}%</p>
                <p className="text-[11px] text-gray-400">נוכחות</p>
              </div>
              <div className="rounded-xl bg-gray-50 py-2 text-center dark:bg-gray-800/60">
                <p className="text-lg font-extrabold text-teal-600 dark:text-teal-400">{missionsCompleted}</p>
                <p className="text-[11px] text-gray-400">משימות</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="scrollbar-none flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'סקירה' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>שינוי רמת כושר</CardTitle>
            </CardHeader>
            <FitnessLevelSelector value={cadet.fitnessLevel} onChange={(level) => updateCadet(cadet.id, { fitnessLevel: level })} />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>פרטים אישיים</CardTitle>
            </CardHeader>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <Info label="פרופיל רפואי" value={cadet.medicalProfile} />
              <Info label="הגבלות" value={cadet.restrictions || 'אין'} />
              <Info label="הערות כאב" value={cadet.painNotes || 'אין'} />
              <Info label="קבוצת אימון" value={cadet.trainingGroup} />
              <Info label="טלפון" value={cadet.phone} icon={<Phone size={14} />} ltr />
              <Info label="אימייל" value={cadet.email} icon={<Mail size={14} />} ltr />
              <Info
                label="איש קשר לחירום"
                value={`${cadet.emergencyContactName} · ${cadet.emergencyContactPhone}`}
                icon={<ShieldAlert size={14} />}
              />
            </dl>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מגמת ריצת 3 ק"מ (דקות)</CardTitle>
            </CardHeader>
            <SimpleLineChart data={run3kmTrend} color="#6366f1" />
          </Card>
        </div>
      )}

      {tab === 'נוכחות' && (
        <Card noPadding>
          <div className="p-4 pb-2">
            <ProgressBar value={attendancePct} colorClass="bg-emerald-500" />
            <p className="mt-2 text-sm text-gray-500">{attendancePct}% נוכחות כוללת</p>
          </div>
          <div className="scrollbar-none max-h-96 overflow-y-auto">
            {attendanceRecords
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((record) => (
                <div key={record.id} className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm dark:border-gray-800">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{record.sessionName}</p>
                    <p className="text-xs text-gray-400">{formatDateHe(record.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AttendanceStatusBadge status={record.status} />
                    <span className={cn('text-sm font-bold', record.points >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                      {record.points > 0 ? '+' : ''}
                      {record.points}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {tab === 'כושר' && (
        <Card>
          <CardHeader>
            <CardTitle>השוואת מבחני כושר</CardTitle>
          </CardHeader>
          <FitnessTestComparison tests={testsByPeriod} />
        </Card>
      )}

      {tab === 'ניקוד' && (
        <Card noPadding>
          <div className="scrollbar-none max-h-[28rem] overflow-y-auto">
            {scoreEntries.length === 0 && <p className="p-4 text-center text-sm text-gray-400">אין רשומות ניקוד</p>}
            {scoreEntries
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <div key={entry.id} className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm first:border-0 dark:border-gray-800">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{SCORE_EVENT_LABELS[entry.type]}</p>
                    <p className="text-xs text-gray-400">{entry.note}</p>
                  </div>
                  <span className={cn('font-bold', entry.points >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                    {entry.points > 0 ? '+' : ''}
                    {entry.points}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      )}

      {tab === 'הערות' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הוספת הערה</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value as NoteType)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="coach">הערת מאמן</option>
                <option value="general">הערה כללית</option>
                <option value="medical">הערה רפואית</option>
                <option value="pain">הערת כאב</option>
              </select>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                placeholder="כתוב הערה..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              <Button
                icon={<MessageSquarePlus size={16} />}
                fullWidth
                onClick={() => {
                  if (!noteText.trim() || !id) return;
                  addNote({ cadetId: id, type: noteType, text: noteText.trim(), date: new Date().toISOString().slice(0, 10), author: data.settings.adminName });
                  setNoteText('');
                }}
              >
                שמור הערה
              </Button>
            </div>
          </Card>

          <Card noPadding>
            {notes.length === 0 && <p className="p-4 text-center text-sm text-gray-400">אין הערות עדיין</p>}
            {notes.map((note) => (
              <div key={note.id} className="flex items-start justify-between gap-2 border-t border-gray-100 px-4 py-3 text-sm first:border-0 dark:border-gray-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge color={note.type === 'medical' || note.type === 'pain' ? 'red' : 'blue'}>{noteTypeLabel(note.type)}</Badge>
                    <span className="text-xs text-gray-400">{formatDateHe(note.date)}</span>
                  </div>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{note.text}</p>
                  <p className="mt-1 text-xs text-gray-400">{note.author}</p>
                </div>
                <button onClick={() => deleteNote(note.id)} className="shrink-0 text-gray-300 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, icon, ltr }: { label: string; value: string; icon?: React.ReactNode; ltr?: boolean }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
      <dt className="flex items-center gap-1 text-xs text-gray-400">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold text-gray-800 dark:text-gray-200" dir={ltr ? 'ltr' : undefined}>
        {value}
      </dd>
    </div>
  );
}

function AttendanceStatusBadge({ status }: { status: keyof typeof ATTENDANCE_STATUS_LABELS }) {
  const colorMap = { present: 'green', listener: 'blue', medical: 'gray', absent: 'red' } as const;
  return <Badge color={colorMap[status]}>{ATTENDANCE_STATUS_LABELS[status]}</Badge>;
}

function noteTypeLabel(type: NoteType): string {
  return { coach: 'מאמן', general: 'כללי', medical: 'רפואי', pain: 'כאב' }[type];
}
