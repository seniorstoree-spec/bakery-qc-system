import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeaderBanner } from '../common/HeaderBanner';
import { CheckCircle2, Clock, Printer, ShieldCheck, UserCheck, Package, Plus, Trash2, Edit2, Archive, Loader2 } from 'lucide-react';
import { archiveReport, getOrCreateDailyReport } from '../../services/archiveService';

export const ProductReleaseModule: React.FC = () => {
  const { activeSection, releaseFormB1, updateReleaseFormB1, releaseFormB2, updateReleaseFormB2, currentUser, activeDate } = useApp();
  const form = activeSection === 1 ? releaseFormB1 : releaseFormB2;
  const updateForm = activeSection === 1 ? updateReleaseFormB1 : updateReleaseFormB2;
  const [archiving, setArchiving] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [archiveError, setArchiveError] = useState('');
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductQty, setNewProductQty] = useState(1000);

  const toggleCondition = (conditionKey: keyof typeof form.mandatoryConditions) => {
    if (!currentUser.permissions.canApproveRelease && !currentUser.permissions.canEnterData) return alert('عذراً، هذا الإجراء يتطلب صلاحيات مهندس جودة أو مدير الجودة.');
    updateForm({ mandatoryConditions: { ...form.mandatoryConditions, [conditionKey]: !form.mandatoryConditions[conditionKey] } });
  };
  const allConditionsMet = Object.values(form.mandatoryConditions).every(Boolean);
  const handleQaSignOff = () => {
    if (!currentUser.permissions.canApproveRelease) return alert('تنبيه: يتطلب اعتماد إذن الإفراج النهائي صلاحيات مدير الجودة / رئيس قسم المراقبة.');
    if (!allConditionsMet) return alert('لا يمكن اعتماد الإفراج: يجب استيفاء كافة الشروط الـ 5 الإلزامية أولاً.');
    const now = new Date().toLocaleString('ar-EG');
    updateForm({ decision: 'approved', qaReleaseOfficerName: currentUser.name, qaReleaseOfficerSignature: currentUser.name, qaReleaseOfficerTimestamp: now });
  };
  const handleStorekeeperSignOff = () => {
    if (form.decision !== 'approved') return alert('تنبيه: لا يمكن لأمين المخزن استلام التشغيلة قبل اعتماد إذن الإفراج من إدارة الجودة.');
    const now = new Date().toLocaleString('ar-EG');
    updateForm({ storekeeperName: currentUser.name, storekeeperSignature: currentUser.name, storekeeperTimestamp: now });
  };
  const handleArchiveReport = async () => {
    if (archiving) return;
    setArchiving(true); setArchiveError(''); setArchiveSuccess(false);
    try {
      const report = await getOrCreateDailyReport(activeDate);
      await archiveReport(report.id);
      updateForm({ dailyReportId: report.id });
      setArchiveSuccess(true);
    } catch (error: unknown) {
      setArchiveError(error instanceof Error ? error.message : 'تعذر تخزين التقرير في الأرشيف');
    } finally { setArchiving(false); }
  };
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productName = newProductName.trim();
    if (!productName || !Number.isFinite(newProductQty) || newProductQty <= 0) return;
    updateForm({ products: [...form.products, { id: `rp-${Date.now()}`, productName, unit: 'قطعة', quantity: newProductQty }] });
    setNewProductName(''); setNewProductQty(1000);
  };
  const handleDeleteProduct = (id: string) => updateForm({ products: form.products.filter(p => p.id !== id) });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner title="إذن الإفراج عن المنتج التام (Finished Product Release Approval)" subtitle="التدقيق النهائي والإفراج والتخزين" docCode="QC-IS-FM-01-16" revNo="0" date={activeDate} />
      {archiveSuccess && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 font-bold"><CheckCircle2 className="w-5 h-5"/><span>تم التخزين في الأرشيف بنجاح.</span></div>}
      {archiveError && <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 font-bold">{archiveError}</div>}

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><div className="flex items-center gap-2 text-emerald-700 font-extrabold"><Archive className="w-5 h-5"/><span>تخزين التقرير بالكامل في الأرشيف</span></div><p className="text-xs text-slate-500 mt-1">زر الأرشفة متاح في آخر التقرير ويغلق تقرير اليوم كله.</p></div><button type="button" onClick={handleArchiveReport} disabled={archiving} className="min-w-56 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">{archiving?<Loader2 className="w-4 h-4 animate-spin"/>:<Archive className="w-4 h-4"/>}<span>{archiving?'جارٍ التخزين...':'تخزين التقرير في الأرشيف'}</span></button></div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm"><div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600"/><h2 className="font-extrabold">إذن الإفراج عن المنتج التام</h2></div><div className="mt-4 grid gap-3 text-sm"><div>التاريخ: <b>{activeDate}</b></div><div>الحالة: <b>{form.decision==='approved'?'معتمد ومفرج عنه':form.decision==='rejected'?'مرفوض':'قيد المراجعة'}</b></div><div>عدد الأصناف: <b>{form.products.length.toLocaleString('en-US')}</b></div></div></div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm"><h3 className="font-bold mb-3">شروط الإفراج</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{([['rawMaterialsCompliant','الخامات مطابقة'],['ccpOprpReportsCompliant','تقارير CCP/OPRP مطابقة'],['labAnalysisCompliant','تحاليل المعمل مطابقة'],['labelAndPackagingCompliant','البطاقة والعبوة مطابقة'],['customerRequirementsCompliant','متطلبات العميل مستوفاة']] as const).map(([key,label])=><button type="button" key={key} onClick={()=>toggleCondition(key)} className={`p-3 rounded-xl border text-right ${form.mandatoryConditions[key]?'bg-emerald-50 border-emerald-300':'bg-slate-50 border-slate-200'}`}>{label} — {form.mandatoryConditions[key]?'مطابق':'غير مطابق'}</button>)}</div></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="p-5 rounded-2xl border bg-white dark:bg-slate-900"><div className="font-bold flex items-center gap-2"><UserCheck className="w-4 h-4 text-emerald-600"/>اعتماد الجودة</div><button onClick={handleQaSignOff} disabled={!allConditionsMet} className="mt-3 w-full p-3 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50">اعتماد إذن الإفراج النهائي</button></div><div className="p-5 rounded-2xl border bg-white dark:bg-slate-900"><div className="font-bold flex items-center gap-2"><Package className="w-4 h-4 text-blue-600"/>استلام المخزن</div><button onClick={handleStorekeeperSignOff} disabled={form.decision!=='approved'} className="mt-3 w-full p-3 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50">تأكيد استلام التشغيلة</button></div></div>
    </div>
  );
};
