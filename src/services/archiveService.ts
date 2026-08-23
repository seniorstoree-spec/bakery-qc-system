import { supabase } from '../lib/supabase';

const monthNames=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

export async function ensureArchiveFolder(date=new Date()) {
  const year=date.getFullYear();
  const month=date.getMonth()+1;
  const {data,error}=await supabase.from('archive_folders').upsert({year,month,month_name:monthNames[month-1]},{onConflict:'year,month'}).select().single();
  if(error) throw error;
  return data;
}

export async function archiveReport(input:{reportId:string;reportType:string;reportCode?:string;reportDate:string}) {
  const folder=await ensureArchiveFolder(new Date(input.reportDate));
  const {data,error}=await supabase.from('archived_reports').upsert({
    report_id:input.reportId,
    report_type:input.reportType,
    report_code:input.reportCode,
    report_date:input.reportDate,
    archive_folder_id:folder.id
  },{onConflict:'report_id,report_type'}).select().single();
  if(error) throw error;
  return data;
}

export async function searchArchive(filters:{folderId?:string;date?:string;code?:string}) {
  let query=supabase.from('archived_reports').select('*, archive_folders(*)').order('report_date',{ascending:false});
  if(filters.folderId) query=query.eq('archive_folder_id',filters.folderId);
  if(filters.date) query=query.eq('report_date',filters.date);
  if(filters.code) query=query.ilike('report_code',`%${filters.code}%`);
  const {data,error}=await query;
  if(error) throw error;
  return data||[];
}
