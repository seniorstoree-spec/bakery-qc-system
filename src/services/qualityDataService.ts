import { supabase } from '../lib/supabaseClient';

export async function getOperatingParameters() {
  const { data, error } = await supabase
    .from('operating_parameters_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addOperatingParameter(payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('operating_parameters_logs')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCoreTemperatures() {
  const { data, error } = await supabase
    .from('core_temperature_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMetalDetectorLogs() {
  const { data, error } = await supabase
    .from('metal_detector_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
