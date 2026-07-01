import { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, Save } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ScoringRules, TrainingType, FitnessLevel } from '@/types';
import { TRAINING_TYPE_LABELS, FITNESS_LEVEL_LABELS } from '@/types';

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

const SCORING_FIELDS: { key: keyof ScoringRules; label: string }[] = [
  { key: 'attendancePresent', label: 'נוכחות מלאה' },
  { key: 'attendanceListener', label: 'שומע' },
  { key: 'attendanceMedical', label: 'פטור רפואי' },
  { key: 'attendanceAbsent', label: 'היעדרות' },
  { key: 'weekendMission', label: 'משימת סופ"ש' },
  { key: 'improvement', label: 'שיפור' },
  { key: 'helpingFriends', label: 'עזרה לחברים' },
  { key: 'leadership', label: 'מנהיגות' },
  { key: 'excellentPerformance', label: 'ביצוע מצטיין' },
];

export default function Settings() {
  const { settings, updateSettings, exportAllData, importAllData, resetToSeedData } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const [appName, setAppName] = useState(settings.appName);
  const [subtitle, setSubtitle] = useState(settings.subtitle);
  const [adminName, setAdminName] = useState(settings.adminName);
  const [adminRole, setAdminRole] = useState(settings.adminRole);
  const [courseStart, setCourseStart] = useState(settings.courseStart);
  const [courseEnd, setCourseEnd] = useState(settings.courseEnd);
  const [rules, setRules] = useState<ScoringRules>(settings.scoringRules);
  const [trainingLabels, setTrainingLabels] = useState(settings.trainingTypeLabels);
  const [levelLabels, setLevelLabels] = useState(settings.fitnessLevelLabels);

  function flashSaved() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function saveAll() {
    updateSettings({
      appName,
      subtitle,
      adminName,
      adminRole,
      courseStart,
      courseEnd,
      scoringRules: rules,
      trainingTypeLabels: trainingLabels,
      fitnessLevelLabels: levelLabels,
    });
    flashSaved();
  }

  function handleBackup() {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `madas-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleRestoreFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importAllData(reader.result as string);
        flashSaved();
      } catch {
        alert('קובץ הגיבוי אינו תקין');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="animate-fade-in space-y-4 pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">הגדרות</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">ניהול פרטי הקורס, כללי ניקוד וגיבוי נתונים</p>
        </div>
        <Button icon={<Save size={18} />} onClick={saveAll}>
          {savedFlash ? 'נשמר!' : 'שמור שינויים'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>פרטי הקורס</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="שם המערכת">
            <input className={inputClass} value={appName} onChange={(e) => setAppName(e.target.value)} />
          </Field>
          <Field label="כותרת משנה">
            <input className={inputClass} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </Field>
          <Field label="שם מנהל המערכת">
            <input className={inputClass} value={adminName} onChange={(e) => setAdminName(e.target.value)} />
          </Field>
          <Field label="תפקיד">
            <input className={inputClass} value={adminRole} onChange={(e) => setAdminRole(e.target.value)} />
          </Field>
          <Field label="תחילת קורס">
            <input type="date" className={inputClass} value={courseStart} onChange={(e) => setCourseStart(e.target.value)} />
          </Field>
          <Field label="סיום קורס">
            <input type="date" className={inputClass} value={courseEnd} onChange={(e) => setCourseEnd(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>כללי ניקוד</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SCORING_FIELDS.map((field) => (
            <Field key={field.key} label={field.label}>
              <input
                type="number"
                className={inputClass}
                value={rules[field.key]}
                onChange={(e) => setRules((r) => ({ ...r, [field.key]: Number(e.target.value) }))}
              />
            </Field>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>תוויות רמות כושר</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(Object.keys(levelLabels) as FitnessLevel[]).map((level) => (
            <Field key={level} label={FITNESS_LEVEL_LABELS[level]}>
              <input
                className={inputClass}
                value={levelLabels[level]}
                onChange={(e) => setLevelLabels((prev) => ({ ...prev, [level]: e.target.value }))}
              />
            </Field>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>סוגי אימון</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(Object.keys(trainingLabels) as TrainingType[]).map((type) => (
            <Field key={type} label={TRAINING_TYPE_LABELS[type]}>
              <input
                className={inputClass}
                value={trainingLabels[type]}
                onChange={(e) => setTrainingLabels((prev) => ({ ...prev, [type]: e.target.value }))}
              />
            </Field>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>גיבוי ושחזור נתונים</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={<Download size={16} />} onClick={handleBackup}>
            הורדת גיבוי (JSON)
          </Button>
          <Button variant="secondary" icon={<Upload size={16} />} onClick={() => fileInputRef.current?.click()}>
            שחזור מגיבוי
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleRestoreFile(file);
              e.target.value = '';
            }}
          />
          <Button
            variant="danger"
            icon={<RotateCcw size={16} />}
            onClick={() => {
              if (confirm('לאפס את כל הנתונים לנתוני הדגמה המקוריים? פעולה זו תמחק שינויים קיימים.')) {
                resetToSeedData();
              }
            }}
          >
            איפוס לנתוני דמו
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</label>
      {children}
    </div>
  );
}
