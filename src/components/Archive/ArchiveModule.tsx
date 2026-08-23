import React, { useEffect, useMemo, useState } from 'react';
import { Archive, CalendarDays, ChevronDown, ChevronLeft, FileText, Save, X, Loader2 } from 'lucide-react';
import { getArchiveReport, listArchiveMonths, listArchiveReports, saveArchiveReport, ArchiveMonth } from '../../services/archiveService';
import { QualityCheckResult, QualityReport } from '../../services/qualityReportsService';

export const ArchiveModule: React.FC = () => {
  const [months, setMonths] = useState<ArchiveMonth[]>([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<QualityReport | null>(null);
  const [results, setResults] = useState<QualityCheckResult[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedMonth = useMemo(() => months.find(m => `${m.year}-${m.month}` === selectedKey), [months, selectedKey]);

  const loadMonths = async () => {
    setLoading(true); setError('');
    try {
      const data = await listArchiveMonths();
      setMonths(data);
      if (!selectedKey && data[0]) setSelectedKey(`${data[0].year}-${data[0].month}`);
    } catch (e: any) { setError(e?.message || 'تعذر تحميل الأرشيف'); }
    finally { setLoading(false); }
  };

  const loadReports = async () => {
    if (!selectedMonth) return;
    setLoading(true); setError('');
    try { setReports(await listArchiveReports(selectedMonth.year, selectedMonth.month)); }
    catch (e: any) { setError(e?.message || 'تعذر تحميل التقارير'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void loadMonths(); }, []);
  useEffect(() => { void loadReports(); }, [selectedKey, months.length]);

  const openReport = async (id: string) => {
    setLoading(true); setError('');
    try {
      const data = await getArchiveReport(id);
      setSelectedReport(data.report); setResults(data.results); setItems(data.items);
    } catch (e: any) { setError(e?.message || 'تعذر فتح التقرير'); }
    finally { setLoading(false); }
  };

  const saveReport = async () => {
    if (!selectedReport) return;
    setSaving(true); setError('');
    try {
      await saveArchiveReport(selectedReport.id!, {
        date: selectedReport.date,
        shift: selectedReport.shift,
        status: selectedReport.status,
      }, results.map(r => ({ item_id: r.item_id, result: r.result, notes: r.notes })));
      setSelectedReport(null);
      await loadMonths();
      await loadReports();
    } catch (e: any) { setError(e?.message || 'تعذر حفظ التقرير'); }
    finally { setSaving(false); }
  };

  const getResult = (itemId: string) => results.find(r => r.item_id === itemId);
  const setResult = (itemId: string, patch: Partial<QualityCheckResult>) => {
    setResults(prev => {
      const existing = prev.find(r => r.item_id === itemId);
      if (existing) return prev.map(r => r.item_id === itemId ? { ...r, ...patch } : r);
      return [...prev, { report_id: selectedReport?.id || '', item_id: itemId, result: '', notes: '', ...patch }];
    });
  };

  if (selectedReport) return (
    <div dir="rtl" className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><Archive className="w-6 h-6 text-rose-600"/><h1 className="text-2xl font-black">تعديل تقرير الأرشيف</h1></div>
          <p className="text-sm text-slate-500 mt-1">التقرير محفوظ في قاعدة البيانات ويمكن تعديل بياناته ونتائج الفحص ثم إعادة حفظه.</p>
        </div>
        <button onClick={() => setSelectedReport(null)} className="p-2 rounded-xl border hover:bg-slate-50"><X className="w-5 h-5"/></button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="space-y-1 text-sm font-bold">التاريخ<input type="date" value={selectedReport.date} onChange={e => setSelectedReport({ ...selectedReport, date: e.target.value })} className="w-full border rounded-xl p-2.5 mt-1 font-normal"/></label>
          <label className="space-y-1 text-sm font-bold">الوردية<input value={selectedReport.shift || ''} onChange={e => setSelectedReport({ ...selectedReport, shift: e.target.value })} className="w-full border rounded-xl p-2.5 mt-1 font-normal"/></label>
          <label className="space-y-1 text-sm font-bold">الحالة<select value={selectedReport.status} onChange={e => setSelectedReport({ ...selectedReport, status: e.target.value as QualityReport['status'] })} className="w-full border rounded-xl p-2.5 mt-1 font-normal"><option value="draft">مسودة</option><option value="submitted">مرسل للمراجعة</option><option value="approved">معتمد</option></select></label>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b font-extrabold">نتائج بنود الفحص</div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map(item => {
            const current = getResult(item.id);
            return <div key={item.id} className="p-4 grid grid-cols-1 lg:grid-cols-[1fr_180px_1fr] gap-3 items-center">
              <div><div className="font-bold">{item.item_name}</div><div className="text-xs text-slate-400">{item.category}</div></div>
              <select value={current?.result || ''} onChange={e => setResult(item.id, { result: e.target.value })} className="border rounded-xl p-2.5 bg-white dark:bg-slate-900"><option value="">بدون نتيجة</option><option value="مطابق">مطابق</option><option value="غير مطابق">غير مطابق</option><option value="مقبول">مقبول</option><option value="مرفوض">مرفوض</option></select>
              <input value={current?.notes || ''} onChange={e => setResult(item.id, { notes: e.target.value })} placeholder="ملاحظات" className="border rounded-xl p-2.5"/>
            </div>;
          })}
          {!items.length && <div className="p-8 text-center text-slate-500">لا توجد بنود فحص نشطة.</div>}
        </div>
      </div>

      <div className="flex justify-end gap-2 sticky bottom-3">
        <button onClick={() => setSelectedReport(null)} className="px-5 py-3 rounded-xl border bg-white font-bold">إلغاء</button>
        <button disabled={saving} onClick={saveReport} className="px-5 py-3 rounded-xl bg-rose-600 text-white font-bold flex items-center gap-2 disabled:opacity-60">{saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}حفظ التعديلات</button>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><div className="flex items-center gap-2"><Archive className="w-7 h-7 text-rose-600"/><h1 className="text-2xl font-black">الأرشيف</h1></div><p className="text-sm text-slate-500 mt-1">التقارير مرتبة تلقائيًا حسب السنة ثم الشهر.</p></div>
        <button onClick={() => void loadMonths()} className="px-4 py-2 rounded-xl border bg-white font-bold">تحديث</button>
      </div>
      {error && <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3">
          <div className="px-2 pb-2 text-xs font-bold text-slate-400">السنة / الشهر</div>
          {months.map(m => <button key={`${m.year}-${m.month}`} onClick={() => setSelectedKey(`${m.year}-${m.month}`)} className={`w-full text-right p-3 rounded-xl flex items-center justify-between mb-1 ${selectedKey === `${m.year}-${m.month}` ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}><span className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/><span>{m.monthName} {m.year}</span></span><span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">{m.reportCount}</span></button>)}
          {!months.length && !loading && <div className="p-5 text-center text-slate-400">لا توجد تقارير مؤرشفة حتى الآن.</div>}
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between"><div><div className="font-extrabold">تقارير {selectedMonth ? `${selectedMonth.monthName} ${selectedMonth.year}` : 'الشهر المحدد'}</div><div className="text-xs text-slate-400">{reports.length} تقرير</div></div>{loading && <Loader2 className="w-5 h-5 animate-spin text-rose-600"/>}</div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map(report => <button key={report.id} onClick={() => void openReport(report.id!)} className="w-full text-right p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><FileText className="w-5 h-5"/></div><div><div className="font-bold">تقرير فحص جودة — {report.date}</div><div className="text-xs text-slate-500 mt-0.5">الوردية: {report.shift || 'غير محددة'} • الحالة: {report.status}</div></div></div><ChevronLeft className="w-5 h-5 text-slate-400"/></button>)}
            {!reports.length && !loading && <div className="p-10 text-center text-slate-400">لا توجد تقارير في هذا الشهر.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
