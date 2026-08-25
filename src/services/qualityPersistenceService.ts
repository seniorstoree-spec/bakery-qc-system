import { supabase } from '../lib/supabase';
import { DailyFoodSafetyLog, DailySanitationLog, FinishedProductReleaseForm, FoodSafetyItemCheck, SanitationEquipmentCheck, ReleaseProductItem, OperatingParametersLog, DefectItemRow, CoreTemperatureRecord, MetalDetectorRecord, ElectricSieveRecord, AdditiveWeightRecord, SensoryEvaluationRecord, NonConformanceRecord, ProductWeightSpecRecord } from '../types';
import { QUALITY_TABLES } from './qualityDataService';

const toSnake = (key: string) => key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const isUuid = (value?: string) => !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const dateFields = new Set(['date', 'doughProductionDate', 'debrisProductionDate', 'packagingExpiryDate', 'packagingProductionDate']);

function serialize(value: object) {
  const result: Record<string, unknown> = {};
  Object.entries(value as Record<string, unknown>).forEach(([key, val]) => {
    if (key === 'id' || key === 'createdAt') return;
    result[toSnake(key)] = dateFields.has(key) && val === '' ? null : val;
  });
  return result;
}

function deserialize<T>(row: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  Object.entries(row).forEach(([key, val]) => {
    result[key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())] = val;
  });
  return result as T;
}

export async function listQualityTable<T = Record<string, unknown>>(table: keyof typeof QUALITY_TABLES, date?: string) {
  let query = supabase.from(QUALITY_TABLES[table]).select('*').order('created_at', { ascending: false });
  if (date) query = query.eq('date', date);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(row => deserialize<T>(row));
}

const safeListQualityTable = async <T = Record<string, unknown>>(table: keyof typeof QUALITY_TABLES, date: string) => {
  try {
    return await listQualityTable<T>(table, date);
  } catch (error) {
    console.warn(`Archive/report read skipped ${String(table)}`, error);
    return [] as T[];
  }
};

export async function createQualityRow<T = any>(table: keyof typeof QUALITY_TABLES, value: object) {
  const { data, error } = await supabase.from(QUALITY_TABLES[table]).insert(serialize(value)).select().single();
  if (error) throw error;
  return deserialize<T>(data);
}

export async function updateQualityRow<T = any>(table: keyof typeof QUALITY_TABLES, id: string, value: object) {
  const { data, error } = await supabase.from(QUALITY_TABLES[table]).update(serialize(value)).eq('id', id).select().single();
  if (error) throw error;
  return deserialize<T>(data);
}

export async function deleteQualityRow(table: keyof typeof QUALITY_TABLES, id: string) {
  const { error } = await supabase.from(QUALITY_TABLES[table]).delete().eq('id', id);
  if (error) throw error;
}

async function replaceSanitationItems(logId: string, items: SanitationEquipmentCheck[]) {
  const { error: deleteError } = await supabase.from(QUALITY_TABLES.sanitationChecks).delete().eq('log_id', logId);
  if (deleteError) throw deleteError;
  if (!items.length) return;
  const rows = items.map(item => ({
    log_id: logId,
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

async function saveSanitation(log: DailySanitationLog) {
  // The parent table stores only the log metadata; checklist rows live in sanitation_equipment_checks.
  // Do not send the nested `items` array to the parent table.
  const parentPayload = {
    date: log.date,
    day: log.day,
    bakerySection: log.bakerySection,
    inspectorSignature: log.inspectorSignature ?? null,
  };
  const parent = isUuid(log.id)
    ? await updateQualityRow<DailySanitationLog>('sanitation', log.id, parentPayload)
    : await createQualityRow<DailySanitationLog>('sanitation', parentPayload);
  await replaceSanitationItems(parent.id, log.items ?? []);
  // Return the hydrated in-memory shape so the UI does not lose the rows immediately after saving.
  return { ...parent, ...log, id: parent.id } as DailySanitationLog;
}

async function updateSanitation(log: DailySanitationLog) {
  return saveSanitation(log);
}

async function hydrateSanitation(parent: DailySanitationLog) {
  try {
    const { data, error } = await supabase
      .from(QUALITY_TABLES.sanitationChecks)
      .select('*')
      .eq('log_id', parent.id)
      .order('id');
    if (error) throw error;
    return {
      ...parent,
      items: (data ?? []).map(row => ({
        id: row.id,
        equipmentName: row.equipment_name,
        equipmentCode: row.equipment_code,
        morningShift: {
          startShift: row.morning_start,
          endShift: row.morning_end,
          notes: row.morning_notes ?? undefined,
        },
        eveningShift: {
          startShift: row.evening_start,
          endShift: row.evening_end,
          notes: row.evening_notes ?? undefined,
        },
      })),
    } as DailySanitationLog;
  } catch (error) {
    console.warn('Sanitation details read skipped', error);
    return { ...parent, items: [] } as DailySanitationLog;
  }
}

async function replaceFoodSafetyItems(logId: string, items: FoodSafetyItemCheck[]) {
  const { error: deleteError } = await supabase.from(QUALITY_TABLES.foodSafetyChecks).delete().eq('log_id', logId);
  if (deleteError) throw deleteError;
  if (!items.length) return;
  const rows = items.map(item => ({
    log_id: logId,
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

async function saveFoodSafety(log: DailyFoodSafetyLog) {
  // The parent table stores only metadata; checklist rows live in food_safety_item_checks.
  // Do not send the nested `checks` array to the parent table.
  const parentPayload = {
    date: log.date,
    day: log.day,
    bakerySection: log.bakerySection,
    inspectorSignature: log.inspectorSignature ?? null,
  };
  const parent = isUuid(log.id)
    ? await updateQualityRow<DailyFoodSafetyLog>('foodSafety', log.id, parentPayload)
    : await createQualityRow<DailyFoodSafetyLog>('foodSafety', parentPayload);
  await replaceFoodSafetyItems(parent.id, log.checks ?? []);
  // Return the hydrated in-memory shape so the UI keeps the checklist visible after saving.
  return { ...parent, ...log, id: parent.id } as DailyFoodSafetyLog;
}

async function updateFoodSafety(log: DailyFoodSafetyLog) {
  return saveFoodSafety(log);
}

async function hydrateFoodSafety(parent: DailyFoodSafetyLog) {
  try {
    const { data, error } = await supabase
      .from(QUALITY_TABLES.foodSafetyChecks)
      .select('*')
      .eq('log_id', parent.id)
      .order('id');
    if (error) throw error;
    return {
      ...parent,
      checks: (data ?? []).map(row => ({
        id: row.id,
        category: row.category,
        criterion: row.criterion,
        morningShift: {
          startShift: row.morning_start,
          midShift: row.morning_mid,
          notes: row.morning_notes ?? undefined,
        },
        eveningShift: {
          startShift: row.evening_start,
          midShift: row.evening_mid,
          notes: row.evening_notes ?? undefined,
        },
      })),
    } as DailyFoodSafetyLog;
  } catch (error) {
    console.warn('Food safety details read skipped', error);
    return { ...parent, checks: [] } as DailyFoodSafetyLog;
  }
}

async function replaceReleaseItems(formId: string, products: ReleaseProductItem[]) {
  const { error: deleteError } = await supabase.from(QUALITY_TABLES.releaseItems).delete().eq('release_form_id', formId);
  if (deleteError) throw deleteError;
  if (!products.length) return;
  const rows = products.map(item => ({
    release_form_id: formId,
    product_name: item.productName,
    unit: item.unit,
    quantity: item.quantity,
  }));
  const { error } = await supabase.from(QUALITY_TABLES.releaseItems).insert(rows);
  if (error) throw error;
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
    dailyReportId: form.dailyReportId,
  };
  const parent = isUuid(form.id)
    ? await updateQualityRow<FinishedProductReleaseForm>('releaseForms', form.id, parentPayload)
    : await createQualityRow<FinishedProductReleaseForm>('releaseForms', parentPayload);
  await replaceReleaseItems(parent.id, form.products);
  return { ...form, ...parent };
}

async function hydrateRelease(row: Record<string, unknown>) {
  try {
    const id = String(row.id);
    const { data, error } = await supabase.from(QUALITY_TABLES.releaseItems).select('*').eq('release_form_id', id).order('id');
    if (error) throw error;
    return {
      id,
      date: row.date,
      day: row.day,
      bakerySection: row.bakerySection,
      mandatoryConditions: {
        rawMaterialsCompliant: Boolean(row.rawMaterialsCompliant),
        ccpOprpReportsCompliant: Boolean(row.ccpOprpReportsCompliant),
        labAnalysisCompliant: Boolean(row.labAnalysisCompliant),
        labelAndPackagingCompliant: Boolean(row.labelAndPackagingCompliant),
        customerRequirementsCompliant: Boolean(row.customerRequirementsCompliant),
      },
      decision: row.decision,
      notes: row.notes ?? undefined,
      qaReleaseOfficerName: row.qaReleaseOfficerName,
      qaReleaseOfficerSignature: row.qaReleaseOfficerSignature ?? undefined,
      qaReleaseOfficerTimestamp: row.qaReleaseOfficerTimestamp ?? undefined,
      storekeeperName: row.storekeeperName,
      storekeeperSignature: row.storekeeperSignature ?? undefined,
      storekeeperTimestamp: row.storekeeperTimestamp ?? undefined,
      dailyReportId: row.dailyReportId ?? row.daily_report_id ?? undefined,
      products: (data ?? []).map(item => ({
        id: item.id,
        productName: item.product_name,
        unit: item.unit,
        quantity: Number(item.quantity),
      })),
    } as FinishedProductReleaseForm;
  } catch (error) {
    console.warn('Release item details read skipped', error);
    return {
      id: String(row.id),
      date: row.date,
      day: row.day,
      bakerySection: row.bakerySection,
      mandatoryConditions: {
        rawMaterialsCompliant: Boolean(row.rawMaterialsCompliant),
        ccpOprpReportsCompliant: Boolean(row.ccpOprpReportsCompliant),
        labAnalysisCompliant: Boolean(row.labAnalysisCompliant),
        labelAndPackagingCompliant: Boolean(row.labelAndPackagingCompliant),
        customerRequirementsCompliant: Boolean(row.customerRequirementsCompliant),
      },
      decision: row.decision,
      notes: row.notes ?? undefined,
      qaReleaseOfficerName: row.qaReleaseOfficerName,
      storekeeperName: row.storekeeperName,
      dailyReportId: row.dailyReportId ?? row.daily_report_id ?? undefined,
      products: [],
    } as FinishedProductReleaseForm;
  }
}

export async function loadAllQualityForms(date: string) {
  const [operatingParameters, defects, coreTemperatures, metalDetector, electricSieve, additiveWeights, sensoryEvaluations, ncr, sanitationParents, foodSafetyParents, releaseParents, productWeights] = await Promise.all([
    safeListQualityTable<OperatingParametersLog>('operatingParameters', date),
    safeListQualityTable<DefectItemRow>('defects', date),
    safeListQualityTable<CoreTemperatureRecord>('coreTemperatures', date),
    safeListQualityTable<MetalDetectorRecord>('metalDetector', date),
    safeListQualityTable<ElectricSieveRecord>('electricSieve', date),
    safeListQualityTable<AdditiveWeightRecord>('additiveWeights', date),
    safeListQualityTable<SensoryEvaluationRecord>('sensoryEvaluations', date),
    safeListQualityTable<NonConformanceRecord>('ncr', date),
    safeListQualityTable<DailySanitationLog>('sanitation', date),
    safeListQualityTable<DailyFoodSafetyLog>('foodSafety', date),
    safeListQualityTable<Record<string, unknown>>('releaseForms', date),
    safeListQualityTable<ProductWeightSpecRecord>('productWeights', date),
  ]);

  const [sanitationLogs, foodSafetyLogs, releaseForms] = await Promise.all([
    Promise.all(sanitationParents.map(hydrateSanitation)),
    Promise.all(foodSafetyParents.map(hydrateFoodSafety)),
    Promise.all(releaseParents.map(hydrateRelease)),
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
    sanitationLogs,
    foodSafetyLogs,
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