import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeaderBanner } from '../common/HeaderBanner';
import { CheckCircle2, ShieldCheck, UserCheck, Package, Archive, Loader2, Plus, Trash2 } from 'lucide-react';
import { archiveReport, getOrCreateDailyReport } from '../../services/archiveService';
import { qualityFormPersistence } from '../../services/qualityPersistenceService';
import { FinishedProductReleaseForm, ReleaseProductItem } from '../../types';

const conditionLabels: Array<[keyof FinishedProductReleaseForm['mandatoryConditions'], string]> = [
  ['rawMaterialsCompliant', 'مطابقة الخامات'],
  ['ccpOprpReportsCompliant', 'مطابقة تقارير CCP / OPRP'],
  ['labAnalysisCompliant', 'مطابقة نتائج التحليل المعملي'],
  ['labelAndPackagingCompliant', 'مطابقة بطاقة البيانات والعبوة والصلاحية'],
  ['customerRequirementsCompliant', 'مطابقة متطلبات العميل'],
];

const emptyProduct = (): ReleaseProductItem => ({ id: crypto.randomUUID(), productName: '', unit: '', quantity: 0 });

export const ProductReleaseModule: React.FC = () => {
  const {
    activeSection,
    releaseFormB1,
    updateReleaseFormB1,
    releaseFormB2,
    updateReleaseFormB2,
    currentUser,
    activeDate,
  } = useApp();

  const form = activeSection === 1 ? releaseFormB1 : releaseFormB2;
  const updateForm = activeSection === 1 ? updateReleaseFormB1 : updateReleaseFormB2;
  const [archiving, setArchiving] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [archiveError, setArchiveError] = useState('');
  const [savingField, setSavingField] = useState<string | null>(null);

  const products = useMemo(() => form.products ?? [], [form.products]);

  const persistPatch = async (patch: Partial<FinishedProductReleaseForm>, key?: string) => {
    setSavingField(key ?? null);
    try {
      await updateForm(patch);
    } finally {
      setSavingField(null);
    }
  };

  const updateProduct = async (id: string, patch: Partial<ReleaseProductItem>) => {
    const nextProducts = products.map((product) => (product.id === id ? { ...product, ...patch } : product));
    await persistPatch({ products: nextProducts }, `product:${id}`);
  };

  const addProduct = async () => {
    await persistPatch({ products: [...products, emptyProduct()] }, 'products');
  };

  const removeProduct = async (id: string) => {
    await persistPatch({ products: products.filter((product) => product.id !== id) }, 'products');
  };

  const toggleCondition = async (key: keyof FinishedProductReleaseForm['mandatoryConditions']) => {
    const mandatoryConditions = {
      ...form.mandatoryConditions,
      [key]: !form.mandatoryConditions[key],
    };
    await persistPatch({ mandatoryConditions }, `condition:${String(key)}`);
  };

  const handleQaSignOff = async () => {
    if (!currentUser.permissions.canApproveRelease) {
      alert('تنبيه: يتطلب اعتماد إذن الإفراج النهائي صلاحيات مدير الجودة / رئيس قسم المراقبة.');
      return;
    }
    const now = new Date().toISOString();
    await persistPatch({
      decision: 'approved',
      qaReleaseOfficerName: currentUser.name,
      qaReleaseOfficerSignature: currentUser.name,
      qaReleaseOfficerTimestamp: now,
    }, 'qa');
  };

  const handleStorekeeperSignOff = async () => {
    if (form.decision !== 'approved') {
      alert('تنبيه: لا يمكن لأمين المخزن استلام التشغيلة قبل اعتماد إذن الإفراج من إدارة الجودة.');
      return;
    }
    const now = new Date().toISOString();
    await persistPatch({
      storekeeperName: currentUser.name,
      storekeeperSignature: currentUser.name,
      storekeeperTimestamp: now,
    }, 'storekeeper');
  };

  const handleArchiveReport = async () => {
    if (archiving) return;
    setArchiving(true);
    setArchiveError('');
    setArchiveSuccess(false);
    try {
      const daily = await getOrCreateDailyReport(activeDate);
      const nextForm = { ...form, dailyReportId: daily.id };
      const saved = await qualityFormPersistence.saveRelease(nextForm);
      if (activeSection === 1) await updateReleaseFormB1(saved); else await updateReleaseFormB2(saved);
      await archiveReport(daily.id);
      setArchiveSuccess(true);
    } catch (error) {
      console.error('Archive release report failed', error);
      setArchiveError(error instanceof Error ? error.message : 'تعذر تخزين التقرير في الأرشيف');
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner
        title="إذن الإفراج عن المنتج التام (Finished Product Release Approval)"
        subtitle="الاعتماد الإلكتروني للإفراج والتخزين والتسليم"
        docCode="QC-IS-FM-01-16"
        revNo="0"
        date={activeDate}
      />

      {archiveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-5 h-5" />
          <span>تم التخزين في الأرشيف بنجاح.</span>
        </div>
      )}
      {archiveError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 font-bold">
          تعذر تخزين التقرير في الأرشيف: {archiveError}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
              <Archive className="w-5 h-5" />
              <span>تخزين التقرير بالكامل في الأرشيف</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">يتم حفظ بيانات إذن الإفراج وربطها بالتقرير اليومي قبل نقل التقرير للأرشيف.</p>
          </div>
          <button
            type="button"
            onClick={handleArchiveReport}
            disabled={archiving}
            className="min-w-56 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {archiving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
            <span>{archiving ? 'جارٍ التخزين...' : 'تخزين التقرير في الأرشيف'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold">بيانات الأصناف المفرج عنها</h2>
          </div>
          <button type="button" onClick={addProduct} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> إضافة صنف
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-3 border-b text-right">اسم الصنف</th>
                <th className="p-3 border-b text-right">الوحدة</th>
                <th className="p-3 border-b text-right">الكمية</th>
                <th className="p-3 border-b text-center">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="p-2 border-b">
                    <input
                      value={product.productName}
                      onChange={(e) => void updateProduct(product.id, { productName: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800"
                      placeholder="اكتب اسم الصنف"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <input
                      value={product.unit}
                      onChange={(e) => void updateProduct(product.id, { unit: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800"
                      placeholder="كجم / كرتونة / قطعة"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <input
                      type="number"
                      min="0"
                      value={product.quantity}
                      onChange={(e) => void updateProduct(product.id, { quantity: Number(e.target.value) || 0 })}
                      className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800"
                    />
                  </td>
                  <td className="p-2 border-b text-center">
                    <button type="button" onClick={() => void removeProduct(product.id)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50" aria-label="حذف الصنف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">لا توجد أصناف مسجلة حاليًا. اضغط «إضافة صنف» لبدء التسجيل.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-extrabold">شروط الإفراج</h2>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {conditionLabels.map(([key, label]) => {
            const checked = Boolean(form.mandatoryConditions[key]);
            return (
              <button
                type="button"
                key={String(key)}
                onClick={() => void toggleCondition(key)}
                className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-right ${checked ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 dark:bg-slate-800'}`}
              >
                <span className="font-bold">{label}</span>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${checked ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border'}`}>{checked ? '✓' : '—'}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="font-extrabold">القرار النهائي</h2>
          <select
            value={form.decision}
            onChange={(e) => void persistPatch({ decision: e.target.value as FinishedProductReleaseForm['decision'] }, 'decision')}
            className="rounded-xl border px-4 py-2 bg-white dark:bg-slate-800"
          >
            <option value="pending">قيد الانتظار</option>
            <option value="approved">معتمد</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
        <textarea
          value={form.notes ?? ''}
          onChange={(e) => void persistPatch({ notes: e.target.value }, 'notes')}
          className="mt-4 w-full min-h-28 rounded-xl border px-4 py-3 bg-white dark:bg-slate-800"
          placeholder="ملاحظات الإفراج..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900">
          <div className="font-bold flex items-center gap-2"><UserCheck className="w-4 h-4 text-emerald-600" />اعتماد الجودة</div>
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{form.qaReleaseOfficerName ? `المعتمد: ${form.qaReleaseOfficerName}` : 'لم يتم الاعتماد بعد'}</div>
          <button type="button" onClick={handleQaSignOff} disabled={savingField === 'qa'} className="mt-3 w-full p-3 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-60">
            اعتماد إذن الإفراج النهائي
          </button>
        </div>
        <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900">
          <div className="font-bold flex items-center gap-2"><Package className="w-4 h-4 text-blue-600" />استلام المخزن</div>
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{form.storekeeperName ? `المستلم: ${form.storekeeperName}` : 'لم يتم الاستلام بعد'}</div>
          <button type="button" onClick={handleStorekeeperSignOff} disabled={form.decision !== 'approved' || savingField === 'storekeeper'} className="mt-3 w-full p-3 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50">
            تأكيد استلام التشغيلة
          </button>
        </div>
      </div>
    </div>
  );
};