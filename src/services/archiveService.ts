import { supabase } from '../lib/supabase';
import { loadAllQualityForms } from './qualityPersistenceService';
import type { DailyQualityReport } from '../types/dailyReport';

export interface ArchiveMonth { year:number; month:number; monthName:string; reportCount:number; }
export interface ArchivedReportDetails extends DailyQualityReport { reportSnapshot: Record<string, unknown>; }

const monthNames=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const mapDailyReport=(row:any):DailyQualityReport=>({id:row.id,reportDate:row.report_date,status:row.status,createdBy:row.created_by??undefined,createdAt:row.created_at??undefined,closedAt:row.closed_at??undefined,sectionsCompleted:row.sections_completed??undefined,totalSections:row.total_sections??undefined});
const mapArchivedReport=(row:any):ArchivedReportDetails=>({...mapDailyReport(row),reportSnapshot:(row.report_snapshot&&typeof row.report_snapshot==='object')?row.report_snapshot:{}});
const getLocalDate=()=>{const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;};

export async function getOrCreateDailyReport(reportDate:string):Promise<DailyQualityReport>{
  const {data:existing,error:findError}=await supabase.from('daily_quality_reports').select('*').eq('report_date',reportDate).eq('department','bakery').maybeSingle();
  if(findError)throw findError;if(existing)return mapDailyReport(existing);
  const {data:{user}}=await supabase.auth.getUser();
  const {data:created,error:createError}=await supabase.from('daily_quality_reports').insert({report_date:reportDate,department:'bakery',status:'open',created_by:user?.id??null,total_sections:8}).select().single();
  if(createError){if(createError.code==='23505'){const{data:concurrent}=await supabase.from('daily_quality_reports').select('*').eq('report_date',reportDate).eq('department','bakery').single();if(concurrent)return mapDailyReport(concurrent);}throw createError;}
  return mapDailyReport(created);
}

export async function listArchiveMonths():Promise<ArchiveMonth[]>{const{data,error}=await supabase.from('daily_quality_reports').select('report_date').eq('department','bakery').eq('status','archived').order('report_date',{ascending:false});if(error)throw error;const map=new Map<string,ArchiveMonth>();for(const row of data??[]){if(!row.report_date)continue;const[year,month]=String(row.report_date).split('-').map(Number);const key=`${year}-${month}`;const current=map.get(key);if(current)current.reportCount++;else map.set(key,{year,month,monthName:monthNames[month-1]??String(month),reportCount:1});}return[...map.values()].sort((a,b)=>b.year-a.year||b.month-a.month);}

export async function listArchiveReports(year:number,month:number):Promise<ArchivedReportDetails[]>{const start=`${year}-${String(month).padStart(2,'0')}-01`;const next=new Date(year,month,1);const end=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-01`;const{data,error}=await supabase.from('daily_quality_reports').select('*').eq('department','bakery').eq('status','archived').gte('report_date',start).lt('report_date',end).order('report_date',{ascending:false});if(error)throw error;return(data??[]).map(mapArchivedReport);}

export async function getArchiveReport(reportId:string):Promise<ArchivedReportDetails>{
  const{data,error}=await supabase.from('daily_quality_reports').select('*').eq('id',reportId).eq('department','bakery').single();
  if(error)throw error;
  const mapped=mapArchivedReport(data);
  if(Object.keys(mapped.reportSnapshot).length>0)return mapped;
  try{return{...mapped,reportSnapshot:await loadAllQualityForms(mapped.reportDate)}}catch{return mapped;}
}

/**
 * Save the report metadata AND refresh the immutable report snapshot from the
 * current database records. Previously this function only updated metadata,
 * so pressing "حفظ التعديل" could appear successful while the report data
 * remained unchanged. The snapshot is now rebuilt from the same date before
 * every save, including all time fields stored by the individual sections.
 */
export async function saveArchiveReport(reportId:string,patch:Partial<DailyQualityReport>):Promise<ArchivedReportDetails>{
  const current=await getArchiveReport(reportId);
  const reportDate=patch.reportDate??current.reportDate;
  const dbPatch:Record<string,unknown>={report_date:reportDate};
  if(patch.status!==undefined)dbPatch.status=patch.status;
  if(patch.closedAt!==undefined)dbPatch.closed_at=patch.closedAt;
  if(patch.sectionsCompleted!==undefined)dbPatch.sections_completed=patch.sectionsCompleted;
  if(patch.totalSections!==undefined)dbPatch.total_sections=patch.totalSections;
  const snapshot=await loadAllQualityForms(reportDate);
  dbPatch.report_snapshot=snapshot;
  const{data,error}=await supabase.from('daily_quality_reports').update(dbPatch).eq('id',reportId).eq('department','bakery').select().single();
  if(error)throw error;
  return mapArchivedReport(data);
}

export async function archiveReport(reportId?:string):Promise<ArchivedReportDetails>{
  const report=reportId?await getArchiveReport(reportId):await getOrCreateDailyReport(getLocalDate());
  const snapshot=await loadAllQualityForms(report.reportDate);
  const archivedAt=new Date().toISOString();
  const{data,error}=await supabase.from('daily_quality_reports').update({status:'archived',closed_at:archivedAt,archived_at:archivedAt,report_snapshot:snapshot}).eq('id',report.id).eq('department','bakery').select().single();
  if(error)throw error;
  return mapArchivedReport(data);
}
