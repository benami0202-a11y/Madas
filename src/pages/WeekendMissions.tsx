import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useWeekendMissions } from '@/hooks/useWeekendMissions';
import { useCadets } from '@/hooks/useCadets';
import { MissionCard } from '@/components/weekendMissions/MissionCard';
import { MissionForm } from '@/components/weekendMissions/MissionForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import type { WeekendMission } from '@/types';

export default function WeekendMissions() {
  const { weekendMissions, addWeekendMission, updateWeekendMission, deleteWeekendMission, toggleMissionCompletion } = useWeekendMissions();
  const { cadets } = useCadets();
  const [editing, setEditing] = useState<WeekendMission | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">משימות סופ"ש</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">מעקב אחר ביצוע משימות עצמאיות בסופי שבוע</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setCreating(true)}>
          הוסף משימה
        </Button>
      </div>

      {weekendMissions.length === 0 ? (
        <EmptyState title='אין משימות סופ"ש עדיין' description="הוסף משימה ראשונה" />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {weekendMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              cadets={cadets}
              onEdit={() => setEditing(mission)}
              onDelete={() => deleteWeekendMission(mission.id)}
              onToggle={(cadetId, completed) => toggleMissionCompletion(mission.id, cadetId, completed, new Date().toISOString().slice(0, 10))}
            />
          ))}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title='הוספת משימת סופ"ש'>
        <MissionForm
          nextWeekNumber={weekendMissions.length + 1}
          onSubmit={(values) => {
            addWeekendMission({ ...values, completions: [] });
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="עריכת משימה">
        {editing && (
          <MissionForm
            initial={editing}
            nextWeekNumber={editing.weekNumber}
            onSubmit={(values) => {
              updateWeekendMission(editing.id, values);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
