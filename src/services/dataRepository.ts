import { supabase } from './supabaseClient';

/**
 * Unified data access layer.
 * Keeps database operations isolated from AppContext during migration.
 */

export async function insertRecord<T extends Record<string, unknown>>(table: string, payload: T) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function fetchRecords(table: string) {
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function removeRecord(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function updateRecord(table: string, id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
