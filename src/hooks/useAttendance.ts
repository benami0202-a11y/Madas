import { useMemo } from 'react';
import { useAppData, repo } from '@/hooks/useAppData';

export function useAttendance() {
  const data = useAppData();

  const sessions = useMemo(() => {
    const map = new Map<string, { date: string; sessionName: string }>();
    for (const record of data.attendance) {
      const key = `${record.date}__${record.sessionName}`;
      if (!map.has(key)) map.set(key, { date: record.date, sessionName: record.sessionName });
    }
    return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [data.attendance]);

  return {
    attendance: data.attendance,
    sessions,
    upsertAttendance: repo.upsertAttendance,
    deleteAttendance: repo.deleteAttendance,
    setAttendance: repo.setAttendance,
  };
}
