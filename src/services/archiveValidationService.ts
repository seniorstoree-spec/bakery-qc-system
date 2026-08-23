import { supabase } from '../lib/supabase';

export async function validateArchivedDailyReport(reportId: string) {
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .select('id,status,department,report_date')
    .eq('id', reportId)
    .single();

  if (error) throw error;

  return {
    valid: Boolean(data && data.status === 'archived' && data.department === 'bakery'),
    report: data,
  };
}
