import { supabase } from '../lib/supabaseClient';

/**
 * Temporary synchronization layer between AppContext and Supabase.
 * Keeps database operations isolated before migrating all modules.
 */
export async function saveRecord(table: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error(`Supabase insert failed for ${table}:`, error);
    return null;
  }

  return result;
}

export async function deleteRecord(table: string, id: string) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Supabase delete failed for ${table}:`, error);
    return false;
  }

  return true;
}

export async function updateRecord(table: string, id: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Supabase update failed for ${table}:`, error);
    return null;
  }

  return result;
}
