import { useEffect, useState } from 'react';
import { getOperatingParameters, getCoreTemperatures, getMetalDetectorLogs } from '../services/qualityDataService';

/**
 * تدريجيًا يتم استخدام هذا الـHook لنقل البيانات من LocalStorage إلى Supabase
 * بدون كسر الـState الحالي.
 */
export function useSupabaseSync() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [remoteData, setRemoteData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    let mounted = true;

    async function sync() {
      try {
        setSyncStatus('loading');
        const [operatingParams, temperatures, metalDetector] = await Promise.all([
          getOperatingParameters(),
          getCoreTemperatures(),
          getMetalDetectorLogs()
        ]);

        if (!mounted) return;

        setRemoteData({
          operatingParams,
          temperatures,
          metalDetector
        });
        setSyncStatus('success');
      } catch (error) {
        console.error('Supabase sync failed', error);
        if (mounted) setSyncStatus('error');
      }
    }

    sync();

    return () => {
      mounted = false;
    };
  }, []);

  return { syncStatus, remoteData };
}
