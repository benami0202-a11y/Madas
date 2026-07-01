import { useMemo } from 'react';
import { useAppData, repo } from '@/hooks/useAppData';
import type { Cadet } from '@/types';
import { cadetAttendancePercent, cadetTotalScore } from '@/lib/selectors';

export function useCadets() {
  const data = useAppData();

  const cadetsWithStats = useMemo(
    () =>
      data.cadets.map((cadet) => ({
        cadet,
        score: cadetTotalScore(data, cadet.id),
        attendance: cadetAttendancePercent(data, cadet.id),
      })),
    [data],
  );

  return {
    cadets: data.cadets,
    cadetsWithStats,
    addCadet: repo.addCadet,
    updateCadet: repo.updateCadet,
    deleteCadet: repo.deleteCadet,
  };
}

export function useCadet(cadetId: string | undefined) {
  const data = useAppData();
  const cadet = useMemo<Cadet | undefined>(() => data.cadets.find((c) => c.id === cadetId), [data, cadetId]);
  return { data, cadet, updateCadet: repo.updateCadet };
}
