import { useMemo, useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { cadetAttendancePercent, cadetTotalScore } from '@/lib/selectors';
import { FITNESS_LEVEL_LABELS, TEAM_LABELS } from '@/types';

export function useGlobalSearch() {
  const data = useAppData();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return data.cadets
      .map((cadet) => ({
        cadet,
        score: cadetTotalScore(data, cadet.id),
        attendance: cadetAttendancePercent(data, cadet.id),
      }))
      .filter(({ cadet, score, attendance }) => {
        const haystack = [
          cadet.fullName,
          TEAM_LABELS[cadet.team],
          FITNESS_LEVEL_LABELS[cadet.fitnessLevel],
          String(score),
          String(attendance),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 8);
  }, [data, query]);

  return { query, setQuery, results };
}
