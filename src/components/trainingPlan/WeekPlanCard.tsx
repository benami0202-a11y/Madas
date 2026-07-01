import { Pencil, Trash2 } from 'lucide-react';
import type { TrainingPlanWeek } from '@/types';
import { TRAINING_TYPE_LABELS } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateShortHe } from '@/lib/utils';

export function WeekPlanCard({
  plan,
  onEdit,
  onDelete,
}: {
  plan: TrainingPlanWeek;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>שבוע {plan.weekNumber}</CardTitle>
          <p className="text-xs text-gray-400">
            {formatDateShortHe(plan.startDate)} - {formatDateShortHe(plan.endDate)}
          </p>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800">
            <Pencil size={16} />
          </button>
          <button onClick={onDelete} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800">
            <Trash2 size={16} />
          </button>
        </div>
      </CardHeader>
      <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{plan.objectives}</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {plan.trainingTypes.map((t) => (
          <Badge key={t} color="blue">
            {TRAINING_TYPE_LABELS[t]}
          </Badge>
        ))}
      </div>
      {plan.notes && <p className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">{plan.notes}</p>}
    </Card>
  );
}
