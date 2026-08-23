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
  const { data, error } = await supabase.from('daily_quality_reports').select('reportDate').eq('status','archived').order('reportDate',{ascending:false});
  if (error) throw error;
  const map = new Map<string, ArchiveMonth>();
  for (const row of data ?? []) {
    const date = row.reportDate;
    if (!date) continue;
    const [year, month] = String(date).split('-').map(Number);
    const key = `${year}-${month}`;
    const current = map.get(key);
    if (current) current.reportCount++;
    else map.set(key,{year,month,monthName:monthNames[month-1],reportCount:1});
  }
  return [...map.values()].sort((a,b)=>b.year-a.year || b.month-a.month);
}

export async function listArchiveReports(year:number, month:number): Promise<DailyQualityReport[]> {
  const start = `${year}-${String(month).padStart(2,'0')}-01`;
  const next = new Date(year, month, 1);
  const end = `${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-01`;
  const {data,error}=await supabase.from('daily_quality_reports').select('*').eq('status','archived').gte('reportDate',start).lt('reportDate',end).order('reportDate',{ascending:false});
  if(error) throw error;
  return (data ?? []) as DailyQualityReport[];
}

export async function getArchiveReport(reportId:string) {
  const {data,error}=await supabase.from('daily_quality_reports').select('*').eq('id',reportId).single();
  if(error) throw error;
  return data as DailyQualityReport;
}

export async function saveArchiveReport(reportId:string, patch:Partial<DailyQualityReport>) {
  const {data,error}=await supabase.from('daily_quality_reports').update(patch).eq('id',reportId).select().single();
  if(error) throw error;
  return data as DailyQualityReport;
}
