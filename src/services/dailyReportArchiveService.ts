import { supabase } from '../lib/supabase';
import type { DailyQualityReport } from '../types/dailyReport';

/**
 * Archive access for the master daily bakery quality report.
 * Keeps archived reports grouped by date/month.
 */
export async function listDailyArchiveReports(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const next = new Date(year, month, 1);
  const end = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`;

  const { data, error } = await supabase
    .from('daily_quality_reports')
    .select('*')
    .eq('department', 'bakery')
    .eq('status', 'archived')
    .gte('report_date', start)
    .lt('report_date', end)
    .order('report_date', { ascending: false });

  if (error) throw error;
  return (data ?? []) as DailyQualityReport[];
}

export async function archiveDailyReport(reportId: string) {
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .update({ status: 'archived' })
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data as DailyQualityReport;
}
