import { useCallback } from 'react';
import qcDataService from '../services/qcDataService';

/**
 * Central hook for QC data synchronization.
 * Keeps persistence logic outside AppContext.
 */
export function useQCSync() {
  const saveRecord = useCallback(async (table: string, data: unknown) => {
    return qcDataService.save(table, data);
  }, []);

  const updateRecord = useCallback(async (table: string, id: string, data: unknown) => {
    return qcDataService.update(table, id, data);
  }, []);

  const deleteRecord = useCallback(async (table: string, id: string) => {
    return qcDataService.remove(table, id);
  }, []);

  return {
    saveRecord,
    updateRecord,
    deleteRecord,
  };
}

export default useQCSync;
