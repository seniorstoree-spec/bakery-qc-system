import { supabase } from '../lib/supabaseClient';

export const dataRepository = {
  async insert(table: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase.from(table).insert(payload).select().single();
    if (error) throw error;
    return data;
  },

  async getAll(table: string) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data ?? [];
  },

  async update(table: string, id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async remove(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
