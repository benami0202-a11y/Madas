import type {
  AppData,
  AttendanceRecord,
  Cadet,
  FitnessLevel,
  FitnessTestResult,
  Note,
  ScoreEntry,
  Settings,
  Team,
  TestPeriod,
  TrainingPlanWeek,
  TrainingType,
  User,
  WeekendMission,
} from '@/types';
import { addDays, generateId, mulberry32, randInt, round, weightedPick } from '@/lib/utils';

export const COURSE_START = '2026-06-28';
export const COURSE_END = '2026-08-05';

export const DEFAULT_SETTINGS: Settings = {
  appName: 'מערך הכושר הפלוגתי',
  subtitle: 'מערכת ניהול הכושר של קורס הקצינים',
  courseStart: COURSE_START,
  courseEnd: COURSE_END,
  adminName: 'אריאל בן עמי',
  adminRole: 'קה"ג – מתרגל פלוגה א׳',
  scoringRules: {
    attendancePresent: 5,
    attendanceListener: 2,
    attendanceMedical: 0,
    attendanceAbsent: -5,
    weekendMission: 5,
    improvement: 10,
    helpingFriends: 5,
    leadership: 10,
    excellentPerformance: 15,
  },
  trainingTypeLabels: {
    running: 'ריצה',
    intervals: 'אינטרוולים',
    tempo: 'טמפו',
    strength: 'כוח',
    mobility: 'מוביליטי',
    stretching: 'מתיחות',
  },
  fitnessLevelLabels: {
    green: 'ירוק (A)',
    yellow: 'צהוב (B)',
    red: 'אדום (C)',
  },
};

const TEAM_ROSTERS: Record<Team, string[]> = {
  green: [
    'יאיר סויסה',
    'משה מלכה',
    'ניר ויטור',
    'שי יאראק',
    'אתי צור',
    'אלעד זכריה',
    'אליעזר ברויאר',
    'איתן אורנשטיין',
    'אוהד קונוביץ',
    'נתנאל שפיגלמן',
    'ברוך קרסיק',
    'יורם ישראל ביטון',
    'ארי גוטהלף',
    'שלום ערד',
  ],
  blue: [
    'אריאל בן עמי',
    'יחיאל זוהר',
    'נתנאל שלזינגר',
    'גוטליב',
    'הורביץ',
    'עמר',
    'קרליבך',
    'הראל',
    'אלמוג אבי',
    'אבי ברובסקי',
    'משה טובינה',
    'שלמה קינן',
    'אורן מועלם',
  ],
  orange: [
    'אשר סיני',
    'יחיאל שיינפלד',
    'יאיר בן אליעזר',
    'איתי צפאני',
    'יוסי אלבז',
    'יצחק שגיא',
    'מוטי ברלב',
    'יצחק ליקסנבורג',
    'אלי גרוס',
    'צבי מנדלסון',
    'דניאל עידן',
    'חיעד',
    'יצחק סבח',
  ],
};

const TRAINING_GROUP_BY_LEVEL: Record<FitnessLevel, string> = {
  green: "קבוצה מהירה (א')",
  yellow: "קבוצה בינונית (ב')",
  red: "קבוצה מותאמת (ג')",
};

function buildCadets(rng: () => number): Cadet[] {
  const cadets: Cadet[] = [];
  let globalIndex = 0;
  (Object.keys(TEAM_ROSTERS) as Team[]).forEach((team) => {
    TEAM_ROSTERS[team].forEach((name) => {
      const fitnessLevel = weightedPick<FitnessLevel>(rng, [
        ['green', 0.5],
        ['yellow', 0.33],
        ['red', 0.17],
      ]);
      const hasRestriction = rng() < 0.15;
      const hasExemption = rng() < 0.05 && hasRestriction;
      cadets.push({
        id: `cadet-${globalIndex + 1}`,
        fullName: name,
        team,
        fitnessLevel,
        trainingGroup: TRAINING_GROUP_BY_LEVEL[fitnessLevel],
        medicalProfile: hasExemption ? '72' : hasRestriction ? '82' : '97',
        restrictions: hasRestriction ? 'הגבלה בברך - ללא ריצות מרחק' : '',
        painNotes: hasRestriction && rng() < 0.5 ? 'כאבי גב תחתון בעת מאמץ ממושך' : '',
        exemption: hasExemption,
        // Placeholder contact details were never accurate - left blank until the fitness officer fills in real info.
        phone: '',
        email: '',
        emergencyContactName: `${name.split(' ')[0]} - איש קשר משפחתי`,
        emergencyContactPhone: '',
        joinedAt: COURSE_START,
        photoUrl: undefined,
      });
      globalIndex += 1;
    });
  });

  // Manual corrections from real course feedback (reported by the company fitness officer).
  const itai = cadets.find((c) => c.fullName === 'איתי צפאני');
  if (itai) {
    itai.fitnessLevel = 'green';
    itai.trainingGroup = TRAINING_GROUP_BY_LEVEL.green;
  }

  return cadets;
}

function weekDates(weekNumber: number): { start: string; end: string } {
  const start = addDays(COURSE_START, (weekNumber - 1) * 7);
  const end = addDays(COURSE_START, Math.min(weekNumber * 7 - 1, 37));
  return { start, end };
}

const TOTAL_WEEKS = 6;

const SESSION_TEMPLATES = [
  { offset: 0, name: 'אימון בוקר - ריצה' },
  { offset: 2, name: 'אימון כוח וסיבולת' },
  { offset: 4, name: 'אימון מיומנויות קרביות' },
];

function buildAttendance(cadets: Cadet[], rng: () => number, settings: Settings): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const rules = settings.scoringRules;
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    const { start } = weekDates(week);
    for (const session of SESSION_TEMPLATES) {
      const date = addDays(start, session.offset);
      if (date > COURSE_END) continue;
      for (const cadet of cadets) {
        const status = weightedPick<AttendanceRecord['status']>(rng, [
          ['present', 0.74],
          ['listener', 0.1],
          ['medical', cadet.exemption ? 0.3 : 0.06],
          ['absent', 0.1],
        ]);
        const pointsMap: Record<AttendanceRecord['status'], number> = {
          present: rules.attendancePresent,
          listener: rules.attendanceListener,
          medical: rules.attendanceMedical,
          absent: rules.attendanceAbsent,
        };
        records.push({
          id: generateId('att'),
          cadetId: cadet.id,
          date,
          sessionName: `שבוע ${week} - ${session.name}`,
          status,
          points: pointsMap[status],
        });
      }
    }
  }
  return records;
}

/**
 * Real attendance reported by the fitness officer: on 30/06/2026 all of
 * team 2 attended the מד״ס session except Moshe Tuvina, who was on duty
 * guarding the weapons - an excused (0-point) absence, not a penalty.
 */
function buildTeam2MadasAttendance(cadets: Cadet[], settings: Settings): AttendanceRecord[] {
  const date = '2026-06-30';
  const sessionName = 'מד״ס';
  const rules = settings.scoringRules;
  return cadets
    .filter((c) => c.team === 'blue')
    .map((cadet) => {
      const onGuardDuty = cadet.fullName === 'משה טובינה';
      return {
        id: generateId('att'),
        cadetId: cadet.id,
        date,
        sessionName,
        status: onGuardDuty ? 'medical' : 'present',
        points: onGuardDuty ? rules.attendanceMedical : rules.attendancePresent,
        note: onGuardDuty ? 'אחראי על שמירת הנשקים' : undefined,
      } satisfies AttendanceRecord;
    });
}

/**
 * Real attendance: on 29/06/2026 the whole company did a 5.5km tag march
 * with vests and stretchers, and everyone attended.
 */
function buildTagMarchAttendance(cadets: Cadet[], settings: Settings): AttendanceRecord[] {
  const date = '2026-06-29';
  const sessionName = 'מסע תגיות - 5.5 ק"מ עם ווסטים ואלונקות';
  const points = settings.scoringRules.attendancePresent;
  return cadets.map((cadet) => ({
    id: generateId('att'),
    cadetId: cadet.id,
    date,
    sessionName,
    status: 'present',
    points,
  }));
}

interface BaseStats {
  run3km: number;
  pushups: number;
  pullups: number;
  plank: number;
}

const LEVEL_BASE: Record<FitnessLevel, BaseStats> = {
  green: { run3km: 13 * 60, pushups: 45, pullups: 12, plank: 150 },
  yellow: { run3km: 15 * 60 + 30, pushups: 32, pullups: 7, plank: 105 },
  red: { run3km: 18 * 60, pushups: 20, pullups: 3, plank: 70 },
};

function buildFitnessTests(cadets: Cadet[], rng: () => number): FitnessTestResult[] {
  const results: FitnessTestResult[] = [];
  const periods: { period: TestPeriod; date: string; improvementFactor: number }[] = [
    { period: 'opening', date: addDays(COURSE_START, 1), improvementFactor: 0 },
    { period: 'middle', date: addDays(COURSE_START, 18), improvementFactor: 0.5 },
    { period: 'final', date: addDays(COURSE_START, 36), improvementFactor: 1 },
  ];

  for (const cadet of cadets) {
    const base = LEVEL_BASE[cadet.fitnessLevel];
    for (const { period, date, improvementFactor } of periods) {
      const noise = () => (rng() - 0.5) * 2;
      const runImprovement = 45 * improvementFactor + noise() * 8;
      const repImprovement = 6 * improvementFactor + noise();
      results.push({
        id: generateId('ftest'),
        cadetId: cadet.id,
        period,
        date,
        run3kmSeconds: Math.max(600, Math.round(base.run3km - runImprovement)),
        pushups: Math.max(5, Math.round(base.pushups + repImprovement)),
        pullups: Math.max(0, Math.round(base.pullups + repImprovement / 2)),
        plankSeconds: Math.max(30, Math.round(base.plank + repImprovement * 4)),
        burpees: Math.max(5, Math.round(15 + repImprovement)),
      });
    }
  }
  return results;
}

const WEEK_PLAN_TEMPLATES: { objectives: string; trainingTypes: TrainingType[]; notes: string }[] = [
  {
    objectives: 'בניית בסיס אירובי וחיזוק ליבה',
    trainingTypes: ['running', 'strength', 'mobility'],
    notes: 'התמקדות בטכניקת ריצה ובחימום מפרקים לפני כל אימון.',
  },
  {
    objectives: 'העלאת סף אנאירובי',
    trainingTypes: ['intervals', 'strength', 'stretching'],
    notes: 'אינטרוולים 400 מ׳ עם דגש על זמני מנוחה מבוקרים.',
  },
  {
    objectives: 'שיפור מהירות וקצב ריצה תחרותי',
    trainingTypes: ['tempo', 'running', 'mobility'],
    notes: 'ריצת טמפו בקצב מבחן היעד + עבודת רגליים.',
  },
  {
    objectives: 'חיזוק שרירי ליבה ומניעת פציעות',
    trainingTypes: ['strength', 'mobility', 'stretching'],
    notes: 'שילוב תרגילי TRX וקור, דגש על מתיחות בסיום.',
  },
  {
    objectives: 'הכנה למבחן אמצע - שילוב עומסים',
    trainingTypes: ['intervals', 'tempo', 'strength'],
    notes: 'שבוע עומס גבוה, מעקב אחר עייפות ופציעות.',
  },
  {
    objectives: 'חידוד אחרון לקראת מבחן סיום',
    trainingTypes: ['tempo', 'running', 'stretching'],
    notes: 'הפחתת עומס (Taper) ושמירה על חדות לקראת המבחן המסכם.',
  },
];

function buildTrainingPlans(): TrainingPlanWeek[] {
  const plans = Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const week = i + 1;
    const { start, end } = weekDates(week);
    const template = WEEK_PLAN_TEMPLATES[i % WEEK_PLAN_TEMPLATES.length];
    return {
      id: generateId('plan'),
      weekNumber: week,
      startDate: start,
      endDate: end,
      objectives: template.objectives,
      trainingTypes: template.trainingTypes,
      notes: template.notes,
    };
  });

  // Real events reported by the fitness officer.
  const week1 = plans.find((p) => p.weekNumber === 1);
  if (week1) {
    week1.notes += ' ב-29/6 בוצע מסע תגיות של 5.5 ק"מ עם ווסטים ואלונקות - השתתפות מלאה של כל הפלוגה.';
  }
  const week2 = plans.find((p) => p.weekNumber === 2);
  if (week2) {
    week2.notes += ' יום ראשון (5.7.2026): מבחן לסרגל מאמץ.';
  }

  return plans;
}

const MISSION_TEMPLATES = [
  { title: 'ריצת סופ"ש - 5 ק"מ עצמאית', description: 'ביצוע ריצה עצמאית של 5 ק"מ בקצב נוח, תיעוד זמן וקצב לב.' },
  { title: 'אימון כוח ביתי', description: '3 סטים של שכיבות סמיכה, בטן ושכיבות שוקיים - תיעוד חזרות.' },
  { title: 'מתיחות וניידות יומית', description: '15 דקות מתיחות דינמיות בכל יום, דגש על ירכיים וכתפיים.' },
  { title: 'אתגר עליות מתח', description: 'ביצוע 3 סטים עד כשל של עליות מתח, מנוחה של 90 שניות בין הסטים.' },
  { title: 'הליכה/ריצה עם ציוד', description: 'הליכת קילומטראז\' עם תיק קרבי 10 ק"ג לפי הנחיית המדריך.' },
  { title: 'סיכום שבועי אישי', description: 'מילוי יומן אימונים אישי וסימון תחושות ותובנות מהשבוע.' },
];

/**
 * Real poll Itai Tzefani (team 3) ran on 29/06/2026 asking teammates whether
 * they did light independent workouts that weekend. Recorded as an actual
 * weekend mission instead of randomly generated demo data.
 */
function buildTeam3PollMission(cadets: Cadet[]): WeekendMission {
  const byName = (name: string) => cadets.find((c) => c.fullName === name)?.id;
  const completedNames = ['יאיר בן אליעזר', 'יחיאל שיינפלד', 'דניאל עידן', 'יצחק סבח', 'מוטי ברלב', 'יוסי אלבז', 'חיעד'];
  const notCompletedNames = ['אשר סיני', 'יצחק ליקסנבורג', 'אלי גרוס', 'צבי מנדלסון', 'יצחק שגיא'];
  const pollDate = '2026-06-29';

  const completions = [
    ...completedNames.map((name) => ({ cadetId: byName(name), completed: true, completionDate: pollDate })),
    ...notCompletedNames.map((name) => ({ cadetId: byName(name), completed: false })),
  ].filter((c): c is { cadetId: string; completed: boolean; completionDate?: string } => Boolean(c.cadetId));

  return {
    id: generateId('mission'),
    weekNumber: 1,
    title: 'סקר צוותי: אימונים קלים עצמאיים (צוות 3)',
    description: 'סקר שהעביר איתי צפאני בקבוצת צוות 3 - מי ביצע אימונים קלים עצמאיים בסוף השבוע.',
    completions,
  };
}

function buildWeekendMissions(cadets: Cadet[], rng: () => number): WeekendMission[] {
  return Array.from({ length: TOTAL_WEEKS - 1 }, (_, i) => {
    const week = i + 1;
    const template = MISSION_TEMPLATES[i % MISSION_TEMPLATES.length];
    const { end } = weekDates(week);
    return {
      id: generateId('mission'),
      weekNumber: week,
      title: `שבוע ${week}: ${template.title}`,
      description: template.description,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      completions: cadets.map((cadet) => {
        const completed = rng() < 0.72;
        return {
          cadetId: cadet.id,
          completed,
          completionDate: completed ? addDays(end, randInt(rng, 0, 2)) : undefined,
        };
      }),
    };
  });
}

function buildScores(
  cadets: Cadet[],
  attendance: AttendanceRecord[],
  missions: WeekendMission[],
  fitnessTests: FitnessTestResult[],
  rng: () => number,
  settings: Settings,
): ScoreEntry[] {
  const scores: ScoreEntry[] = [];
  const rules = settings.scoringRules;

  for (const record of attendance) {
    if (record.points === 0) continue;
    scores.push({
      id: generateId('score'),
      cadetId: record.cadetId,
      type: record.status === 'absent' ? 'absence' : 'attendance',
      points: record.points,
      date: record.date,
      note: record.sessionName,
      relatedId: record.id,
    });
  }

  for (const mission of missions) {
    for (const completion of mission.completions) {
      if (!completion.completed) continue;
      scores.push({
        id: generateId('score'),
        cadetId: completion.cadetId,
        type: 'weekend_mission',
        points: rules.weekendMission,
        date: completion.completionDate ?? mission.weekNumber.toString(),
        note: mission.title,
        relatedId: `${mission.id}__${completion.cadetId}`,
      });
    }
  }

  for (const cadet of cadets) {
    const opening = fitnessTests.find((t) => t.cadetId === cadet.id && t.period === 'opening');
    const final = fitnessTests.find((t) => t.cadetId === cadet.id && t.period === 'final');
    if (opening && final && final.run3kmSeconds < opening.run3kmSeconds - 10) {
      scores.push({
        id: generateId('score'),
        cadetId: cadet.id,
        type: 'improvement',
        points: rules.improvement,
        date: final.date,
        note: 'שיפור ניכר בזמן ריצת 3 ק"מ בין מבחן פתיחה לסיום',
      });
    }
  }

  const bonusTypes: { type: ScoreEntry['type']; points: number; note: string }[] = [
    { type: 'helping_friends', points: rules.helpingFriends, note: 'עזרה יזומה לחבר מתקשה באימון' },
    { type: 'leadership', points: rules.leadership, note: 'הפגנת מנהיגות בהובלת קבוצה' },
    { type: 'excellent_performance', points: rules.excellentPerformance, note: 'ביצוע מצטיין באימון שבועי' },
  ];
  for (const cadet of cadets) {
    const bonusCount = randInt(rng, 0, 2);
    for (let i = 0; i < bonusCount; i++) {
      const bonus = bonusTypes[randInt(rng, 0, bonusTypes.length - 1)];
      scores.push({
        id: generateId('score'),
        cadetId: cadet.id,
        type: bonus.type,
        points: bonus.points,
        date: addDays(COURSE_START, randInt(rng, 3, 34)),
        note: bonus.note,
      });
    }
  }

  return scores;
}

function buildNotes(cadets: Cadet[], rng: () => number): Note[] {
  const notes: Note[] = [];
  const coachNotes = [
    'הראה מוטיבציה גבוהה השבוע, ממשיך לשפר טכניקת ריצה.',
    'יש לעקוב אחר עומס האימונים בשל תלונות עייפות קלות.',
    'מוביל טוב בקבוצה, עוזר לחיילים מתקשים.',
    'שיפור ניכר בזמן ריצת 3 ק"מ, ממליץ לשקול קידום רמת כושר.',
  ];
  for (const cadet of cadets) {
    if (rng() < 0.5) {
      notes.push({
        id: generateId('note'),
        cadetId: cadet.id,
        type: 'coach',
        text: coachNotes[randInt(rng, 0, coachNotes.length - 1)],
        date: addDays(COURSE_START, randInt(rng, 2, 34)),
        author: DEFAULT_SETTINGS.adminName,
      });
    }
    if (cadet.restrictions) {
      notes.push({
        id: generateId('note'),
        cadetId: cadet.id,
        type: 'medical',
        text: cadet.restrictions,
        date: COURSE_START,
        author: DEFAULT_SETTINGS.adminName,
      });
    }
  }
  return notes;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'אריאל בן עמי',
    role: 'קה"ג – מתרגל פלוגה א׳',
    email: 'benami0202@gmail.com',
    phone: '',
  },
];

export function buildSeedData(): AppData {
  const rng = mulberry32(20260628);
  const cadets = buildCadets(rng);
  const attendance = [
    ...buildAttendance(cadets, rng, DEFAULT_SETTINGS),
    ...buildTeam2MadasAttendance(cadets, DEFAULT_SETTINGS),
    ...buildTagMarchAttendance(cadets, DEFAULT_SETTINGS),
  ];
  const fitnessTests = buildFitnessTests(cadets, rng);
  const trainingPlans = buildTrainingPlans();
  const weekendMissions = [...buildWeekendMissions(cadets, rng), buildTeam3PollMission(cadets)];
  const scores = buildScores(cadets, attendance, weekendMissions, fitnessTests, rng, DEFAULT_SETTINGS);
  const notes = buildNotes(cadets, rng);

  return {
    cadets,
    attendance,
    fitnessTests,
    trainingPlans,
    weekendMissions,
    scores,
    notes,
    users: DEFAULT_USERS,
    settings: DEFAULT_SETTINGS,
  };
}

export const round1 = (v: number) => round(v, 1);
