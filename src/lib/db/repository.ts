/**
 * Data access layer. Everything the UI needs goes through the functions
 * exported here. Today they read/write localStorage synchronously; to move
 * to Firebase/Supabase later, only this file needs to change (swap the
 * body of `persist`/`loadInitial` and the mutators for async SDK calls) -
 * call sites and hooks stay identical.
 */
import type {
  AppData,
  AttendanceRecord,
  Cadet,
  FitnessTestResult,
  Note,
  ScoreEntry,
  Settings,
  TrainingPlanWeek,
  WeekendMission,
} from '@/types';
import { buildSeedData } from '@/data/seed';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'madas-fitness-data-v1';

type Listener = () => void;
const listeners = new Set<Listener>();

function loadInitial(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch (error) {
    console.error('Failed to parse stored data, regenerating seed data', error);
  }
  const seed = buildSeedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

let data: AppData = loadInitial();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function emit() {
  listeners.forEach((listener) => listener());
}

function mutate(updater: (draft: AppData) => AppData) {
  data = updater(data);
  persist();
  emit();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): AppData {
  return data;
}

// ---------- Cadets ----------
export function addCadet(cadet: Omit<Cadet, 'id'>) {
  const newCadet: Cadet = { ...cadet, id: generateId('cadet') };
  mutate((d) => ({ ...d, cadets: [...d.cadets, newCadet] }));
  return newCadet;
}

export function updateCadet(id: string, patch: Partial<Cadet>) {
  mutate((d) => ({
    ...d,
    cadets: d.cadets.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  }));
}

export function deleteCadet(id: string) {
  mutate((d) => ({ ...d, cadets: d.cadets.filter((c) => c.id !== id) }));
}

// ---------- Attendance ----------
export function upsertAttendance(record: Omit<AttendanceRecord, 'id'> & { id?: string }) {
  mutate((d) => {
    if (record.id) {
      return {
        ...d,
        attendance: d.attendance.map((a) => (a.id === record.id ? { ...a, ...record, id: record.id! } : a)),
      };
    }
    const existingIndex = d.attendance.findIndex(
      (a) => a.cadetId === record.cadetId && a.date === record.date && a.sessionName === record.sessionName,
    );
    const newRecord: AttendanceRecord = { ...record, id: generateId('att') };
    if (existingIndex >= 0) {
      const next = [...d.attendance];
      next[existingIndex] = { ...next[existingIndex], ...record };
      return { ...d, attendance: next };
    }
    return { ...d, attendance: [...d.attendance, newRecord] };
  });
}

export function deleteAttendance(id: string) {
  mutate((d) => ({ ...d, attendance: d.attendance.filter((a) => a.id !== id) }));
}

/**
 * Sets a cadet's attendance status for a session and keeps the matching score
 * entry (found via relatedId) in sync in the same transaction, so the
 * scoreboard always reflects the latest attendance marks.
 */
export function setAttendance(
  cadetId: string,
  date: string,
  sessionName: string,
  status: AttendanceRecord['status'],
) {
  mutate((d) => {
    const rules = d.settings.scoringRules;
    const pointsMap: Record<AttendanceRecord['status'], number> = {
      present: rules.attendancePresent,
      listener: rules.attendanceListener,
      medical: rules.attendanceMedical,
      absent: rules.attendanceAbsent,
    };
    const points = pointsMap[status];
    const existingIndex = d.attendance.findIndex(
      (a) => a.cadetId === cadetId && a.date === date && a.sessionName === sessionName,
    );

    let recordId: string;
    let attendance: AttendanceRecord[];
    if (existingIndex >= 0) {
      recordId = d.attendance[existingIndex].id;
      attendance = d.attendance.map((a, i) => (i === existingIndex ? { ...a, status, points } : a));
    } else {
      recordId = generateId('att');
      attendance = [...d.attendance, { id: recordId, cadetId, date, sessionName, status, points }];
    }

    const scores = d.scores.filter((s) => s.relatedId !== recordId);
    if (points !== 0) {
      scores.push({
        id: generateId('score'),
        cadetId,
        type: status === 'absent' ? 'absence' : 'attendance',
        points,
        date,
        note: sessionName,
        relatedId: recordId,
      });
    }

    return { ...d, attendance, scores };
  });
}

// ---------- Fitness tests ----------
export function upsertFitnessTest(result: Omit<FitnessTestResult, 'id'> & { id?: string }) {
  mutate((d) => {
    if (result.id) {
      return {
        ...d,
        fitnessTests: d.fitnessTests.map((t) => (t.id === result.id ? { ...t, ...result, id: result.id! } : t)),
      };
    }
    const existingIndex = d.fitnessTests.findIndex(
      (t) => t.cadetId === result.cadetId && t.period === result.period,
    );
    if (existingIndex >= 0) {
      const next = [...d.fitnessTests];
      next[existingIndex] = { ...next[existingIndex], ...result };
      return { ...d, fitnessTests: next };
    }
    const newResult: FitnessTestResult = { ...result, id: generateId('ftest') };
    return { ...d, fitnessTests: [...d.fitnessTests, newResult] };
  });
}

// ---------- Training plans ----------
export function addTrainingPlan(plan: Omit<TrainingPlanWeek, 'id'>) {
  mutate((d) => ({ ...d, trainingPlans: [...d.trainingPlans, { ...plan, id: generateId('plan') }] }));
}

export function updateTrainingPlan(id: string, patch: Partial<TrainingPlanWeek>) {
  mutate((d) => ({
    ...d,
    trainingPlans: d.trainingPlans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  }));
}

export function deleteTrainingPlan(id: string) {
  mutate((d) => ({ ...d, trainingPlans: d.trainingPlans.filter((p) => p.id !== id) }));
}

// ---------- Weekend missions ----------
export function addWeekendMission(mission: Omit<WeekendMission, 'id'>) {
  mutate((d) => ({ ...d, weekendMissions: [...d.weekendMissions, { ...mission, id: generateId('mission') }] }));
}

export function updateWeekendMission(id: string, patch: Partial<WeekendMission>) {
  mutate((d) => ({
    ...d,
    weekendMissions: d.weekendMissions.map((m) => (m.id === id ? { ...m, ...patch } : m)),
  }));
}

export function deleteWeekendMission(id: string) {
  mutate((d) => ({ ...d, weekendMissions: d.weekendMissions.filter((m) => m.id !== id) }));
}

/** Toggles a cadet's mission completion and keeps the linked score entry in sync. */
export function toggleMissionCompletion(missionId: string, cadetId: string, completed: boolean, date: string) {
  mutate((d) => {
    const mission = d.weekendMissions.find((m) => m.id === missionId);
    if (!mission) return d;

    const exists = mission.completions.some((c) => c.cadetId === cadetId);
    const completions = exists
      ? mission.completions.map((c) => (c.cadetId === cadetId ? { ...c, completed, completionDate: completed ? date : undefined } : c))
      : [...mission.completions, { cadetId, completed, completionDate: completed ? date : undefined }];
    const weekendMissions = d.weekendMissions.map((m) => (m.id === missionId ? { ...m, completions } : m));

    const relatedId = `${missionId}__${cadetId}`;
    const scores = d.scores.filter((s) => s.relatedId !== relatedId);
    if (completed) {
      scores.push({
        id: generateId('score'),
        cadetId,
        type: 'weekend_mission',
        points: d.settings.scoringRules.weekendMission,
        date,
        note: mission.title,
        relatedId,
      });
    }

    return { ...d, weekendMissions, scores };
  });
}

// ---------- Scores ----------
export function addScore(entry: Omit<ScoreEntry, 'id'>) {
  const newEntry: ScoreEntry = { ...entry, id: generateId('score') };
  mutate((d) => ({ ...d, scores: [...d.scores, newEntry] }));
  return newEntry;
}

export function deleteScore(id: string) {
  mutate((d) => ({ ...d, scores: d.scores.filter((s) => s.id !== id) }));
}

// ---------- Notes ----------
export function addNote(note: Omit<Note, 'id'>) {
  const newNote: Note = { ...note, id: generateId('note') };
  mutate((d) => ({ ...d, notes: [...d.notes, newNote] }));
  return newNote;
}

export function deleteNote(id: string) {
  mutate((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }));
}

// ---------- Settings ----------
export function updateSettings(patch: Partial<Settings>) {
  mutate((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
}

// ---------- Backup / restore ----------
export function exportAllData(): string {
  return JSON.stringify(data, null, 2);
}

export function importAllData(json: string) {
  const parsed = JSON.parse(json) as AppData;
  mutate(() => parsed);
}

export function resetToSeedData() {
  const seed = buildSeedData();
  mutate(() => seed);
}
