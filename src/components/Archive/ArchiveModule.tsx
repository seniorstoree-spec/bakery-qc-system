import React,{useEffect,useState} from 'react';
import {searchArchive} from '../../services/archiveService';

export const ArchiveModule=()=>{
 const [code,setCode]=useState('');
 const [date,setDate]=useState('');
 const [reports,setReports]=useState<any[]>([]);
 const load=async()=>setReports(await searchArchive({code,date}));
 useEffect(()=>{load()},[]);
 return <div dir="rtl" className="space-y-4">
  <h1 className="text-2xl font-bold">📁 الأرشيف</h1>
  <div className="flex gap-2 flex-wrap">
   <input className="border rounded p-2" placeholder="كود التقرير" value={code} onChange={e=>setCode(e.target.value)}/>
   <input className="border rounded p-2" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
   <button className="px-4 py-2 rounded bg-rose-600 text-white" onClick={load}>بحث</button>
  </div>
  <div className="grid gap-3">{reports.map(r=><div key={r.id} className="p-4 rounded-xl border bg-white"><b>{r.report_code||'تقرير بدون كود'}</b><div>{r.report_date}</div><div>{r.report_type}</div></div>)}</div>
 </div>
}
