import { supabase } from '../lib/supabase';
import { loadAllQualityForms } from './qualityPersistenceService';
import { getIpcComplianceSnapshot } from '../utils/ipcComplianceControls';
import { INITIAL_SANITATION_LOG_B1, INITIAL_FOOD_SAFETY_LOG, INITIAL_RELEASE_FORM_B1, INITIAL_RELEASE_FORM_B2 } from '../data/initialData';
import type { DailyQualityReport } from '../types/dailyReport';

export interface ArchiveMonth { year:number; month:number; monthName:string; reportCount:number; }
export interface ArchivedReportDetails extends DailyQualityReport { reportSnapshot: Record<string, unknown>; }

const monthNames=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const mapDailyReport=(row:any):DailyQualityReport=>({id:row.id,reportDate:row.report_date,status:row.status,createdBy:row.created_by??undefined,createdAt:row.created_at??undefined,closedAt:row.closed_at??undefined,sectionsCompleted:row.sections_completed??undefined,totalSections:row.total_sections??undefined});
const mapArchivedReport=(row:any):ArchivedReportDetails=>({...mapDailyReport(row),reportSnapshot:(row.report_snapshot&&typeof row.report_snapshot==='object')?row.report_snapshot:{}});
const getLocalDate=()=>{const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;};

const isUsefulSection=(key:string,value:unknown)=>{
  if(!Array.isArray(value))return value!==null&&value!==undefined&&typeof value==='object'&&Object.keys(value as object).length>0;
  if(value.length===0)return false;
  if(key==='releaseForms')return value.some((row:any)=>Array.isArray(row?.products)&&row.products.length>0||row?.decision&&row.decision!=='pending'||row?.qaReleaseOfficerName||row?.storekeeperName);
  if(key==='sanitationLogs')return value.some((row:any)=>Array.isArray(row?.items)&&row.items.length>0);
  if(key==='foodSafetyLogs')return value.some((row:any)=>Array.isArray(row?.checks)&&row.checks.length>0);
  if(key==='ipcCompliance')return value.some((row:any)=>row?.productName&&(row?.complianceStatus==='compliant'||row?.complianceStatus==='noncompliant'));
  return true;
};

const legacyRecoverySnapshot=(reportDate:string):Record<string,unknown>=>{
  if(reportDate!=='2026-08-20')return {};
  return {sanitationLogs:[INITIAL_SANITATION_LOG_B1],foodSafetyLogs:[INITIAL_FOOD_SAFETY_LOG],releaseForms:[INITIAL_RELEASE_FORM_B1,INITIAL_RELEASE_FORM_B2]};
};

async function loadLiveSnapshot(reportDate:string):Promise<Record<string,unknown>>{try{return await loadAllQualityForms(reportDate) as Record<string,unknown>;}catch{return {};}}

async function buildArchiveSnapshot(reportDate:string,existing:Record<string,unknown>={}):Promise<Record<string,unknown>>{
  const live=await loadLiveSnapshot(reportDate);
  const legacy=legacyRecoverySnapshot(reportDate);
  const ipcCompliance=getIpcComplianceSnapshot(reportDate);
  const liveWithCompliance:Record<string,unknown>={...live, ...(ipcCompliance.length?{ipcCompliance}: {})};
  const keys=new Set([...Object.keys(existing),...Object.keys(liveWithCompliance),...Object.keys(legacy)]);
  const merged:Record<string,unknown>={};
  for(const key of keys){
    const liveValue=liveWithCompliance[key],existingValue=existing[key],legacyValue=legacy[key];
    if(isUsefulSection(key,liveValue))merged[key]=liveValue;
    else if(isUsefulSection(key,existingValue))merged[key]=existingValue;
    else if(isUsefulSection(key,legacyValue))merged[key]=legacyValue;
    else merged[key]=liveValue??existingValue??legacyValue??[];
  }
  return merged;
}

function hydrateArchivedSnapshot(reportDate:string,snapshot:Record<string,unknown>):Record<string,unknown>{
  const legacy=legacyRecoverySnapshot(reportDate);if(!Object.keys(legacy).length)return snapshot;const hydrated={...snapshot};
  for(const key of Object.keys(legacy)){if(!isUsefulSection(key,hydrated[key]))hydrated[key]=legacy[key];}
  return hydrated;
}

export async function getOrCreateDailyReport(reportDate:string):Promise<DailyQualityReport>{
  const {data:existing,error:findError}=await supabase.from('daily_quality_reports').select('*').eq('report_date',reportDate).eq('department','bakery').maybeSingle();
  if(findError)throw findError;if(existing)return mapDailyReport(existing);
  const {data:{user}}=await supabase.auth.getUser();
  const {data:created,error:createError}=await supabase.from('daily_quality_reports').insert({report_date:reportDate,department:'bakery',status:'open',created_by:user?.id??null,total_sections:8}).select().single();
  if(createError){if(createError.code==='23505'){const{data:concurrent}=await supabase.from('daily_quality_reports').select('*').eq('report_date',reportDate).eq('department','bakery').single();if(concurrent)return mapDailyReport(concurrent);}throw createError;}
  return mapDailyReport(created);
}

export async function listArchiveMonths():Promise<ArchiveMonth[]>{
  const{data,error}=await supabase.from('daily_quality_reports').select('report_date').eq('department','bakery').eq('status','archived').order('report_date',{ascending:false});if(error)throw error;
  const map=new Map<string,ArchiveMonth>();for(const row of data??[]){if(!row.report_date)continue;const[year,month]=String(row.report_date).split('-').map(Number);const key=`${year}-${month}`;const current=map.get(key);if(current)current.reportCount++;else map.set(key,{year,month,monthName:monthNames[month-1]??String(month),reportCount:1});}
  return[...map.values()].sort((a,b)=>b.year-a.year||b.month-a.month);
}

export async function listArchiveReports(year:number,month:number):Promise<ArchivedReportDetails[]>{
  const start=`${year}-${String(month).padStart(2,'0')}-01`;const next=new Date(year,month,1);const end=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-01`;
  const{data,error}=await supabase.from('daily_quality_reports').select('id,report_date,department,status,created_by,created_at,closed_at,sections_completed,total_sections').eq('department','bakery').eq('status','archived').gte('report_date',start).lt('report_date',end).order('report_date',{ascending:false});if(error)throw error;
  return(data??[]).map(row=>({...mapDailyReport(row),reportSnapshot:{}}));
}

export async function getArchiveReport(reportId:string):Promise<ArchivedReportDetails>{
  const{data,error}=await supabase.from('daily_quality_reports').select('*').eq('id',reportId).eq('department','bakery').single();if(error)throw error;const mapped=mapArchivedReport(data);
  return{...mapped,reportSnapshot:hydrateArchivedSnapshot(mapped.reportDate,mapped.reportSnapshot)};
}

export async function saveArchiveReport(reportId:string,patch:Partial<DailyQualityReport>):Promise<ArchivedReportDetails>{
  const current=await getArchiveReport(reportId);const reportDate=patch.reportDate??current.reportDate;const dbPatch:Record<string,unknown>={report_date:reportDate};
  if(patch.status!==undefined)dbPatch.status=patch.status;if(patch.closedAt!==undefined)dbPatch.closed_at=patch.closedAt;if(patch.sectionsCompleted!==undefined)dbPatch.sections_completed=patch.sectionsCompleted;if(patch.totalSections!==undefined)dbPatch.total_sections=patch.totalSections;
  dbPatch.report_snapshot=await buildArchiveSnapshot(reportDate,current.reportSnapshot);
  const{data,error}=await supabase.from('daily_quality_reports').update(dbPatch).eq('id',reportId).eq('department','bakery').select().single();if(error)throw error;return mapArchivedReport(data);
}

export async function archiveReport(reportId?:string):Promise<ArchivedReportDetails>{
  const report:DailyQualityReport|ArchivedReportDetails=reportId?await getArchiveReport(reportId):await getOrCreateDailyReport(getLocalDate());
  const existingSnapshot:Record<string,unknown>=reportId?(report as ArchivedReportDetails).reportSnapshot:{};
  const snapshot=await buildArchiveSnapshot(report.reportDate,existingSnapshot);const archivedAt=new Date().toISOString();
  const{data,error}=await supabase.from('daily_quality_reports').update({status:'archived',closed_at:archivedAt,archived_at:archivedAt,report_snapshot:snapshot}).eq('id',report.id).eq('department','bakery').select().single();if(error)throw error;return mapArchivedReport(data);
}
