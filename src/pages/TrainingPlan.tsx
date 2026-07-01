import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTrainingPlans } from '@/hooks/useTrainingPlans';
import { WeekPlanCard } from '@/components/trainingPlan/WeekPlanCard';
import { TrainingPlanForm } from '@/components/trainingPlan/TrainingPlanForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import type { TrainingPlanWeek } from '@/types';

export default function TrainingPlan() {
  const { trainingPlans, addTrainingPlan, updateTrainingPlan, deleteTrainingPlan } = useTrainingPlans();
  const [editing, setEditing] = useState<TrainingPlanWeek | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">תוכנית אימונים שבועית</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">תכנון מטרות, סוגי אימון והערות לכל שבוע בקורס</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setCreating(true)}>
          הוסף שבוע
        </Button>
      </div>

      {trainingPlans.length === 0 ? (
        <EmptyState title="אין תוכנית אימונים עדיין" description="הוסף שבוע ראשון כדי להתחיל" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trainingPlans.map((plan) => (
            <WeekPlanCard key={plan.id} plan={plan} onEdit={() => setEditing(plan)} onDelete={() => deleteTrainingPlan(plan.id)} />
          ))}
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="הוספת שבוע אימונים">
        <TrainingPlanForm
          nextWeekNumber={trainingPlans.length + 1}
          onSubmit={(values) => {
            addTrainingPlan(values);
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`עריכת שבוע ${editing?.weekNumber ?? ''}`}>
        {editing && (
          <TrainingPlanForm
            initial={editing}
            nextWeekNumber={editing.weekNumber}
            onSubmit={(values) => {
              updateTrainingPlan(editing.id, values);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
