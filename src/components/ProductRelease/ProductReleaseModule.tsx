import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeaderBanner } from '../common/HeaderBanner';
import { CheckCircle2, Clock, Printer, ShieldCheck, UserCheck, Package, Plus, Trash2, Edit2, Archive, Loader2 } from 'lucide-react';
import { archiveReport, getOrCreateDailyReport } from '../../services/archiveService';

export const ProductReleaseModule: React.FC = () => {
  const { activeSection, releaseFormB1, updateReleaseFormB1, releaseFormB2, updateReleaseFormB2, currentUser, activeDate } = useApp();
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
      const dailyReport = form.dailyReportId ? { id: form.dailyReportId } : await getOrCreateDailyReport(activeDate);
      await archiveReport(dailyReport.id);
      if (!form.dailyReportId) updateForm({ dailyReportId: dailyReport.id });
      setArchiveSuccess(true);
    } catch (error: unknown) {
      setArchiveError(error instanceof Error ? error.message : 'تعذر تخزين التقرير في الأرشيف');
    } finally { setArchiving(false); }
  };
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault(); if (!newProductName.trim()) return;
    updateForm({ products: [...form.products, { id: `rp-${Date.now()}`, productName: newProductName.trim(), unit: 'قطعة', quantity: newProductQty }] });
    setNewProductName(''); setNewProductQty(1000);
  };
  const handleDeleteProduct = (id: string) => updateForm({ products: form.products.filter(p => p.id !== id) });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner title="إذن الإفراج عن المنتج التام (Finished Product Release Approval)" subtitle="التحقق من المعايير الخمسة الإلزامية والاعتماد الإلكتروني للإفراج والتخزين والتسليم" docCode="QC-IS-FM-01-16" revNo="0" date="01-05-2025" />
      {archiveSuccess && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 font-bold"><CheckCircle2 className="w-5 h-5" /><span>تم التخزين في الأرشيف بنجاح.</span></div>}
      {archiveError && <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 font-bold">{archiveError}</div>}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div><div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold"><Archive className="w-5 h-5" /><span>تخزين التقرير بالكامل في الأرشيف</span></div><p className="text-xs text-slate-500 mt-1">عند الضغط سيتم إنشاء/استرجاع تقرير اليوم تلقائيًا ثم إقفاله ونقله للأرشيف.</p></div>
          <button type="button" onClick={handleArchiveReport} disabled={archiving} className="min-w-56 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">{archiving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}<span>{archiving ? 'جارٍ التخزين...' : 'تخزين التقرير في الأرشيف'}</span></button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><ShieldCheck className="w-5 h-5 text-emerald-600" /> التقرير اليومي: {activeDate}</div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">حالة الإفراج: {form.decision}</div>
      </div>
    </div>
  );
};