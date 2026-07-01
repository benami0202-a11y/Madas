/**
 * Core domain models for מערך הכושר הפלוגתי.
 * Kept as plain serializable interfaces so the same shapes can be persisted
 * to localStorage today and to Firestore/Supabase later without changes.
 */

export type Team = 'green' | 'blue' | 'orange';

export type FitnessLevel = 'green' | 'yellow' | 'red';

export type AttendanceStatus = 'present' | 'listener' | 'medical' | 'absent';

export type TestPeriod = 'opening' | 'middle' | 'final';

export type TrainingType =
  | 'running'
  | 'intervals'
  | 'tempo'
  | 'strength'
  | 'mobility'
  | 'stretching';

export type ScoreEventType =
  | 'attendance'
  | 'weekend_mission'
  | 'improvement'
  | 'helping_friends'
  | 'leadership'
  | 'excellent_performance'
  | 'absence'
  | 'manual';

export type NoteType = 'coach' | 'general' | 'medical' | 'pain';

export interface Cadet {
  id: string;
  fullName: string;
  team: Team;
  fitnessLevel: FitnessLevel;
  trainingGroup: string;
  medicalProfile: string;
  restrictions: string;
  painNotes: string;
  exemption: boolean;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  photoUrl?: string;
  joinedAt: string; // ISO date
}

export interface AttendanceRecord {
  id: string;
  cadetId: string;
  date: string; // ISO date
  sessionName: string;
  status: AttendanceStatus;
  points: number;
  note?: string;
}

export interface FitnessTestResult {
  id: string;
  cadetId: string;
  period: TestPeriod;
  date: string; // ISO date
  run3kmSeconds: number;
  pushups: number;
  pullups: number;
  plankSeconds: number;
  burpees?: number;
}

export interface TrainingPlanWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  objectives: string;
  trainingTypes: TrainingType[];
  notes: string;
}

export interface MissionCompletion {
  cadetId: string;
  completed: boolean;
  completionDate?: string;
}

export interface WeekendMission {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  videoUrl?: string;
  completions: MissionCompletion[];
}

export interface ScoreEntry {
  id: string;
  cadetId: string;
  type: ScoreEventType;
  points: number;
  date: string;
  note?: string;
  relatedId?: string;
}

export interface Note {
  id: string;
  cadetId: string;
  type: NoteType;
  text: string;
  date: string;
  author: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface ScoringRules {
  attendancePresent: number;
  attendanceListener: number;
  attendanceMedical: number;
  attendanceAbsent: number;
  weekendMission: number;
  improvement: number;
  helpingFriends: number;
  leadership: number;
  excellentPerformance: number;
}

export interface Settings {
  appName: string;
  subtitle: string;
  courseStart: string;
  courseEnd: string;
  adminName: string;
  adminRole: string;
  scoringRules: ScoringRules;
  trainingTypeLabels: Record<TrainingType, string>;
  fitnessLevelLabels: Record<FitnessLevel, string>;
}

export const TEAM_LABELS: Record<Team, string> = {
  green: 'צוות 1 - ירוק',
  blue: 'צוות 2 - כחול',
  orange: 'צוות 3 - כתום',
};

export const TEAM_COLORS: Record<Team, { bg: string; text: string; ring: string; solid: string }> = {
  green: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-500/30', solid: 'bg-emerald-500' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', ring: 'ring-blue-200 dark:ring-blue-500/30', solid: 'bg-blue-500' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-700 dark:text-orange-400', ring: 'ring-orange-200 dark:ring-orange-500/30', solid: 'bg-orange-500' },
};

export const FITNESS_LEVEL_LABELS: Record<FitnessLevel, string> = {
  green: 'ירוק (A)',
  yellow: 'צהוב (B)',
  red: 'אדום (C)',
};

export const FITNESS_LEVEL_COLORS: Record<FitnessLevel, { bg: string; text: string; solid: string }> = {
  green: { bg: 'bg-green-100 dark:bg-green-500/15', text: 'text-green-700 dark:text-green-400', solid: 'bg-green-500' },
  yellow: { bg: 'bg-yellow-100 dark:bg-yellow-500/15', text: 'text-yellow-700 dark:text-yellow-400', solid: 'bg-yellow-500' },
  red: { bg: 'bg-red-100 dark:bg-red-500/15', text: 'text-red-700 dark:text-red-400', solid: 'bg-red-500' },
};

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'נוכח',
  listener: 'מאזין',
  medical: 'פטור רפואי',
  absent: 'נעדר',
};

export const TEST_PERIOD_LABELS: Record<TestPeriod, string> = {
  opening: 'מבחן פתיחה',
  middle: 'מבחן אמצע',
  final: 'מבחן סיום',
};

export const TRAINING_TYPE_LABELS: Record<TrainingType, string> = {
  running: 'ריצה',
  intervals: 'אינטרוולים',
  tempo: 'טמפו',
  strength: 'כוח',
  mobility: 'מוביליטי',
  stretching: 'מתיחות',
};

export const SCORE_EVENT_LABELS: Record<ScoreEventType, string> = {
  attendance: 'נוכחות',
  weekend_mission: 'משימת סופ"ש',
  improvement: 'שיפור',
  helping_friends: 'עזרה לחברים',
  leadership: 'מנהיגות',
  excellent_performance: 'ביצוע מצטיין',
  absence: 'היעדרות',
  manual: 'ידני',
};

export interface AppData {
  cadets: Cadet[];
  attendance: AttendanceRecord[];
  fitnessTests: FitnessTestResult[];
  trainingPlans: TrainingPlanWeek[];
  weekendMissions: WeekendMission[];
  scores: ScoreEntry[];
  notes: Note[];
  users: User[];
  settings: Settings;
}
