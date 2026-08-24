import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeaderBanner } from '../common/HeaderBanner';
import { FileCheck, CheckCircle2, XCircle, Clock, Printer, ShieldCheck, Lock, Unlock, UserCheck, Package, AlertTriangle, Plus, Trash2, Edit2, Archive, Loader2 } from 'lucide-react';
import { archiveReport, getOrCreateDailyReport } from '../../services/archiveService';

export const ProductReleaseModule: React.FC = () => {
  const { activeSection, releaseFormB1, updateReleaseFormB1, releaseFormB2, updateReleaseFormB2, currentUser, activeDate, kpi } = useApp();
  const form = activeSection === 1 ? releaseFormB1 : releaseFormB2;
  const updateForm = activeSection === 1 ? updateReleaseFormB1 : updateReleaseFormB2;

  const [isEditingQty, setIsEditingQty] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductQty, setNewProductQty] = useState(1000);
  const [archiving, setArchiving] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [archiveError, setArchiveError] = useState('');

  const toggleCondition = (conditionKey: keyof typeof form.mandatoryConditions) => {
    if (!currentUser.permissions.canApproveRelease && !currentUser.permissions.canEnterData) {
      alert('عذراً، هذا الإجراء يتطلب صلاحيات مهندس جودة أو مدير الجودة.');
      return;
    }
    updateForm({ mandatoryConditions: { ...form.mandatoryConditions, [conditionKey]: !form.mandatoryConditions[conditionKey] } });
  };

  const allConditionsMet = Object.values(form.mandatoryConditions).every(Boolean);

  const handleQaSignOff = () => {
    if (!currentUser.permissions.canApproveRelease) {
      alert('تنبيه: يتطلب اعتماد إذن الإفراج النهائي صلاحيات مدير الجودة / رئيس قسم المراقبة.');
      return;
    }
    if (!allConditionsMet) {
      alert('لا يمكن اعتماد الإفراج: يجب استيفاء كافة الشروط الـ 5 الإلزامية أولاً.');
      return;
    }
    const now = new Date().toLocaleString('ar-EG');
    updateForm({ decision: 'approved', qaReleaseOfficerName: currentUser.name, qaReleaseOfficerSignature: currentUser.name, qaReleaseOfficerTimestamp: now });
  };

  const handleStorekeeperSignOff = () => {
    if (form.decision !== 'approved') {
      alert('تنبيه: لا يمكن لأمين المخزن استلام التشغيلة قبل اعتماد إذن الإفراج من إدارة الجودة.');
      return;
    }
    const now = new Date().toLocaleString('ar-EG');
    updateForm({ storekeeperName: currentUser.name, storekeeperSignature: currentUser.name, storekeeperTimestamp: now });
  };

  const handleArchiveReport = async () => {
    setArchiving(true);
    setArchiveError('');
    setArchiveSuccess(false);
    try {
      const dailyReport = form.dailyReportId
        ? { id: form.dailyReportId }
        : await getOrCreateDailyReport(activeDate);

      await archiveReport(dailyReport.id);

      if (!form.dailyReportId) {
        updateForm({ dailyReportId: dailyReport.id });
      }

      setArchiveSuccess(true);
    } catch (error: any) {
      setArchiveError(error?.message || 'تعذر تخزين التقرير في الأرشيف');
    } finally {
      setArchiving(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;
    updateForm({ products: [...form.products, { id: `rp-${Date.now()}`, productName: newProductName, unit: 'قطعة', quantity: newProductQty }] });
    setNewProductName('');
    setNewProductQty(1000);
  };

  const handleDeleteProduct = (id: string) => updateForm({ products: form.products.filter(p => p.id !== id) });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner title="إذن الإفراج عن المنتج التام (Finished Product Release Approval)" subtitle="التحقق من المعايير الخمسة الإلزامية والاعتماد الإلكتروني للإفراج والتخزين والتسليم" docCode="QC-IS-FM-01-16" revNo="0" date="01-05-2025" />

      {archiveSuccess && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 font-bold"><CheckCircle2 className="w-5 h-5" /><span>تم التخزين في الأرشيف بنجاح.</span></div>}
      {archiveError && <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 font-bold">{archiveError}</div>}

      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${form.decision === 'approved' ? 'bg-gradient-to-r from-emerald-900 to-slate-900 text-white border-emerald-500/50' : form.decision === 'rejected' ? 'bg-gradient-to-r from-rose-950 to-slate-900 text-white border-rose-500/50' : 'bg-gradient-to-r from-amber-950 to-slate-900 text-white border-amber-500/50'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${form.decision === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40' : 'bg-amber-500/20 text-amber-400 border border-amber-400/40'}`}>{form.decision === 'approved' ? <ShieldCheck className="w-8 h-8" /> : <Clock className="w-8 h-8" />}</div>
          <div>
            <div className="text-xs font-bold text-slate-300">القرار النهائي لإدارة الجودة:</div>
            <div className="text-xl md:text-2xl font-black mt-0.5">{form.decision === 'approved' ? 'يتم الإفراج عن المنتج ويسمح له بالخروج للعميل أو التداول أو التخزين' : form.decision === 'rejected' ? 'مرفوض - غير مصرح بالتداول أو الخروج من صالة الإنتاج' : 'قيد المراجعة والتحقق من بنود الإفراج الإلزامية'}</div>
            <div className="text-xs text-slate-300 mt-1">قسم المخبوزات {activeSection} • إجمالي الكمية الجاهزة: <strong className="text-white font-extrabold">{form.products.reduce((a, b) => a + b.quantity, 0).toLocaleString('ar-EG')} قطعة</strong></div>
          </div>
        </div>
        <button onClick={() => window.print()} className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-white/20 transition-all"><Printer className="w-4 h-4" /><span>طباعة الإذن الرسمي</span></button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">✓</div><div><h3 className="font-extrabold text-base text-slate-900 dark:text-white">البنود الواجب توافرها للإفراج عن المنتج وتخزينه (التحقق الإلزامي)</h3><p className="text-xs text-slate-500">يشترط اكتمال ومطابقة كافة البنود الـ 5 لإتاحة الاعتماد النهائي من مدير الجودة</p></div></div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${allConditionsMet ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>{allConditionsMet ? '✓ كافة الشروط مستوفاة ومطابقة' : '⚠️ يتبقى شروط غير مؤكدة'}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {([
            ['rawMaterialsCompliant','جميع الخامات المستخدمة مطابقة ومفحوصة'],
            ['ccpOprpReportsCompliant','جميع تقارير ونتائج متابعة CCP و OPRP مطابقة'],
            ['labAnalysisCompliant','نتائج تحاليل المعمل الميكروبيولوجية والفيزيائية'],
            ['labelAndPackagingCompliant','مراجعة بطاقة البيانات والصلاحية وسلامة العبوة'],
            ['customerRequirementsCompliant','المنتج مطابق لشروط العميل ومواصفات الفروع والمعارض']
          ] as const).map(([key,label], index) => <div key={key} onClick={() => toggleCondition(key)} className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${form.mandatoryConditions[key] ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'} ${index===4?'md:col-span-2':''}`}><div className="flex items-center gap-3"><div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${form.mandatoryConditions[key] ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{index+1}</div><span className="font-bold text-slate-800 dark:text-slate-200">{label}</span></div><span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${form.mandatoryConditions[key] ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{form.mandatoryConditions[key] ? 'مطابق (√)' : 'غير مطابق (×)'}</span></div>)}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"><div className="flex items-center gap-2"><Package className="w-5 h-5 text-rose-600" /><h3 className="font-bold text-base text-slate-900 dark:text-white">بيان أصناف وكميات المنتجات الجاهزة للإفراج</h3></div><button onClick={() => setIsEditingQty(!isEditingQty)} className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"><Edit2 className="w-3.5 h-3.5" /><span>{isEditingQty?'إنهاء التعديل':'تعديل الأصناف والكميات'}</span></button></div>
        {isEditingQty && <form onSubmit={handleAddProduct} className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b flex flex-wrap items-center gap-3 text-xs"><input type="text" placeholder="اسم الصنف الجديد..." value={newProductName} onChange={e=>setNewProductName(e.target.value)} className="bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs font-bold w-64"/><input type="number" placeholder="الكمية بالقطع..." value={newProductQty} onChange={e=>setNewProductQty(parseInt(e.target.value)||0)} className="bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs font-bold w-36"/><button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold flex items-center gap-1.5"><Plus className="w-4 h-4"/><span>إضافة صنف</span></button></form>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">{form.products.map(p=><div key={p.id} className="p-3 rounded-xl border bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-2 text-xs group"><div><div className="font-bold text-slate-900 dark:text-white truncate">{p.productName}</div><div className="text-slate-500 mt-0.5">الكمية: <strong className="text-rose-600 font-extrabold">{p.quantity.toLocaleString('ar-EG')}</strong> {p.unit}</div></div>{isEditingQty&&<button onClick={()=>handleDeleteProduct(p.id)} className="text-slate-400 hover:text-rose-600 p-1"><Trash2 className="w-3.5 h-3.5"/></button>}</div>)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"><div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2"><div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2"><UserCheck className="w-4 h-4 text-emerald-600"/><span>توقيع القائم بالإفراج عن المنتج (إدارة الجودة)</span></div><span className="text-xs text-slate-400 font-mono">QA Sign-off</span></div><div className="space-y-1 text-xs"><div className="flex justify-between"><span className="text-slate-500">اسم المسؤول:</span><strong className="text-slate-800 dark:text-slate-200">{form.qaReleaseOfficerName}</strong></div><div className="flex justify-between"><span className="text-slate-500">توقيت الاعتماد:</span><span className="font-mono text-slate-600 dark:text-slate-400">{form.qaReleaseOfficerTimestamp||'بانتظار الاعتماد'}</span></div></div><div className="pt-2">{form.decision==='approved'?<div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-600"/><span>تم الاعتماد إلكترونياً بواسطة: {form.qaReleaseOfficerName}</span></div>:<button onClick={handleQaSignOff} disabled={!allConditionsMet} className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${allConditionsMet?'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20':'bg-slate-100 text-slate-400 cursor-not-allowed'}`}><ShieldCheck className="w-4 h-4"/><span>اعتماد إذن الإفراج النهائي (مدير الجودة)</span></button>}</div></div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"><div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2"><div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2"><Package className="w-4 h-4 text-blue-600"/><span>توقيع أمين المخزن / مسؤول التوزيع والتسليم</span></div><span className="text-xs text-slate-400 font-mono">Storekeeper</span></div><div className="space-y-1 text-xs"><div className="flex justify-between"><span className="text-slate-500">اسم المستلم:</span><strong className="text-slate-800 dark:text-slate-200">{form.storekeeperName}</strong></div><div className="flex justify-between"><span className="text-slate-500">توقيت الاستلام:</span><span className="font-mono text-slate-600 dark:text-slate-400">{form.storekeeperTimestamp||'بانتظار التسليم'}</span></div></div><div className="pt-2">{form.storekeeperTimestamp?<div className="p-3 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs flex items-center gap-2 font-bold"><CheckCircle2 className="w-4 h-4 text-blue-600"/><span>تم استلام الكميات بنجاح بواسطة: {form.storekeeperName}</span></div>:<button onClick={handleStorekeeperSignOff} disabled={form.decision!=='approved'} className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${form.decision==='approved'?'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20':'bg-slate-100 text-slate-400 cursor-not-allowed'}`}><Package className="w-4 h-4"/><span>تأكيد استلام التشغيلة للمستودعات</span></button>}</div></div>
      </div>

      <div className="mt-2 border-t pt-6"><div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 shadow-sm"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold"><Archive className="w-5 h-5"/><span>تخزين التقرير بالكامل في الأرشيف</span></div><p className="text-xs text-slate-500 mt-1">الزر متاح في آخر قسم لإقفال التقرير اليومي ونقله للأرشيف.</p></div><button onClick={handleArchiveReport} disabled={archiving} className="min-w-56 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-60">{archiving?<Loader2 className="w-4 h-4 animate-spin"/>:<Archive className="w-4 h-4"/>}<span>{archiving?'جارٍ التخزين...':'تخزين التقرير في الأرشيف'}</span></button></div>{!form.dailyReportId&&<div className="mt-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">لم يتم ربط التقرير اليومي بالنموذج بعد؛ عند الضغط على التخزين سيتم إنشاء/استرجاع تقرير اليوم تلقائيًا ثم أرشفته.</div>}{form.dailyReportId&& !allConditionsMet&&<div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">يفضل استكمال البنود الخمسة قبل التخزين النهائي للأرشيف.</div>}</div></div>
    </div>
  );
};
