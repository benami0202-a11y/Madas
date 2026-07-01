import { Badge } from '@/components/ui/Badge';
import type { FitnessLevel } from '@/types';
import { FITNESS_LEVEL_LABELS } from '@/types';

export function FitnessLevelBadge({ level }: { level: FitnessLevel }) {
  return <Badge color={level}>{FITNESS_LEVEL_LABELS[level]}</Badge>;
}
