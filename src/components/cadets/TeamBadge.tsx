import { Badge } from '@/components/ui/Badge';
import type { Team } from '@/types';
import { TEAM_LABELS } from '@/types';

const TEAM_TO_BADGE_COLOR: Record<Team, 'green' | 'blue' | 'orange'> = {
  green: 'green',
  blue: 'blue',
  orange: 'orange',
};

export function TeamBadge({ team }: { team: Team }) {
  return <Badge color={TEAM_TO_BADGE_COLOR[team]}>{TEAM_LABELS[team]}</Badge>;
}
