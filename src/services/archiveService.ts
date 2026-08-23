import { supabase } from '../lib/supabase';
import type { DailyQualityReport } from '../types/dailyReport';

export interface ArchiveMonth {
  year: number;
  month: number;
  monthName: string;
  reportCount: number;
}

const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

export async function listArchiveMonths(): Promise<ArchiveMonth[]> {
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .select('report_date')
    .eq('department', 'bakery')
    .eq('status', 'archived')
    .order('report_date', { ascending: false });

  if (error) throw error;

  const map = new Map<string, ArchiveMonth>();
  for (const row of data ?? []) {
    if (!row.report_date) continue;
    const [yearText, monthText] = String(row.report_date).split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    const key = `${year}-${month}`;
    const current = map.get(key);
    if (current) current.reportCount += 1;
    else map.set(key, { year, month, monthName: monthNames[month - 1], reportCount: 1 });
  }

  return [...map.values()].sort((a, b) => b.year - a.year || b.month - a.month);
}

export async function listArchiveReports(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 1);
  const end = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-01`;

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

export async function getArchiveReport(reportId: string) {
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error) throw error;
  return data as DailyQualityReport;
}

export async function archiveReport(reportId: string) {
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .update({ status: 'archived' })
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data as DailyQualityReport;
}
