import { saveQCRecord, updateQCRecord, deleteQCRecord } from './qcDataService';

const qcBridge = {
  async save(table: string, data: unknown) {
    try { return await saveQCRecord(table, data); } catch (error) { console.error('QC Bridge save error:', error); return null; }
  },
  async update(table: string, id: string, data: unknown) {
    try { return await updateQCRecord(table, id, data); } catch (error) { console.error('QC Bridge update error:', error); return null; }
  },
  async remove(table: string, id: string) {
    try { return await deleteQCRecord(table, id); } catch (error) { console.error('QC Bridge delete error:', error); return null; }
  },
};

export default qcBridge;
