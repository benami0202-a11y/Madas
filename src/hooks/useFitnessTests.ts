import { useAppData, repo } from '@/hooks/useAppData';

export function useFitnessTests() {
  const data = useAppData();
  return {
    fitnessTests: data.fitnessTests,
    upsertFitnessTest: repo.upsertFitnessTest,
  };
}
