import { supabase } from './supabaseClient';
import { DailyFoodSafetyLog, DailySanitationLog } from '../types';

// NOTE: archiveService is intentionally defensive because archived reports can contain
// legacy snapshots and/or rows from the dedicated checklist tables.

const isUsefulSection = (value: unknown) => {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.length > 0;
  return Object.keys(value as Record<string, unknown>).length > 0;
};

const mergeIpcRows = (existing: unknown, live: unknown): Array<Record<string, unknown>> => {
  const rows = [
    ...(Array.isArray(existing) ? existing : []),
    ...(Array.isArray(live) ? live : []),
  ].filter((row): row is Record<string, unknown> => !!row && typeof row === 'object');

  const map = new Map<string, Record<string, unknown>>();
  for (const row of rows) {
    const productName = String(row.productName ?? row.product ?? '').trim();
    if (!productName) continue;
    const rawStatus = String(row.complianceStatus ?? row.status ?? '').toLowerCase();
    const complianceStatus = rawStatus.includes('noncompliant') || rawStatus.includes('غير مطابق')
      ? 'noncompliant'
      : rawStatus.includes('compliant') || rawStatus.includes('مطابق')
        ? 'compliant'
        : '';
    if (!complianceStatus) continue;
    map.set(productName, {
      productName,
      status: complianceStatus === 'compliant' ? 'مطابق ✓' : 'غير مطابق ×',
      complianceStatus,
      reason: complianceStatus === 'noncompliant' ? String(row.reason ?? '') : '',
      savedAt: row.savedAt ?? row.saved_at ?? new Date().toISOString(),
    });
  }
  return [...map.values()];
};

const pickExistingOrLive = (...values: unknown[]) => values.find(isUsefulSection);

async function loadSanitationDirect(reportDate: string): Promise<DailySanitationLog[]> {
  try {
    const { data: parents, error } = await supabase
      .from('daily_sanitation_logs')
      .select('*')
      .eq('date', reportDate)
      .eq('bakery_section', 1);
    if (error || !parents) return [];

    const result: DailySanitationLog[] = [];
    for (const parent of parents) {
      const { data: items } = await supabase
        .from('daily_sanitation_log_items')
        .select('*')
        .eq('log_id', parent.id);
      const mappedItems = (items ?? []).map((item: Record<string, any>) => ({
        id: item.id,
        category: item.category,
        equipment: item.equipment,
        morningShift: {
          startShift: item.morning_start,
          midShift: item.morning_mid,
          endShift: item.morning_end,
          notes: item.morning_notes ?? undefined,
        },
        eveningShift: {
          startShift: item.evening_start,
          midShift: item.evening_mid,
          endShift: item.evening_end,
          notes: item.evening_notes ?? undefined,
        },
      }));
      result.push({
        id: parent.id,
        date: parent.date,
        day: parent.day,
        bakerySection: parent.bakery_section ?? parent.bakerySection,
        inspectorSignature: parent.inspector_signature ?? parent.inspectorSignature,
        items: mappedItems,
      });
    }
    return result;
  } catch (error) {
    console.warn('Direct sanitation archive load failed', error);
    return [];
  }
}

async function loadFoodSafetyDirect(reportDate: string): Promise<DailyFoodSafetyLog[]> {
  try {
    const { data: parents, error } = await supabase
      .from('daily_food_safety_logs')
      .select('*')
      .eq('date', reportDate)
      .eq('bakery_section', 1);
    if (error || !parents) return [];

    const result: DailyFoodSafetyLog[] = [];
    for (const parent of parents) {
      const { data: items } = await supabase
        .from('daily_food_safety_log_items')
        .select('*')
        .eq('log_id', parent.id);
      const mappedChecks = (items ?? []).map((item: Record<string, any>) => ({
        id: item.id,
        category: item.category,
        criterion: item.criterion,
        morningShift: {
          startShift: item.morning_start,
          midShift: item.morning_mid,
          notes: item.morning_notes ?? undefined,
        },
        eveningShift: {
          startShift: item.evening_start,
          midShift: item.evening_mid,
          notes: item.evening_notes ?? undefined,
        },
      }));
      result.push({
        id: parent.id,
        date: parent.date,
        day: parent.day,
        bakerySection: parent.bakery_section ?? parent.bakerySection,
        inspectorSignature: parent.inspector_signature ?? parent.inspectorSignature,
        checks: mappedChecks,
      });
    }
    return result;
  } catch (error) {
    console.warn('Direct food safety archive load failed', error);
    return [];
  }
}

export async function buildArchiveSnapshot(reportDate: string, existing: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  const { data: liveSnapshot } = await supabase
    .from('quality_report_snapshots')
    .select('*')
    .eq('date', reportDate)
    .maybeSingle();

  const directDefects = [];
  const sanitationDirect = await loadSanitationDirect(reportDate);
  const foodSafetyDirect = await loadFoodSafetyDirect(reportDate);
  const liveIpc: unknown = [];

  const merged: Record<string, unknown> = { ...existing };
  const live = (liveSnapshot as Record<string, unknown> | null)?.snapshot;
  if (isUsefulSection(live)) Object.assign(merged, live as Record<string, unknown>);

  merged.sanitationLogs = pickExistingOrLive(merged.sanitationLogs, sanitationDirect) ?? sanitationDirect;
  merged.foodSafetyLogs = pickExistingOrLive(merged.foodSafetyLogs, foodSafetyDirect) ?? foodSafetyDirect;
  merged.defects = pickExistingOrLive(merged.defects, directDefects) ?? directDefects;
  merged.ipcCompliance = mergeIpcRows(merged.ipcCompliance, liveIpc);

  return merged;
}

export const createArchiveSnapshot = buildArchiveSnapshot;
