import { useAppData, repo } from '@/hooks/useAppData';

export function useSettings() {
  const data = useAppData();
  return {
    settings: data.settings,
    updateSettings: repo.updateSettings,
    exportAllData: repo.exportAllData,
    importAllData: repo.importAllData,
    resetToSeedData: repo.resetToSeedData,
  };
}
