import qcDataService from './qcDataService';

/**
 * Bridge layer between the current Context implementation and the new data service.
 * Allows gradual migration without rewriting AppContext at once.
 */
const qcBridge = {
  async save(table: string, data: unknown) {
    try {
      return await qcDataService.save(table, data);
    } catch (error) {
      console.error('QC Bridge save error:', error);
      return null;
    }
  },

  async update(table: string, id: string, data: unknown) {
    try {
      return await qcDataService.update(table, id, data);
    } catch (error) {
      console.error('QC Bridge update error:', error);
      return null;
    }
  },

  async remove(table: string, id: string) {
    try {
      return await qcDataService.remove(table, id);
    } catch (error) {
      console.error('QC Bridge delete error:', error);
      return null;
    }
  },
};

export default qcBridge;
