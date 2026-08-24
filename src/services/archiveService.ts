import { supabase } from '../lib/supabase';
import type { DailyQualityReport } from '../types/dailyReport';

export interface ArchiveMonth {
  year: number;
  month: number;
  monthName: string;
  reportCount: number;
}

const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

const mapDailyReport = (row: any): DailyQualityReport => ({
  id: row.id,
  reportDate: row.report_date,
  status: row.status,
  createdBy: row.created_by ?? undefined,
  createdAt: row.created_at ?? undefined,
  closedAt: row.closed_at ?? undefined,
  sectionsCompleted: row.sections_completed ?? undefined,
  totalSections: row.total_sections ?? undefined,
});

const getAuthUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
};

const getLocalDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export async function getOrCreateDailyReport(reportDate: string): Promise<DailyQualityReport> {
  const { data: existing, error: findError } = await supabase
    .from('daily_quality_reports')
    .select('*')
    .eq('report_date', reportDate)
    .eq('department', 'bakery')
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return mapDailyReport(existing);

  const authUserId = await getAuthUserId();
  const { data: created, error: createError } = await supabase
    .from('daily_quality_reports')
    .insert({
      report_date: reportDate,
      department: 'bakery',
      status: 'open',
      created_by: authUserId,
      total_sections: 8,
    })
    .select()
    .single();

  if (createError) {
    if (createError.code === '23505') {
      const { data: concurrent } = await supabase
        .from('daily_quality_reports')
        .select('*')
        .eq('report_date', reportDate)
        .eq('department', 'bakery')
        .single();
      if (concurrent) return mapDailyReport(concurrent);
    }
    throw createError;
  }

  return mapDailyReport(created);
}

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
    const [year, month] = String(row.report_date).split('-').map(Number);
    const key = `${year}-${month}`;
    const current = map.get(key);
    if (current) current.reportCount++;
    else map.set(key, {
      year,
      month,
      monthName: monthNames[month - 1] ?? String(month),
      reportCount: 1,
    });
  }
  return [...map.values()].sort((a, b) => b.year - a.year || b.month - a.month);
}

export async function listArchiveReports(year: number, month: number): Promise<DailyQualityReport[]> {
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
  return (data ?? []).map(mapDailyReport);
}

export async function getArchiveReport(reportId: string): Promise<DailyQualityReport> {
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error) throw error;
  return mapDailyReport(data);
}

export async function saveArchiveReport(reportId: string, patch: Partial<DailyQualityReport>): Promise<DailyQualityReport> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.reportDate !== undefined) dbPatch.report_date = patch.reportDate;
  if (patch.status !== undefined) dbPatch.status = patch.status;
  if (patch.closedAt !== undefined) dbPatch.closed_at = patch.closedAt;
  if (patch.sectionsCompleted !== undefined) dbPatch.sections_completed = patch.sectionsCompleted;
  if (patch.totalSections !== undefined) dbPatch.total_sections = patch.totalSections;

  const { data, error } = await supabase
    .from('daily_quality_reports')
    .update(dbPatch)
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return mapDailyReport(data);
}

export async function archiveReport(reportId?: string): Promise<DailyQualityReport> {
  const report = reportId ? await getArchiveReport(reportId) : await getOrCreateDailyReport(getLocalDate());

  const archivedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from('daily_quality_reports')
    .update({
      status: 'archived',
      closed_at: archivedAt,
      archived_at: archivedAt,
    })
    .eq('id', report.id)
    .eq('department', 'bakery')
    .select()
    .single();

  if (error) throw error;
  return mapDailyReport(data);
}
