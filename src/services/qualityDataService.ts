import { supabase } from '../lib/supabase';

export const QUALITY_TABLES = {
  operatingParameters: 'operating_parameters',
  defects: 'defect_logs',
  coreTemperatures: 'core_temperature_records',
  metalDetector: 'metal_detector_records',
  electricSieve: 'electric_sieve_records',
  additiveWeights: 'additive_weight_records',
  sensoryEvaluations: 'sensory_evaluations',
  ncr: 'ncr_records',
  sanitation: 'daily_sanitation_logs',
  sanitationChecks: 'sanitation_equipment_checks',
  foodSafety: 'daily_food_safety_logs',
  foodSafetyChecks: 'food_safety_item_checks',
  releaseForms: 'finished_product_release_forms',
  releaseItems: 'release_product_items',
  productWeights: 'product_weight_specs',
  reports: 'quality_reports',
  inspectionItems: 'inspection_items',
  checkResults: 'quality_check_results',
} as const;

type TableName = (typeof QUALITY_TABLES)[keyof typeof QUALITY_TABLES];

export async function listRows<T = Record<string, unknown>>(table: TableName) {
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function listByDate<T = Record<string, unknown>>(table: TableName, date: string) {
  const { data, error } = await supabase.from(table).select('*').eq('date', date).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function createRow<T = Record<string, unknown>>(table: TableName, payload: Record<string, unknown>) {
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data as T;
}

export async function updateRow<T = Record<string, unknown>>(table: TableName, id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data as T;
}

export async function deleteRow(table: TableName, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function loadDailyQualityData(date: string) {
  const [reports, operatingParameters, defects, coreTemperatures, metalDetector, electricSieve, additiveWeights, sensoryEvaluations, ncr, sanitation, foodSafety, releaseForms, productWeights] = await Promise.all([
    listByDate(QUALITY_TABLES.reports, date),
    listByDate(QUALITY_TABLES.operatingParameters, date),
    listByDate(QUALITY_TABLES.defects, date),
    listByDate(QUALITY_TABLES.coreTemperatures, date),
    listByDate(QUALITY_TABLES.metalDetector, date),
    listByDate(QUALITY_TABLES.electricSieve, date),
    listByDate(QUALITY_TABLES.additiveWeights, date),
    listByDate(QUALITY_TABLES.sensoryEvaluations, date),
    listByDate(QUALITY_TABLES.ncr, date),
    listByDate(QUALITY_TABLES.sanitation, date),
    listByDate(QUALITY_TABLES.foodSafety, date),
    listByDate(QUALITY_TABLES.releaseForms, date),
    listByDate(QUALITY_TABLES.productWeights, date),
  ]);

  return { reports, operatingParameters, defects, coreTemperatures, metalDetector, electricSieve, additiveWeights, sensoryEvaluations, ncr, sanitation, foodSafety, releaseForms, productWeights };
}
