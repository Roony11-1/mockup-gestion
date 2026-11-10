import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { STORAGE_KEY, loadData } from '../lib/mockData';
import type { CampusData } from '../lib/types';

interface CampusDataState {
  data: CampusData | null;
  loading: boolean;
  setData: Dispatch<SetStateAction<CampusData | null>>;
  refresh: () => void;
}

export function useCampusData(): CampusDataState {
  const [data, setData] = useState<CampusData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setData(loadData());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) refresh();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refresh]);

  return { data, loading, setData, refresh };
}
