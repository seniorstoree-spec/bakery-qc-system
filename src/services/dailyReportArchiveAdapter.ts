import { supabase } from '../lib/supabase';

/**
 * Adapter for the new master daily quality report archive.
 * Keeps archive operations based on one report per day.
 */
export async function listDailyArchiveReports(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const next = new Date(year, month, 1);
  const end = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`;

  const { data, error } = await supabase
    .from('daily_quality_reports')
    .select('*')
    .eq('department', 'bakery')
    .gte('report_date', start)
    .lt('report_date', end)
    .order('report_date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function archiveDailyReport(reportId: string) {
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .update({ status: 'archived', archived_at: new Date().toISOString() })
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
