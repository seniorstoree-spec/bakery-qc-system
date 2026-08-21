import { saveRecord, updateRecord, deleteRecord } from './appDataSync';

export const saveQCRecord = async (table: string, data: any) => {
  try {
    return await saveRecord(table, data);
  } catch (error) {
    console.error(`QC sync save failed for ${table}:`, error);
    return null;
  }
};

export const updateQCRecord = async (table: string, id: string, data: any) => {
  try {
    return await updateRecord(table, id, data);
  } catch (error) {
    console.error(`QC sync update failed for ${table}:`, error);
    return null;
  }
};

export const deleteQCRecord = async (table: string, id: string) => {
  try {
    return await deleteRecord(table, id);
  } catch (error) {
    console.error(`QC sync delete failed for ${table}:`, error);
    return null;
  }
};
