import React, { useEffect, useState } from 'react';
import { Archive, FileText, Save, X, Package, Thermometer, ShieldCheck } from 'lucide-react';
import { getArchiveReport, listArchiveMonths, listArchiveReports, saveArchiveReport, type ArchivedReportDetails } from '../../services/archiveService';
import type { ArchiveMonth } from '../../services/archiveService';

const pretty=(value:unknown)=>typeof value==='string'||typeof value==='number'||typeof value==='boolean'?String(value):JSON.stringify(value,null,2);

export const ArchiveModule:React.FC=()=>{
  const [months,setMonths]=useState<ArchiveMonth[]>([]);const [reports,setReports]=useState<ArchivedReportDetails[]>([]);const [selectedMonth,setSelectedMonth]=useState<ArchiveMonth|null>(null);const [selected,setSelected]=useState<ArchivedReportDetails|null>(null);const [loading,setLoading]=useState(false);const [error,setError]=useState('');
  const loadMonths=async()=>{setLoading(true);setError('');try{setMonths(await listArchiveMonths())}catch(e:any){setError(e?.message||'تعذر تحميل الأرشيف')}finally{setLoading(false)}};
  const loadReports=async(m:ArchiveMonth)=>{setLoading(true);setError('');setSelectedMonth(m);try{setReports(await listArchiveReports(m.year,m.month))}catch(e:any){setError(e?.message||'تعذر تحميل التقارير')}finally{setLoading(false)}};
  useEffect(()=>{void loadMonths()},[]);
  const open=async(id:string)=>{setLoading(true);setError('');try{setSelected(await getArchiveReport(id))}catch(e:any){setError(e?.message||'تعذر فتح التقرير المؤرشف')}finally{setLoading(false)}};
  const save=async()=>{if(!selected)return;setLoading(true);try{await saveArchiveReport(selected.id,selected);setSelected(null);if(selectedMonth)await loadReports(selectedMonth)}catch(e:any){setError(e?.message||'تعذر حفظ التقرير')}finally{setLoading(false)}};

  if(selected)return <div dir="rtl" className="p-5 space-y-5">
    <div className="flex justify-between items-center"><div><h1 className="text-2xl font-black">التقرير المؤرشف — {selected.reportDate}</h1><p className="text-sm text-slate-500">الحالة: {selected.status} — هذا التقرير نسخة محفوظة وقت الأرشفة.</p></div><button onClick={()=>setSelected(null)}><X/></button></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3"><div className="border rounded-2xl p-4"><b>التاريخ</b><div>{selected.reportDate}</div></div><div className="border rounded-2xl p-4"><b>الحالة</b><div>{selected.status}</div></div><div className="border rounded-2xl p-4"><b>الأقسام</b><div>{selected.sectionsCompleted??0} / {selected.totalSections??0}</div></div></div>
    <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5"><h2 className="font-black flex gap-2 items-center"><Package className="w-5 h-5"/>إذن الإفراج عن المنتج التام</h2>
      {selected.reportSnapshot?.releaseForms ? <pre className="mt-4 whitespace-pre-wrap text-xs overflow-auto bg-slate-50 dark:bg-slate-950 rounded-xl p-4">{pretty(selected.reportSnapshot.releaseForms)}</pre> : <p className="mt-3 text-sm text-amber-600">لا توجد لقطة محفوظة لإذن الإفراج لهذا التقرير.</p>}
    </div>
    <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5"><h2 className="font-black flex gap-2 items-center"><Thermometer className="w-5 h-5"/>بيانات التقرير التشغيلية</h2><pre className="mt-4 whitespace-pre-wrap text-xs overflow-auto bg-slate-50 dark:bg-slate-950 rounded-xl p-4 max-h-[55vh]">{pretty(selected.reportSnapshot)}</pre></div>
    <div className="flex gap-2"><button onClick={save} disabled={loading} className="bg-rose-600 text-white p-3 rounded-xl flex gap-2 items-center disabled:opacity-50"><Save/>حفظ التعديل</button><button onClick={()=>setSelected(null)} className="border p-3 rounded-xl">رجوع</button></div>
  </div>;

  return <div dir="rtl" className="p-5 space-y-5"><h1 className="text-2xl font-black flex gap-2"><Archive/> الأرشيف</h1>{error&&<div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">{error}</div>}<div className="flex gap-2 flex-wrap">{months.map(m=><button key={`${m.year}-${m.month}`} onClick={()=>void loadReports(m)} className="border p-3 rounded-xl">{m.monthName} {m.year} ({m.reportCount})</button>)}</div><div>{loading&&!reports.length?<div className="p-4 text-slate-500">جارٍ التحميل...</div>:reports.map(r=><button key={r.id} onClick={()=>void open(r.id)} className="w-full text-right border p-4 rounded-xl my-2 flex gap-3 items-center hover:border-rose-400"><FileText/><div><div className="font-bold">تقرير {r.reportDate}</div><div className="text-xs text-slate-500">الحالة: {r.status} — {r.reportSnapshot?.releaseForms?'بيانات التقرير محفوظة':'لا توجد لقطة قديمة'}</div></div></button>)}</div>{selectedMonth&&<button onClick={()=>{setSelectedMonth(null);setReports([])}} className="border p-3 rounded-xl">رجوع للشهور</button>}</div>;
};
