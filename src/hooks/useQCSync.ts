import { useCallback } from 'react';
import { saveQCRecord, updateQCRecord, deleteQCRecord } from '../services/qcDataService';

export function useQCSync() {
  const saveRecord = useCallback(async (table: string, data: unknown) => saveQCRecord(table, data), []);
  const updateRecord = useCallback(async (table: string, id: string, data: unknown) => updateQCRecord(table, id, data), []);
  const deleteRecord = useCallback(async (table: string, id: string) => deleteQCRecord(table, id), []);
  return { saveRecord, updateRecord, deleteRecord };
}

export default useQCSync;
