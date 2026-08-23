import { supabase } from '../lib/supabaseClient';

type Row = Record<string, unknown>;

function isSupabaseConfigured() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export const dataRepository = {
  async insert(table: string, payload: unknown) {
    if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.from(table).insert(payload as Row).select().single();
    if (error) throw error;
    return data as Row;
  },
  async getAll(table: string) { return this.select(table); },
  async select(table: string) {
    if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return (data ?? []) as Row[];
  },
  async update(table: string, id: string, payload: unknown) {
    if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.from(table).update(payload as Row).eq('id', id).select().single();
    if (error) throw error;
    return data as Row;
  },
  async remove(table: string, id: string) {
    if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};
