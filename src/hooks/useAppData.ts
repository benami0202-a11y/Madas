import { useSyncExternalStore } from 'react';
import * as repo from '@/lib/db/repository';
import type { AppData } from '@/types';

/** Subscribes the component to the whole app data store; re-renders on any mutation. */
export function useAppData(): AppData {
  return useSyncExternalStore(repo.subscribe, repo.getSnapshot, repo.getSnapshot);
}

export { repo };
