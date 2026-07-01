import { useMemo } from 'react';
import { useAppData, repo } from '@/hooks/useAppData';
import { buildLeaderboard } from '@/lib/selectors';

export function useScores() {
  const data = useAppData();
  const leaderboard = useMemo(() => buildLeaderboard(data), [data]);
  return {
    scores: data.scores,
    leaderboard,
    addScore: repo.addScore,
    deleteScore: repo.deleteScore,
  };
}
