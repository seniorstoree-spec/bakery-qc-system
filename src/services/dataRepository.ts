import { supabase } from '../lib/supabase';

type Row = Record<string, unknown>;

export const dataRepository = {
  async insert(table: string, payload: unknown) {
    const { data, error } = await supabase.from(table).insert(payload as Row).select().single();
    if (error) throw error;
    return data as Row;
  },

  async getAll(table: string) {
    return this.select(table);
  },

  async select(table: string) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return (data ?? []) as Row[];
  },

  async update(table: string, id: string, payload: unknown) {
    const { data, error } = await supabase.from(table).update(payload as Row).eq('id', id).select().single();
    if (error) throw error;
    return data as Row;
  },

  async remove(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};
