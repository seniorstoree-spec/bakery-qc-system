import React, { useEffect, useState } from 'react';
import { Archive, FileText, Save, X, RefreshCw } from 'lucide-react';
import { getArchiveReport, listArchiveMonths, listArchiveReports, saveArchiveReport, isArchiveSchemaCacheError } from '../../services/archiveService';
import type { ArchiveMonth } from '../../services/archiveService';
import type { DailyQualityReport } from '../../types/dailyReport';

export const ArchiveModule: React.FC = () => {
  const [months, setMonths] = useState<ArchiveMonth[]>([]);
  const [reports, setReports] = useState<DailyQualityReport[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<ArchiveMonth | null>(null);
  const [selected, setSelected] = useState<DailyQualityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const humanizeError = (e: any) => {
    if (isArchiveSchemaCacheError(e)) {
      return 'قاعدة بيانات الأرشيف موجودة، لكن Supabase لم يحدّث Schema Cache بعد. اضغط إعادة المحاولة بعد لحظات.';
    }
    return e?.message || 'تعذر تحميل الأرشيف.';
  };

  const loadMonths = async () => {
    setLoading(true);
    setError('');
    try {
      setMonths(await listArchiveMonths());
    } catch (e: any) {
      setError(humanizeError(e));
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async (m: ArchiveMonth) => {
    setSelectedMonth(m);
    setLoading(true);
    setError('');
    try {
      setReports(await listArchiveReports(m.year, m.month));
    } catch (e: any) {
      setError(humanizeError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadMonths(); }, []);

  const open = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      setSelected(await getArchiveReport(id));
    } catch (e: any) {
      setError(humanizeError(e));
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      await saveArchiveReport(selected.id, selected);
      setSelected(null);
      if (selectedMonth) await loadReports(selectedMonth);
    } catch (e: any) {
      setError(humanizeError(e));
    } finally {
      setLoading(false);
    }
  };

  if (selected) return <div dir="rtl" className="p-5 space-y-4">
    <div className="flex justify-between"><h1 className="text-2xl font-bold">تعديل التقرير المؤرشف</h1><button onClick={() => setSelected(null)}><X /></button></div>
    <input className="border p-2 rounded-xl" value={selected.reportDate} onChange={e => setSelected({ ...selected, reportDate: e.target.value })} />
    <button onClick={() => void save()} disabled={loading} className="bg-rose-600 text-white p-3 rounded-xl flex gap-2 disabled:opacity-60"><Save /> حفظ</button>
  </div>;

  return <div dir="rtl" className="p-5 space-y-5">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold flex gap-2"><Archive /> الأرشيف</h1>
      <button onClick={() => void loadMonths()} disabled={loading} className="px-3 py-2 border rounded-xl flex items-center gap-2 disabled:opacity-60"><RefreshCw className="w-4 h-4" /> إعادة المحاولة</button>
    </div>
    {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800 font-bold">{error}</div>}
    {months.length === 0 && !loading && !error && <div className="rounded-xl border bg-slate-50 p-4 text-slate-600">لا توجد تقارير مؤرشفة حاليًا.</div>}
    <div className="flex gap-2 flex-wrap">{months.map(m => <button key={`${m.year}-${m.month}`} onClick={() => void loadReports(m)} className="border p-3 rounded-xl">{m.monthName} {m.year} ({m.reportCount})</button>)}</div>
    <div>{reports.map(r => <button key={r.id} onClick={() => void open(r.id)} className="w-full text-right border p-3 rounded-xl my-2 flex gap-2"><FileText /> تقرير {r.reportDate}</button>)}</div>
    {selectedMonth && reports.length === 0 && !loading && !error && <div className="rounded-xl border bg-slate-50 p-4 text-slate-600">لا توجد تقارير مؤرشفة في هذا الشهر.</div>}
  </div>;
};
