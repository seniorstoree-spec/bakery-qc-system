import { supabase } from '../lib/supabase';
import type { DailyQualityReport } from '../types/dailyReport';

export async function getDailyQualityReport(id: string) {
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as DailyQualityReport;
}

export async function updateDailyQualityReport(id: string, patch: Partial<DailyQualityReport>) {
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as DailyQualityReport;
}

export async function closeDailyQualityReport(id: string) {
  return updateDailyQualityReport(id, {
    status: 'closed',
    closedAt: new Date().toISOString()
  });
}

export async function archiveDailyQualityReport(id: string) {
  return updateDailyQualityReport(id, {
    status: 'archived'
  });
}
