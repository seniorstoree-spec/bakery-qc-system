import React, { useEffect, useState } from 'react';
import { Archive, FileText, Save, X } from 'lucide-react';
import { getArchiveReport, listArchiveMonths, listArchiveReports, saveArchiveReport } from '../../services/archiveService';
import type { ArchiveMonth } from '../../services/archiveService';
import type { DailyQualityReport } from '../../types/dailyReport';

export const ArchiveModule: React.FC = () => {
  const [months, setMonths] = useState<ArchiveMonth[]>([]);
  const [reports, setReports] = useState<DailyQualityReport[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<ArchiveMonth | null>(null);
  const [selected, setSelected] = useState<DailyQualityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMonths = async () => {
    setLoading(true);
    try { setMonths(await listArchiveMonths()); } catch(e:any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const loadReports = async (m: ArchiveMonth) => {
    setSelectedMonth(m);
    setReports(await listArchiveReports(m.year, m.month));
  };

  useEffect(() => { void loadMonths(); }, []);

  const open = async (id:string) => {
    setSelected(await getArchiveReport(id));
  };

  const save = async () => {
    if (!selected) return;
    await saveArchiveReport(selected.id, selected);
    setSelected(null);
    if(selectedMonth) await loadReports(selectedMonth);
  };

  if(selected) return <div dir="rtl" className="p-5 space-y-4">
    <div className="flex justify-between"><h1 className="text-2xl font-bold">تعديل التقرير المؤرشف</h1><button onClick={()=>setSelected(null)}><X/></button></div>
    <input className="border p-2 rounded-xl" value={selected.reportDate} onChange={e=>setSelected({...selected,reportDate:e.target.value})}/>
    <button onClick={save} className="bg-rose-600 text-white p-3 rounded-xl flex gap-2"><Save/> حفظ</button>
  </div>;

  return <div dir="rtl" className="p-5 space-y-5">
    <h1 className="text-2xl font-bold flex gap-2"><Archive/> الأرشيف</h1>
    {error && <div>{error}</div>}
    <div className="flex gap-2 flex-wrap">{months.map(m=><button key={`${m.year}-${m.month}`} onClick={()=>void loadReports(m)} className="border p-3 rounded-xl">{m.monthName} {m.year}</button>)}</div>
    <div>{reports.map(r=><button key={r.id} onClick={()=>void open(r.id)} className="w-full text-right border p-3 rounded-xl my-2 flex gap-2"><FileText/> تقرير {r.reportDate}</button>)}</div>
  </div>;
};
