import { useState } from 'react';
import type { Cadet, FitnessLevel, Team } from '@/types';
import { FITNESS_LEVEL_LABELS, TEAM_LABELS } from '@/types';
import { Button } from '@/components/ui/Button';

interface CadetFormProps {
  initial?: Cadet;
  onSubmit: (values: Omit<Cadet, 'id'>) => void;
  onCancel: () => void;
}

const EMPTY: Omit<Cadet, 'id'> = {
  fullName: '',
  team: 'green',
  fitnessLevel: 'green',
  trainingGroup: '',
  medicalProfile: '97',
  restrictions: '',
  painNotes: '',
  exemption: false,
  phone: '',
  email: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  joinedAt: new Date().toISOString().slice(0, 10),
};

function labelClass() {
  return 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400';
}
function inputClass() {
  return 'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';
}

export function CadetForm({ initial, onSubmit, onCancel }: CadetFormProps) {
  const [values, setValues] = useState<Omit<Cadet, 'id'>>(initial ?? EMPTY);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!values.fullName.trim()) return;
        onSubmit(values);
      }}
    >
      <div>
        <label className={labelClass()}>שם מלא</label>
        <input
          required
          className={inputClass()}
          value={values.fullName}
          onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass()}>צוות</label>
          <select
            className={inputClass()}
            value={values.team}
            onChange={(e) => setValues((v) => ({ ...v, team: e.target.value as Team }))}
          >
            {(Object.keys(TEAM_LABELS) as Team[]).map((t) => (
              <option key={t} value={t}>
                {TEAM_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass()}>רמת כושר</label>
          <select
            className={inputClass()}
            value={values.fitnessLevel}
            onChange={(e) => setValues((v) => ({ ...v, fitnessLevel: e.target.value as FitnessLevel }))}
          >
            {(Object.keys(FITNESS_LEVEL_LABELS) as FitnessLevel[]).map((l) => (
              <option key={l} value={l}>
                {FITNESS_LEVEL_LABELS[l]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass()}>קבוצת אימון</label>
          <input className={inputClass()} value={values.trainingGroup} onChange={(e) => setValues((v) => ({ ...v, trainingGroup: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass()}>פרופיל רפואי</label>
          <input className={inputClass()} value={values.medicalProfile} onChange={(e) => setValues((v) => ({ ...v, medicalProfile: e.target.value }))} />
        </div>
      </div>

      <div>
        <label className={labelClass()}>הגבלות</label>
        <input className={inputClass()} value={values.restrictions} onChange={(e) => setValues((v) => ({ ...v, restrictions: e.target.value }))} />
      </div>

      <div>
        <label className={labelClass()}>הערות כאב</label>
        <input className={inputClass()} value={values.painNotes} onChange={(e) => setValues((v) => ({ ...v, painNotes: e.target.value }))} />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
        <input type="checkbox" checked={values.exemption} onChange={(e) => setValues((v) => ({ ...v, exemption: e.target.checked }))} />
        פטור מלא מפעילות גופנית
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass()}>טלפון</label>
          <input className={inputClass()} value={values.phone} onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass()}>אימייל</label>
          <input className={inputClass()} value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass()}>איש קשר לחירום</label>
          <input
            className={inputClass()}
            value={values.emergencyContactName}
            onChange={(e) => setValues((v) => ({ ...v, emergencyContactName: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass()}>טלפון חירום</label>
          <input
            className={inputClass()}
            value={values.emergencyContactPhone}
            onChange={(e) => setValues((v) => ({ ...v, emergencyContactPhone: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" fullWidth>
          שמירה
        </Button>
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          ביטול
        </Button>
      </div>
    </form>
  );
}
