import { supabase } from '../lib/supabase';
import {
  DailyFoodSafetyLog,
  DailySanitationLog,
  FinishedProductReleaseForm,
  FoodSafetyItemCheck,
  SanitationEquipmentCheck,
  ReleaseProductItem,
} from '../types';
import { QUALITY_TABLES } from './qualityDataService';

const toSnake = (key: string) => key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

function serialize<T extends Record<string, unknown>>(value: T) {
  const result: Record<string, unknown> = {};
  Object.entries(value).forEach(([key, val]) => {
    if (key === 'id' || key === 'createdAt') return;
    result[toSnake(key)] = val;
  });
  return result;
}

function deserialize<T>(row: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  Object.entries(row).forEach(([key, val]) => {
    const camel = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camel] = val;
  });
  return result as T;
}

export async function listQualityTable<T = Record<string, unknown>>(table: keyof typeof QUALITY_TABLES, date?: string) {
  let query = supabase.from(QUALITY_TABLES[table]).select('*').order('created_at', { ascending: false });
  if (date && !['operatingParameters'].includes(table)) query = query.eq('date', date);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(row => deserialize<T>(row));
}

export async function createQualityRow<T = Record<string, unknown>>(table: keyof typeof QUALITY_TABLES, value: Record<string, unknown>) {
  const { data, error } = await supabase.from(QUALITY_TABLES[table]).insert(serialize(value)).select().single();
  if (error) throw error;
  return deserialize<T>(data);
}

export async function updateQualityRow<T = Record<string, unknown>>(table: keyof typeof QUALITY_TABLES, id: string, value: Record<string, unknown>) {
  const { data, error } = await supabase.from(QUALITY_TABLES[table]).update(serialize(value)).eq('id', id).select().single();
  if (error) throw error;
  return deserialize<T>(data);
}

export async function deleteQualityRow(table: keyof typeof QUALITY_TABLES, id: string) {
  const { error } = await supabase.from(QUALITY_TABLES[table]).delete().eq('id', id);
  if (error) throw error;
}

async function saveSanitation(log: DailySanitationLog) {
  const parent = await createQualityRow<DailySanitationLog>('sanitation', log);
  const { error: deleteError } = await supabase.from(QUALITY_TABLES.sanitationChecks).delete().eq('log_id', parent.id);
  if (deleteError) throw deleteError;
  if (log.items.length) {
    const rows = log.items.map((item: SanitationEquipmentCheck) => ({
      log_id: parent.id,
      equipment_name: item.equipmentName,
      equipment_code: item.equipmentCode,
      morning_start: item.morningShift.startShift,
      morning_end: item.morningShift.endShift,
      morning_notes: item.morningShift.notes ?? null,
      evening_start: item.eveningShift.startShift,
      evening_end: item.eveningShift.endShift,
      evening_notes: item.eveningShift.notes ?? null,
    }));
    const { error } = await supabase.from(QUALITY_TABLES.sanitationChecks).insert(rows);
    if (error) throw error;
  }
  return parent;
}

async function updateSanitation(log: DailySanitationLog) {
  const parent = await updateQualityRow<DailySanitationLog>('sanitation', log.id, log);
  const { error: deleteError } = await supabase.from(QUALITY_TABLES.sanitationChecks).delete().eq('log_id', log.id);
  if (deleteError) throw deleteError;
  if (log.items.length) {
    const rows = log.items.map((item: SanitationEquipmentCheck) => ({
      log_id: log.id,
      equipment_name: item.equipmentName,
      equipment_code: item.equipmentCode,
      morning_start: item.morningShift.startShift,
      morning_end: item.morningShift.endShift,
      morning_notes: item.morningShift.notes ?? null,
      evening_start: item.eveningShift.startShift,
      evening_end: item.eveningShift.endShift,
      evening_notes: item.eveningShift.notes ?? null,
    }));
    const { error } = await supabase.from(QUALITY_TABLES.sanitationChecks).insert(rows);
    if (error) throw error;
  }
  return parent;
}

async function hydrateSanitation(parent: DailySanitationLog) {
  const { data, error } = await supabase.from(QUALITY_TABLES.sanitationChecks).select('*').eq('log_id', parent.id).order('id');
  if (error) throw error;
  return {
    ...parent,
    items: (data ?? []).map(row => ({
      equipmentName: row.equipment_name,
      equipmentCode: row.equipment_code,
      morningShift: { startShift: row.morning_start, endShift: row.morning_end, notes: row.morning_notes ?? undefined },
      eveningShift: { startShift: row.evening_start, endShift: row.evening_end, notes: row.evening_notes ?? undefined },
    })),
  } as DailySanitationLog;
}

async function saveFoodSafety(log: DailyFoodSafetyLog) {
  const parent = await createQualityRow<DailyFoodSafetyLog>('foodSafety', log);
  const { error: deleteError } = await supabase.from(QUALITY_TABLES.foodSafetyChecks).delete().eq('log_id', parent.id);
  if (deleteError) throw deleteError;
  if (log.checks.length) {
    const rows = log.checks.map((item: FoodSafetyItemCheck) => ({
      log_id: parent.id,
      category: item.category,
      criterion: item.criterion,
      morning_start: item.morningShift.startShift,
      morning_mid: item.morningShift.midShift,
      morning_notes: item.morningShift.notes ?? null,
      evening_start: item.eveningShift.startShift,
      evening_mid: item.eveningShift.midShift,
      evening_notes: item.eveningShift.notes ?? null,
    }));
    const { error } = await supabase.from(QUALITY_TABLES.foodSafetyChecks).insert(rows);
    if (error) throw error;
  }
  return parent;
}

async function updateFoodSafety(log: DailyFoodSafetyLog) {
  const parent = await updateQualityRow<DailyFoodSafetyLog>('foodSafety', log.id, log);
  const { error: deleteError } = await supabase.from(QUALITY_TABLES.foodSafetyChecks).delete().eq('log_id', log.id);
  if (deleteError) throw deleteError;
  if (log.checks.length) {
    const rows = log.checks.map((item: FoodSafetyItemCheck) => ({
      log_id: log.id,
      category: item.category,
      criterion: item.criterion,
      morning_start: item.morningShift.startShift,
      morning_mid: item.morningShift.midShift,
      morning_notes: item.morningShift.notes ?? null,
      evening_start: item.eveningShift.startShift,
      evening_mid: item.eveningShift.midShift,
      evening_notes: item.eveningShift.notes ?? null,
    }));
    const { error } = await supabase.from(QUALITY_TABLES.foodSafetyChecks).insert(rows);
    if (error) throw error;
  }
  return parent;
}

async function hydrateFoodSafety(parent: DailyFoodSafetyLog) {
  const { data, error } = await supabase.from(QUALITY_TABLES.foodSafetyChecks).select('*').eq('log_id', parent.id).order('id');
  if (error) throw error;
  return {
    ...parent,
    checks: (data ?? []).map(row => ({
      id: row.id,
      category: row.category,
      criterion: row.criterion,
      morningShift: { startShift: row.morning_start, midShift: row.morning_mid, notes: row.morning_notes ?? undefined },
      eveningShift: { startShift: row.evening_start, midShift: row.evening_mid, notes: row.evening_notes ?? undefined },
    })),
  } as DailyFoodSafetyLog;
}

async function saveRelease(form: FinishedProductReleaseForm) {
  const parentPayload = {
    date: form.date,
    day: form.day,
    bakerySection: form.bakerySection,
    rawMaterialsCompliant: form.mandatoryConditions.rawMaterialsCompliant,
    ccpOprpReportsCompliant: form.mandatoryConditions.ccpOprpReportsCompliant,
    labAnalysisCompliant: form.mandatoryConditions.labAnalysisCompliant,
    labelAndPackagingCompliant: form.mandatoryConditions.labelAndPackagingCompliant,
    customerRequirementsCompliant: form.mandatoryConditions.customerRequirementsCompliant,
    decision: form.decision,
    notes: form.notes,
    qaReleaseOfficerName: form.qaReleaseOfficerName,
    qaReleaseOfficerSignature: form.qaReleaseOfficerSignature,
    qaReleaseOfficerTimestamp: form.qaReleaseOfficerTimestamp,
    storekeeperName: form.storekeeperName,
    storekeeperSignature: form.storekeeperSignature,
    storekeeperTimestamp: form.storekeeperTimestamp,
  };
  const parent = form.id ? await updateQualityRow<FinishedProductReleaseForm>('releaseForms', form.id, parentPayload) : await createQualityRow<FinishedProductReleaseForm>('releaseForms', parentPayload);
  const { error: deleteError } = await supabase.from(QUALITY_TABLES.releaseItems).delete().eq('release_form_id', parent.id);
  if (deleteError) throw deleteError;
  if (form.products.length) {
    const rows = form.products.map((item: ReleaseProductItem) => ({ release_form_id: parent.id, product_name: item.productName, unit: item.unit, quantity: item.quantity }));
    const { error } = await supabase.from(QUALITY_TABLES.releaseItems).insert(rows);
    if (error) throw error;
  }
  return parent;
}

async function hydrateRelease(form: FinishedProductReleaseForm) {
  const { data, error } = await supabase.from(QUALITY_TABLES.releaseItems).select('*').eq('release_form_id', form.id).order('id');
  if (error) throw error;
  return {
    ...form,
    mandatoryConditions: {
      rawMaterialsCompliant: form.rawMaterialsCompliant,
      ccpOprpReportsCompliant: form.ccpOprpReportsCompliant,
      labAnalysisCompliant: form.labAnalysisCompliant,
      labelAndPackagingCompliant: form.labelAndPackagingCompliant,
      customerRequirementsCompliant: form.customerRequirementsCompliant,
    },
    products: (data ?? []).map(row => ({ id: row.id, productName: row.product_name, unit: row.unit, quantity: Number(row.quantity) })),
  } as unknown as FinishedProductReleaseForm;
}

export async function loadAllQualityForms(date: string) {
  const [operatingParameters, defects, coreTemperatures, metalDetector, electricSieve, additiveWeights, sensoryEvaluations, ncr, sanitationParents, foodSafetyParents, releaseParents, productWeights] = await Promise.all([
    listQualityTable('operatingParameters'),
    listQualityTable('defects', date),
    listQualityTable('coreTemperatures', date),
    listQualityTable('metalDetector', date),
    listQualityTable('electricSieve', date),
    listQualityTable('additiveWeights', date),
    listQualityTable('sensoryEvaluations', date),
    listQualityTable('ncr', date),
    listQualityTable<DailySanitationLog>('sanitation', date),
    listQualityTable<DailyFoodSafetyLog>('foodSafety', date),
    listQualityTable<FinishedProductReleaseForm>('releaseForms', date),
    listQualityTable('productWeights', date),
  ]);

  const [sanitationLogB1, foodSafetyLog, releaseForms] = await Promise.all([
    Promise.all((sanitationParents as DailySanitationLog[]).map(hydrateSanitation)),
    Promise.all((foodSafetyParents as DailyFoodSafetyLog[]).map(hydrateFoodSafety)),
    Promise.all((releaseParents as FinishedProductReleaseForm[]).map(hydrateRelease)),
  ]);

  return {
    operatingParameters,
    defects,
    coreTemperatures,
    metalDetector,
    electricSieve,
    additiveWeights,
    sensoryEvaluations,
    ncr,
    sanitationLogs: sanitationLogB1,
    foodSafetyLogs: foodSafetyLog,
    releaseForms,
    productWeights,
  };
}

export const qualityFormPersistence = {
  create: createQualityRow,
  update: updateQualityRow,
  remove: deleteQualityRow,
  saveSanitation,
  updateSanitation,
  saveFoodSafety,
  updateFoodSafety,
  saveRelease,
};
