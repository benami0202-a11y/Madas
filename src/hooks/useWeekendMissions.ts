import { useAppData, repo } from '@/hooks/useAppData';

export function useWeekendMissions() {
  const data = useAppData();
  return {
    weekendMissions: [...data.weekendMissions].sort((a, b) => a.weekNumber - b.weekNumber),
    addWeekendMission: repo.addWeekendMission,
    updateWeekendMission: repo.updateWeekendMission,
    deleteWeekendMission: repo.deleteWeekendMission,
    toggleMissionCompletion: repo.toggleMissionCompletion,
  };
}
