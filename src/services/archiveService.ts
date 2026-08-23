import { supabase } from '../lib/supabase';
import { QualityReport, QualityCheckResult, InspectionItem } from './qualityReportsService';

export interface ArchiveMonth {
  year: number;
  month: number;
  monthName: string;
  reportCount: number;
}

const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

export async function listArchiveMonths(): Promise<ArchiveMonth[]> {
  const { data, error } = await supabase
    .from('quality_reports')
    .select('date')
    .eq('section', 'bakery')
    .order('date', { ascending: false });
  if (error) throw error;

  const map = new Map<string, ArchiveMonth>();
  for (const row of data ?? []) {
    if (!row.date) continue;
    const [yearText, monthText] = String(row.date).split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    if (!year || !month) continue;
    const key = `${year}-${month}`;
    const current = map.get(key);
    if (current) current.reportCount += 1;
    else map.set(key, { year, month, monthName: monthNames[month - 1] ?? String(month), reportCount: 1 });
  }
  return [...map.values()].sort((a, b) => b.year - a.year || b.month - a.month);
}

export async function listArchiveReports(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const next = new Date(year, month, 1);
  const end = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`;
  const { data, error } = await supabase
    .from('quality_reports')
    .select('*')
    .eq('section', 'bakery')
    .gte('date', start)
    .lt('date', end)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as QualityReport[];
}

export async function getArchiveReport(reportId: string) {
  const [{ data: report, error: reportError }, { data: results, error: resultsError }, { data: items, error: itemsError }] = await Promise.all([
    supabase.from('quality_reports').select('*').eq('id', reportId).single(),
    supabase.from('quality_check_results').select('*').eq('report_id', reportId).order('created_at'),
    supabase.from('inspection_items').select('*').eq('active', true).or('section.is.null,section.eq.bakery').order('order_number'),
  ]);
  if (reportError) throw reportError;
  if (resultsError) throw resultsError;
  if (itemsError) throw itemsError;
  return {
    report: report as QualityReport,
    results: (results ?? []) as QualityCheckResult[],
    items: (items ?? []) as InspectionItem[],
  };
}

export async function saveArchiveReport(
  reportId: string,
  patch: Partial<Pick<QualityReport, 'date' | 'shift' | 'status'>>,
  results: Omit<QualityCheckResult, 'id' | 'report_id'>[],
) {
  const { data: report, error: reportError } = await supabase
    .from('quality_reports')
    .update(patch)
    .eq('id', reportId)
    .select()
    .single();
  if (reportError) throw reportError;

  const { error: deleteError } = await supabase.from('quality_check_results').delete().eq('report_id', reportId);
  if (deleteError) throw deleteError;

  if (results.length) {
    const { error: insertError } = await supabase
      .from('quality_check_results')
      .insert(results.map(result => ({ ...result, report_id: reportId })));
    if (insertError) throw insertError;
  }
  return report as QualityReport;
}
