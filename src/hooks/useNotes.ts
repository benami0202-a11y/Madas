import { useMemo } from 'react';
import { useAppData, repo } from '@/hooks/useAppData';

export function useNotes(cadetId?: string) {
  const data = useAppData();
  const notes = useMemo(
    () =>
      (cadetId ? data.notes.filter((n) => n.cadetId === cadetId) : data.notes).sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    [data.notes, cadetId],
  );
  return { notes, addNote: repo.addNote, deleteNote: repo.deleteNote };
}
