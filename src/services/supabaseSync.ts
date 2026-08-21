import { dataRepository } from './dataRepository';

/**
 * Central synchronization helpers.
 * Keeps database communication outside UI components.
 */
export const supabaseSync = {
  async create(table: string, payload: unknown) {
    return dataRepository.insert(table, payload);
  },

  async list(table: string) {
    return dataRepository.select(table);
  },

  async remove(table: string, id: string) {
    return dataRepository.remove(table, id);
  },
};
