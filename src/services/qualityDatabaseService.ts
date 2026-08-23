import { supabase } from '../lib/supabaseClient';

export const QUALITY_TABLES = {
  operatingParams: 'operating_parameters',
  defectLogs: 'defect_logs',
  coreTemperatures: 'core_temperature_records',
  metalDetector: 'metal_detector_records',
  electricSieve: 'electric_sieve_records',
  additiveWeights: 'additive_weight_records',
  sensoryEvaluations: 'sensory_evaluations',
  ncr: 'ncr_records',
  sanitationLogs: 'daily_sanitation_logs',
  sanitationChecks: 'sanitation_equipment_checks',
  foodSafetyLogs: 'daily_food_safety_logs',
  foodSafetyChecks: 'food_safety_item_checks',
  releaseForms: 'finished_product_release_forms',
  releaseItems: 'release_product_items',
  productWeights: 'product_weight_specs',
  qualityReports: 'quality_reports',
  inspectionItems: 'inspection_items',
  checkResults: 'quality_check_results',
} as const;

type TableName = typeof QUALITY_TABLES[keyof typeof QUALITY_TABLES];
type Row = Record<string, unknown>;

const assertConfigured = () => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are not configured.');
  }
};

export async function listRows<T = Row>(table: TableName, filters?: Record<string, unknown>): Promise<T[]> {
  assertConfigured();
  let query = supabase.from(table).select('*');
  for (const [key, value] of Object.entries(filters ?? {})) query = query.eq(key, value);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function createRow<T = Row>(table: TableName, payload: Row): Promise<T> {
  assertConfigured();
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data as T;
}

export async function updateRow<T = Row>(table: TableName, id: string, payload: Row): Promise<T> {
  assertConfigured();
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data as T;
}

export async function deleteRow(table: TableName, id: string): Promise<void> {
  assertConfigured();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function loadQualityReport(reportId: string) {
  assertConfigured();
  const [{ data: report, error: reportError }, { data: results, error: resultsError }] = await Promise.all([
    supabase.from(QUALITY_TABLES.qualityReports).select('*').eq('id', reportId).single(),
    supabase.from(QUALITY_TABLES.checkResults).select('*').eq('report_id', reportId),
  ]);
  if (reportError) throw reportError;
  if (resultsError) throw resultsError;
  return { report, results: results ?? [] };
}

export async function loadInspectionItems() {
  assertConfigured();
  const { data, error } = await supabase.from(QUALITY_TABLES.inspectionItems).select('*').order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function createQualityReportWithResults(
  report: Row,
  results: Row[],
) {
  assertConfigured();
  const { data: createdReport, error: reportError } = await supabase
    .from(QUALITY_TABLES.qualityReports)
    .insert(report)
    .select()
    .single();
  if (reportError) throw reportError;

  if (results.length) {
    const rows = results.map((result) => ({ ...result, report_id: createdReport.id }));
    const { error: resultsError } = await supabase.from(QUALITY_TABLES.checkResults).insert(rows);
    if (resultsError) {
      await supabase.from(QUALITY_TABLES.qualityReports).delete().eq('id', createdReport.id);
      throw resultsError;
    }
  }

  return createdReport;
}
