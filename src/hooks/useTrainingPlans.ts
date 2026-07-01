import { useAppData, repo } from '@/hooks/useAppData';

export function useTrainingPlans() {
  const data = useAppData();
  return {
    trainingPlans: [...data.trainingPlans].sort((a, b) => a.weekNumber - b.weekNumber),
    addTrainingPlan: repo.addTrainingPlan,
    updateTrainingPlan: repo.updateTrainingPlan,
    deleteTrainingPlan: repo.deleteTrainingPlan,
  };
}
