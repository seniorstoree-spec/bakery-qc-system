import { supabase } from '../lib/supabaseClient';

export type SyncModule =
  | 'operating_parameters_logs'
  | 'core_temperature_logs'
  | 'metal_detector_logs'
  | 'electric_sieve_logs'
  | 'additive_weight_logs'
  | 'sensory_evaluations';

export async function syncInsert(module: SyncModule, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(module)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function syncList(module: SyncModule) {
  const { data, error } = await supabase
    .from(module)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function syncDelete(module: SyncModule, id: string) {
  const { error } = await supabase
    .from(module)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
