import { supabase } from '../lib/supabase';

export interface QualityReport {
  id?: string;
  date: string;
  section: 'bakery';
  created_by?: string | null;
  shift: string;
  status: 'draft' | 'submitted' | 'approved';
  created_at?: string;
}

export interface InspectionItem {
  id: string;
  section?: string | null;
  category: string;
  item_name: string;
  order_number?: number | null;
  active?: boolean | null;
  created_at?: string;
}

export interface QualityCheckResult {
  id?: string;
  report_id: string;
  item_id: string;
  result?: string | null;
  notes?: string | null;
  created_at?: string;
}

const getAuthUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
};

export const qualityReportsService = {
  async list(date?: string) {
    let query = supabase
      .from('quality_reports')
      .select('*')
      .eq('section', 'bakery')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (date) query = query.eq('date', date);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as QualityReport[];
  },

  async get(reportId: string) {
    const [{ data: report, error: reportError }, { data: results, error: resultsError }] = await Promise.all([
      supabase.from('quality_reports').select('*').eq('id', reportId).single(),
      supabase.from('quality_check_results').select('*').eq('report_id', reportId).order('created_at'),
    ]);

    if (reportError) throw reportError;
    if (resultsError) throw resultsError;

    return {
      report: report as QualityReport,
      results: (results ?? []) as QualityCheckResult[],
    };
  },

  async getInspectionItems() {
    const { data, error } = await supabase
      .from('inspection_items')
      .select('*')
      .eq('active', true)
      .or('section.is.null,section.eq.bakery')
      .order('order_number', { ascending: true });

    if (error) throw error;
    return (data ?? []) as InspectionItem[];
  },

  async create(report: Omit<QualityReport, 'id' | 'created_by' | 'section'>, results: Omit<QualityCheckResult, 'id' | 'report_id'>[] = []) {
    const authUserId = await getAuthUserId();

    const { data: createdReport, error: reportError } = await supabase
      .from('quality_reports')
      .insert({
        date: report.date,
        section: 'bakery',
        created_by: authUserId,
        shift: report.shift,
        status: report.status,
      })
      .select()
      .single();

    if (reportError) throw reportError;

    if (results.length > 0) {
      const { error: resultsError } = await supabase
        .from('quality_check_results')
        .insert(results.map((result) => ({ ...result, report_id: createdReport.id })));

      if (resultsError) {
        await supabase.from('quality_reports').delete().eq('id', createdReport.id);
        throw resultsError;
      }
    }

    return createdReport as QualityReport;
  },

  async update(reportId: string, patch: Partial<Pick<QualityReport, 'date' | 'shift' | 'status'>>) {
    const { data, error } = await supabase
      .from('quality_reports')
      .update(patch)
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data as QualityReport;
  },

  async saveResults(reportId: string, results: Omit<QualityCheckResult, 'id' | 'report_id'>[]) {
    const { error: deleteError } = await supabase
      .from('quality_check_results')
      .delete()
      .eq('report_id', reportId);

    if (deleteError) throw deleteError;
    if (!results.length) return [] as QualityCheckResult[];

    const { data, error } = await supabase
      .from('quality_check_results')
      .insert(results.map((result) => ({ ...result, report_id: reportId })))
      .select();

    if (error) throw error;
    return (data ?? []) as QualityCheckResult[];
  },

  async remove(reportId: string) {
    const { error } = await supabase.from('quality_reports').delete().eq('id', reportId);
    if (error) throw error;
  },
};
