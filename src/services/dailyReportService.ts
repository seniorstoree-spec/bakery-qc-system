import { supabase } from '../lib/supabase';
import type { DailyQualityReport } from '../types/dailyReport';

/**
 * Master report service
 * A single quality report per day for bakery section.
 * Evening shift starts the report and morning shift continues it.
 */
export const dailyReportService = {
  async getOrCreate(date: string, createdBy?: string | null) {
    const { data: existing, error: findError } = await supabase
      .from('daily_quality_reports')
      .select('*')
      .eq('report_date', date)
      .eq('department', 'bakery')
      .maybeSingle();

    if (findError) throw findError;
    if (existing) return existing as DailyQualityReport;

    const { data, error } = await supabase
      .from('daily_quality_reports')
      .insert({
        report_date: date,
        department: 'bakery',
        status: 'open',
        created_by: createdBy ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as DailyQualityReport;
  },

  async close(reportId: string) {
    const { data, error } = await supabase
      .from('daily_quality_reports')
      .update({ status: 'closed', closed_at: new Date().toISOString() })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data as DailyQualityReport;
  },
};
