import { useState } from 'react';
import type { WeekendMission } from '@/types';
import { Button } from '@/components/ui/Button';

export function MissionForm({
  initial,
  nextWeekNumber,
  onSubmit,
  onCancel,
}: {
  initial?: WeekendMission;
  nextWeekNumber: number;
  onSubmit: (values: { weekNumber: number; title: string; description: string; videoUrl?: string }) => void;
  onCancel: () => void;
}) {
  const [weekNumber, setWeekNumber] = useState(initial?.weekNumber ?? nextWeekNumber);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? '');

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ weekNumber, title, description, videoUrl: videoUrl || undefined });
      }}
    >
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">שבוע מס'</label>
        <input type="number" value={weekNumber} onChange={(e) => setWeekNumber(Number(e.target.value))} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">כותרת המשימה</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">תיאור</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500">קישור לסרטון הדרכה</label>
        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className={inputClass} />
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

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';
