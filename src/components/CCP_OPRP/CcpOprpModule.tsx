import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MetalDetectorRecord, ElectricSieveRecord } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Filter, 
  Plus, 
  Trash2, 
  Edit2,
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Clock,
  Check,
  X
} from 'lucide-react';

export const CcpOprpModule: React.FC = () => {
  const { 
    activeSection,
    metalDetectorLogs,
    addMetalDetectorRecord,
    updateMetalDetectorRecord,
    deleteMetalDetectorRecord,
    electricSieveLogs,
    addElectricSieveRecord,
    updateElectricSieveRecord,
    deleteElectricSieveRecord,
    currentUser,
    activeDate,
    criticalLimits
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ccp_metal' | 'oprp_sieve'>('ccp_metal');
  
  // Metal Detector Form State
  const [isMetalModalOpen, setIsMetalModalOpen] = useState(false);
  const [editingMetalId, setEditingMetalId] = useState<string | null>(null);

  const [metalForm, setMetalForm] = useState({
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    machineCode: 'MD-LINE-01',
    feStatus: 'pass' as 'pass' | 'fail',
    nfeStatus: 'pass' as 'pass' | 'fail',
    ssStatus: 'pass' as 'pass' | 'fail',
    correctiveAction: '',
    verifiedBy: 'م. محمد سيف الإسلام'
  });

  // Electric Sieve Form State
  const [isSieveModalOpen, setIsSieveModalOpen] = useState(false);
  const [editingSieveId, setEditingSieveId] = useState<string | null>(null);

  const [sieveForm, setSieveForm] = useState({
    productName: 'دقيق فاخر 72% - خط الكرواسون',
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    sieveIntegrityCheck: 'سليم وكفء' as 'سليم وكفء' | 'غير مطابق',
    notes: 'المنخل 600 ميكرون خالي من أي شوائب أو تمزقات',
    correctiveAction: ''
  });

  const handleSaveMetal = (e: React.FormEvent) => {
    e.preventDefault();
    const isCompliant = metalForm.feStatus === 'pass' && metalForm.nfeStatus === 'pass' && metalForm.ssStatus === 'pass';

    if (editingMetalId) {
      updateMetalDetectorRecord(editingMetalId, {
        time: metalForm.time,
        machineCode: metalForm.machineCode,
        feStatus: metalForm.feStatus,
        nfeStatus: metalForm.nfeStatus,
        ssStatus: metalForm.ssStatus,
        isCompliant,
        responsiblePerson: currentUser.name,
        correctiveAction: isCompliant ? undefined : metalForm.correctiveAction || 'عزل المنتجات وإيقاف الخط وإعادة معايرة الحساس',
        verifiedBy: metalForm.verifiedBy
      });
    } else {
      addMetalDetectorRecord({
        sn: metalDetectorLogs.length + 1,
        time: metalForm.time,
        machineCode: metalForm.machineCode,
        feStatus: metalForm.feStatus,
        nfeStatus: metalForm.nfeStatus,
        ssStatus: metalForm.ssStatus,
        isCompliant,
        responsiblePerson: currentUser.name,
        correctiveAction: isCompliant ? undefined : metalForm.correctiveAction || 'عزل المنتجات وإيقاف الخط وإعادة معايرة الحساس',
        verifiedBy: metalForm.verifiedBy,
        date: activeDate
      });
    }

    setIsMetalModalOpen(false);
    setEditingMetalId(null);
  };

  const handleOpenEditMetal = (rec: MetalDetectorRecord) => {
    setEditingMetalId(rec.id);
    setMetalForm({
      time: rec.time,
      machineCode: rec.machineCode,
      feStatus: rec.feStatus,
      nfeStatus: rec.nfeStatus,
      ssStatus: rec.ssStatus,
      correctiveAction: rec.correctiveAction || '',
      verifiedBy: rec.verifiedBy || 'م. محمد سيف الإسلام'
    });
    setIsMetalModalOpen(true);
  };

  const handleSaveSieve = (e: React.FormEvent) => {
    e.preventDefault();
    const isCompliant = sieveForm.sieveIntegrityCheck === 'سليم وكفء';

    if (editingSieveId) {
      updateElectricSieveRecord(editingSieveId, {
        productName: sieveForm.productName,
        time: sieveForm.time,
        sieveIntegrityCheck: sieveForm.sieveIntegrityCheck,
        isCompliant,
        responsiblePerson: currentUser.name,
        notes: sieveForm.notes,
        correctiveAction: isCompliant ? undefined : sieveForm.correctiveAction || 'استبدال المنخل فوراً وإعادة غربلة الدقيق المتأثر'
      });
    } else {
      addElectricSieveRecord({
        sn: electricSieveLogs.length + 1,
        productName: sieveForm.productName,
        time: sieveForm.time,
        sieveIntegrityCheck: sieveForm.sieveIntegrityCheck,
        isCompliant,
        responsiblePerson: currentUser.name,
        notes: sieveForm.notes,
        correctiveAction: isCompliant ? undefined : sieveForm.correctiveAction || 'استبدال المنخل فوراً وإعادة غربلة الدقيق المتأثر',
        date: activeDate
      });
    }

    setIsSieveModalOpen(false);
    setEditingSieveId(null);
  };

  const handleOpenEditSieve = (rec: ElectricSieveRecord) => {
    setEditingSieveId(rec.id);
    setSieveForm({
      productName: rec.productName,
      time: rec.time,
      sieveIntegrityCheck: rec.sieveIntegrityCheck,
      notes: rec.notes || '',
      correctiveAction: rec.correctiveAction || ''
    });
    setIsSieveModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner
        title={`مراقبة نقاط التحكم الحرجة والبرامج التشغيلية (CCP & OPRP)`}
        subtitle={`كاشف المعادن (CCP-1 / CCP-2) والمنخل الكهربائي 600 ميكرون (OPRP-1)`}
        docCode={activeTab === 'ccp_metal' ? 'QC-IS-FM-01-13' : 'QC-IS-FM-01-14'}
        revNo="0 / 1"
        date="01-01-2025"
      />

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ccp_metal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'ccp_metal'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>كاشف المعادن (CCP 24h Hourly Log) - نموذج 13 & 28</span>
        </button>

        <button
          onClick={() => setActiveTab('oprp_sieve')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'oprp_sieve'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>المنخل الكهربي 600µ (OPRP-1) - نموذج 14</span>
        </button>
      </div>

      {/* Tab 1: Metal Detector CCP */}
      {activeTab === 'ccp_metal' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-400 flex items-center justify-center font-bold text-xl shrink-0">
                CCP
              </div>
              <div>
                <div className="font-extrabold text-sm md:text-base text-rose-300">
                  حدود قطع المعايرة المطلوبة: حديدي Fe ({criticalLimits.metalDetector?.fe_mm || 2.5}mm) | غير حديدي NFe ({criticalLimits.metalDetector?.nfe_mm || 3.0}mm) | ستانلس S.S ({criticalLimits.metalDetector?.ss_mm || 3.5}mm)
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  اختبار المعايرة يُجرى ساعة بساعة (24 ساعة) على مدار اليوم التشغيلي الكامل مع تسجيل وتوثيق حالة الحساسات
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingMetalId(null);
                setMetalForm({
                  time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                  machineCode: 'MD-LINE-01',
                  feStatus: 'pass',
                  nfeStatus: 'pass',
                  ssStatus: 'pass',
                  correctiveAction: '',
                  verifiedBy: 'م. محمد سيف الإسلام'
                });
                setIsMetalModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل فحص كاشف معادن (ساعة بساعة)</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-600" />
                <span>سجل فحص كاشف المعادن على مدار 24 ساعة</span>
              </h3>
              <span className="text-xs text-slate-500">عدد الفحوصات المسجلة: {metalDetectorLogs.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">م</th>
                    <th className="p-3.5">الوقت والتوقيت</th>
                    <th className="p-3.5">كود الماكينة</th>
                    <th className="p-3.5 text-center">حديدي Fe ({criticalLimits.metalDetector?.fe_mm || 2.5}mm)</th>
                    <th className="p-3.5 text-center">غير حديدي NFe ({criticalLimits.metalDetector?.nfe_mm || 3.0}mm)</th>
                    <th className="p-3.5 text-center">ستانلس S.S ({criticalLimits.metalDetector?.ss_mm || 3.5}mm)</th>
                    <th className="p-3.5">الحالة الإجمالية</th>
                    <th className="p-3.5">المسئول</th>
                    <th className="p-3.5">الإجراء التصحيحي</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {metalDetectorLogs.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono">{rec.sn}</td>
                      <td className="p-3.5 font-bold font-mono text-slate-900 dark:text-white">{rec.time}</td>
                      <td className="p-3.5 font-mono text-xs font-semibold">{rec.machineCode}</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold ${rec.feStatus === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {rec.feStatus === 'pass' ? 'Pass (√)' : 'Fail (×)'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold ${rec.nfeStatus === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {rec.nfeStatus === 'pass' ? 'Pass (√)' : 'Fail (×)'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold ${rec.ssStatus === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {rec.ssStatus === 'pass' ? 'Pass (√)' : 'Fail (×)'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold ${
                          rec.isCompliant
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                        }`}>
                          {rec.isCompliant ? 'مطابق وتأكيدي' : 'انحراف CCP'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{rec.responsiblePerson}</td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{rec.correctiveAction || '-'}</td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditMetal(rec)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تعديل السجل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMetalDetectorRecord(rec.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Electric Sieve OPRP */}
      {activeTab === 'oprp_sieve' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="font-extrabold text-sm md:text-base text-teal-300">
                مراقبة سلامة ونظافة المنخل الكهربي (OPRP-1: {criticalLimits.sieveMeshMicrons || 600} Micron Sieve)
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                نخل الدقيق والسكر والمساحيق فور استلامها وقبل عجنها للتأكد الخالي من الشوائب والتكتلات والآفات
              </p>
            </div>

            <button
              onClick={() => {
                setEditingSieveId(null);
                setSieveForm({
                  productName: 'دقيق فاخر 72% - خط الكرواسون',
                  time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                  sieveIntegrityCheck: 'سليم وكفء',
                  notes: 'المنخل 600 ميكرون خالي من أي شوائب أو تمزقات',
                  correctiveAction: ''
                });
                setIsSieveModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-600/30 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل فحص منخل جديد</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">م</th>
                    <th className="p-3.5">اسم الخامة / المنتج</th>
                    <th className="p-3.5">الوقت</th>
                    <th className="p-3.5">حالة سلامة المنخل ({criticalLimits.sieveMeshMicrons || 600}µ)</th>
                    <th className="p-3.5">المطابقة</th>
                    <th className="p-3.5">المسئول</th>
                    <th className="p-3.5">ملاحظات الفحص</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {electricSieveLogs.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono">{rec.sn}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{rec.productName}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{rec.time}</td>
                      <td className="p-3.5 font-semibold text-teal-600 dark:text-teal-400">{rec.sieveIntegrityCheck}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold ${
                          rec.isCompliant
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                        }`}>
                          {rec.isCompliant ? '✓ مطابق' : '✕ غير مطابق'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{rec.responsiblePerson}</td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{rec.notes || '-'}</td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditSieve(rec)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تعديل السجل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteElectricSieveRecord(rec.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Modal: Metal Detector Record */}
      {isMetalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingMetalId ? 'تعديل فحص كاشف المعادن' : 'تسجيل فحص كاشف المعادن (ساعة بساعة)'}
              </h3>
              <button onClick={() => { setIsMetalModalOpen(false); setEditingMetalId(null); }} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSaveMetal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">الوقت والتوقيت</label>
                  <input
                    type="text"
                    required
                    value={metalForm.time}
                    onChange={(e) => setMetalForm({ ...metalForm, time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">كود الماكينة</label>
                  <input
                    type="text"
                    required
                    value={metalForm.machineCode}
                    onChange={(e) => setMetalForm({ ...metalForm, machineCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-1">حديدي Fe ({criticalLimits.metalDetector?.fe_mm || 2.5}mm)</label>
                  <select
                    value={metalForm.feStatus}
                    onChange={(e) => setMetalForm({ ...metalForm, feStatus: e.target.value as 'pass' | 'fail' })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  >
                    <option value="pass">Pass (مطابق)</option>
                    <option value="fail">Fail (غير مطابق)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">غير حديدي NFe ({criticalLimits.metalDetector?.nfe_mm || 3.0}mm)</label>
                  <select
                    value={metalForm.nfeStatus}
                    onChange={(e) => setMetalForm({ ...metalForm, nfeStatus: e.target.value as 'pass' | 'fail' })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  >
                    <option value="pass">Pass (مطابق)</option>
                    <option value="fail">Fail (غير مطابق)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">ستانلس S.S ({criticalLimits.metalDetector?.ss_mm || 3.5}mm)</label>
                  <select
                    value={metalForm.ssStatus}
                    onChange={(e) => setMetalForm({ ...metalForm, ssStatus: e.target.value as 'pass' | 'fail' })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  >
                    <option value="pass">Pass (مطابق)</option>
                    <option value="fail">Fail (غير مطابق)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setIsMetalModalOpen(false); setEditingMetalId(null); }}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingMetalId ? 'تحديث السجل' : 'حفظ الفحص'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Electric Sieve Record */}
      {isSieveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingSieveId ? 'تعديل فحص المنخل الكهربائي' : 'تسجيل فحص المنخل الكهربائي (600µ)'}
              </h3>
              <button onClick={() => { setIsSieveModalOpen(false); setEditingSieveId(null); }} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSaveSieve} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم الخامة / الدقيق / المنتج</label>
                <input
                  type="text"
                  required
                  value={sieveForm.productName}
                  onChange={(e) => setSieveForm({ ...sieveForm, productName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">الوقت</label>
                  <input
                    type="text"
                    required
                    value={sieveForm.time}
                    onChange={(e) => setSieveForm({ ...sieveForm, time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">سلامة المنخل ({criticalLimits.sieveMeshMicrons || 600}µ)</label>
                  <select
                    value={sieveForm.sieveIntegrityCheck}
                    onChange={(e) => setSieveForm({ ...sieveForm, sieveIntegrityCheck: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  >
                    <option value="سليم وكفء">سليم وكفء (مطابق)</option>
                    <option value="غير مطابق">غير مطابق (تلف/تمزق)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">ملاحظات الفحص والنقاء</label>
                <input
                  type="text"
                  value={sieveForm.notes}
                  onChange={(e) => setSieveForm({ ...sieveForm, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setIsSieveModalOpen(false); setEditingSieveId(null); }}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingSieveId ? 'تحديث الفحص' : 'حفظ الفحص'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
