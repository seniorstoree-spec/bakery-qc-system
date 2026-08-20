import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MetalDetectorRecord, ElectricSieveRecord } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Check, 
  FileCheck,
  Zap,
  Info
} from 'lucide-react';

export const CcpOprpModule: React.FC = () => {
  const { 
    metalDetectorLogs, 
    addMetalDetectorRecord, 
    updateMetalDetectorRecord, 
    deleteMetalDetectorRecord,
    electricSieveLogs,
    addElectricSieveRecord,
    deleteElectricSieveRecord,
    currentUser,
    activeDate 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'metal' | 'sieve'>('metal');
  const [isNewMetalModalOpen, setIsNewMetalModalOpen] = useState(false);
  const [isNewSieveModalOpen, setIsNewSieveModalOpen] = useState(false);

  // New Metal Detector Record Form State
  const [metalForm, setMetalForm] = useState({
    time: '04:00 PM',
    machineCode: 'MD-LINE-01',
    feStatus: 'pass' as 'pass' | 'fail',
    nfeStatus: 'pass' as 'pass' | 'fail',
    ssStatus: 'pass' as 'pass' | 'fail',
    correctiveAction: '',
    verifiedBy: 'م. محمد سيف الإسلام'
  });

  // New Electric Sieve Record Form State
  const [sieveForm, setSieveForm] = useState({
    productName: 'دقيق فاخر 72% - خط الإنتاج الرئيسي',
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    isCompliant: true,
    sieveIntegrityCheck: 'سليم وكفء' as 'سليم وكفء' | 'غير مطابق',
    correctiveAction: '',
    notes: 'المنخل 600 ميكرون خالي من أي تمزقات أو شوائب'
  });

  const handleSaveMetal = (e: React.FormEvent) => {
    e.preventDefault();
    const isCompliant = metalForm.feStatus === 'pass' && metalForm.nfeStatus === 'pass' && metalForm.ssStatus === 'pass';

    addMetalDetectorRecord({
      sn: metalDetectorLogs.length + 1,
      time: metalForm.time,
      machineCode: metalForm.machineCode,
      feStatus: metalForm.feStatus,
      nfeStatus: metalForm.nfeStatus,
      ssStatus: metalForm.ssStatus,
      isCompliant,
      responsiblePerson: currentUser.name,
      correctiveAction: isCompliant ? undefined : metalForm.correctiveAction || 'إيقاف السير فوراً، عزل المنتجات المنتجة خلال آخر ساعة وإعادة تمريرها بعد المعايرة',
      verifiedBy: metalForm.verifiedBy,
      date: activeDate
    });
    setIsNewMetalModalOpen(false);
  };

  const handleSaveSieve = (e: React.FormEvent) => {
    e.preventDefault();
    addElectricSieveRecord({
      sn: electricSieveLogs.length + 1,
      productName: sieveForm.productName,
      time: sieveForm.time,
      isCompliant: sieveForm.isCompliant,
      responsiblePerson: currentUser.name,
      correctiveAction: sieveForm.isCompliant ? undefined : sieveForm.correctiveAction,
      sieveIntegrityCheck: sieveForm.sieveIntegrityCheck,
      notes: sieveForm.notes,
      date: activeDate
    });
    setIsNewSieveModalOpen(false);
  };

  const toggleTestPiece = (id: string, piece: 'feStatus' | 'nfeStatus' | 'ssStatus') => {
    const record = metalDetectorLogs.find(m => m.id === id);
    if (!record) return;

    const newStatus = record[piece] === 'pass' ? 'fail' : 'pass';
    const updated = {
      ...record,
      [piece]: newStatus,
    };
    updated.isCompliant = updated.feStatus === 'pass' && updated.nfeStatus === 'pass' && updated.ssStatus === 'pass';
    updateMetalDetectorRecord(id, updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner
        title={`مراقبة نقاط التحكم الحرجة (CCP) والبرامج التشغيلية التحضيرية (OPRP)`}
        subtitle={`مراقبة جهاز كاشف المعادن على مدار 24 ساعة (CCP) والتحقق من سلامة المنخل الكهربائي 600 ميكرون (OPRP)`}
        docCode={activeTab === 'metal' ? 'QC-IS-FM-01-11' : 'QC-IS-FM-01-18'}
        revNo="1 / 0"
        date="17-08-2025"
      />

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('metal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'metal'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>كاشف المعادن (CCP 24h) - نموذج 11</span>
        </button>

        <button
          onClick={() => setActiveTab('sieve')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'sieve'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>المنخل الكهربائي 600 ميكرون (OPRP) - نموذج 12 & 28</span>
        </button>
      </div>

      {/* Tab 1: Metal Detector CCP */}
      {activeTab === 'metal' && (
        <div className="space-y-4">
          
          {/* Critical Limits Summary Header */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-rose-900/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold text-xl shrink-0">
                CCP
              </div>
              <div>
                <div className="font-extrabold text-sm md:text-base text-rose-300">
                  الحدود الحرجة لكاشف المعادن (Critical Limits):
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 mt-1 font-mono font-bold">
                  <span className="bg-white/10 px-2 py-0.5 rounded-lg">حديد (F.E): 2.5 mm</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-lg">غير حديدي (NFe): 3.0 mm</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-lg">ستانلس ستيل (S.S): 3.5 mm</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsNewMetalModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل فحص ساعي جديد</span>
            </button>
          </div>

          {/* Metal Detector Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>سجل اختبارات كاشف المعادن على مدار اليوم (24 ساعة)</span>
              </h3>
              <span className="text-xs text-slate-500">تم تسجيل {metalDetectorLogs.length} ساعة فحص</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">م</th>
                    <th className="p-3.5">الوقت</th>
                    <th className="p-3.5">كود الماكينة</th>
                    <th className="p-3.5 text-center">حديد F.E (2.5mm)</th>
                    <th className="p-3.5 text-center">غير حديدي NFe (3.0mm)</th>
                    <th className="p-3.5 text-center">ستانلس S.S (3.5mm)</th>
                    <th className="p-3.5">المسئول</th>
                    <th className="p-3.5">الإجراء التصحيحي (في حالة الفشل)</th>
                    <th className="p-3.5">المتحقق</th>
                    <th className="p-3.5 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {metalDetectorLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono">{log.sn}</td>
                      <td className="p-3.5 font-bold font-mono text-slate-700 dark:text-slate-300">{log.time}</td>
                      <td className="p-3.5 font-mono text-xs font-semibold">{log.machineCode}</td>
                      
                      {/* Fe piece toggle */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleTestPiece(log.id, 'feStatus')}
                          className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all flex items-center gap-1 mx-auto ${
                            log.feStatus === 'pass'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300'
                          }`}
                        >
                          {log.feStatus === 'pass' ? <Check className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                          <span>{log.feStatus === 'pass' ? '√ مطابق' : '× فشل'}</span>
                        </button>
                      </td>

                      {/* NFe piece toggle */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleTestPiece(log.id, 'nfeStatus')}
                          className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all flex items-center gap-1 mx-auto ${
                            log.nfeStatus === 'pass'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300'
                          }`}
                        >
                          {log.nfeStatus === 'pass' ? <Check className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                          <span>{log.nfeStatus === 'pass' ? '√ مطابق' : '× فشل'}</span>
                        </button>
                      </td>

                      {/* SS piece toggle */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleTestPiece(log.id, 'ssStatus')}
                          className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all flex items-center gap-1 mx-auto ${
                            log.ssStatus === 'pass'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300'
                          }`}
                        >
                          {log.ssStatus === 'pass' ? <Check className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                          <span>{log.ssStatus === 'pass' ? '√ مطابق' : '× فشل'}</span>
                        </button>
                      </td>

                      <td className="p-3.5 font-medium">{log.responsiblePerson}</td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{log.correctiveAction || '-'}</td>
                      <td className="p-3.5 font-medium">{log.verifiedBy || '-'}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => deleteMetalDetectorRecord(log.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
      {activeTab === 'sieve' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-teal-900/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-400 flex items-center justify-center font-bold text-lg shrink-0">
                600µ
              </div>
              <div>
                <div className="font-extrabold text-sm md:text-base text-teal-300">
                  مراقبة النخل (OPRP) - مقاس 600 ميكرون
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  معايير العمل: خالية تماماً من أي مواد غريبة وشوائب مع التحقق من سلامة شبكة السلك
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNewSieveModalOpen(true)}
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
                    <th className="p-3.5">اسم المنتج / الخامة</th>
                    <th className="p-3.5">الوقت</th>
                    <th className="p-3.5">المطابقة وخلو الشوائب</th>
                    <th className="p-3.5">التحقق من سلامة وكفاءة المنخل</th>
                    <th className="p-3.5">المسئول</th>
                    <th className="p-3.5">الفعل التصحيحي (في حالة الفشل)</th>
                    <th className="p-3.5">الملاحظات</th>
                    <th className="p-3.5 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {electricSieveLogs.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono">{s.sn}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{s.productName}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{s.time}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold ${
                          s.isCompliant ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {s.isCompliant ? '✓ مطابق (خالي من الشوائب)' : '✕ غير مطابق'}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-teal-600 dark:text-teal-400">{s.sieveIntegrityCheck}</td>
                      <td className="p-3.5 font-medium">{s.responsiblePerson}</td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{s.correctiveAction || '-'}</td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{s.notes || '-'}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => deleteElectricSieveRecord(s.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Modal: New Metal Detector Hourly Test */}
      {isNewMetalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">تسجيل فحص ساعي لكاشف المعادن (CCP)</h3>
              <button onClick={() => setIsNewMetalModalOpen(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSaveMetal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">الوقت</label>
                  <input
                    type="text"
                    required
                    value={metalForm.time}
                    onChange={(e) => setMetalForm({ ...metalForm, time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">كود الماكينة</label>
                  <input
                    type="text"
                    required
                    value={metalForm.machineCode}
                    onChange={(e) => setMetalForm({ ...metalForm, machineCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold font-mono"
                  />
                </div>
              </div>

              {/* 3 Pieces Check */}
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                <div className="font-bold text-slate-900 dark:text-white">نتائج تمرير قطع المعايرة القياسية:</div>
                
                <div className="flex items-center justify-between">
                  <span>حديد F.E (2.5 mm):</span>
                  <select
                    value={metalForm.feStatus}
                    onChange={(e) => setMetalForm({ ...metalForm, feStatus: e.target.value as any })}
                    className="p-1.5 rounded-lg border font-bold"
                  >
                    <option value="pass">✓ مطابق (Pass)</option>
                    <option value="fail">✕ فشل (Fail)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span>غير حديدي NFe (3.0 mm):</span>
                  <select
                    value={metalForm.nfeStatus}
                    onChange={(e) => setMetalForm({ ...metalForm, nfeStatus: e.target.value as any })}
                    className="p-1.5 rounded-lg border font-bold"
                  >
                    <option value="pass">✓ مطابق (Pass)</option>
                    <option value="fail">✕ فشل (Fail)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span>ستانلس ستيل S.S (3.5 mm):</span>
                  <select
                    value={metalForm.ssStatus}
                    onChange={(e) => setMetalForm({ ...metalForm, ssStatus: e.target.value as any })}
                    className="p-1.5 rounded-lg border font-bold"
                  >
                    <option value="pass">✓ مطابق (Pass)</option>
                    <option value="fail">✕ فشل (Fail)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewMetalModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ الفحص</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Sieve Test */}
      {isNewSieveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">تسجيل فحص المنخل الكهربائي (OPRP)</h3>
              <button onClick={() => setIsNewSieveModalOpen(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSaveSieve} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم المنتج / الخامة</label>
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
                  <label className="block font-bold mb-1">كفاءة وسلامة المنخل</label>
                  <select
                    value={sieveForm.sieveIntegrityCheck}
                    onChange={(e) => setSieveForm({ ...sieveForm, sieveIntegrityCheck: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  >
                    <option value="سليم وكفء">سليم وكفء (خالي من الشوائب)</option>
                    <option value="غير مطابق">غير مطابق (يوجد تلف بالشبكة)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">ملاحظات</label>
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
                  onClick={() => setIsNewSieveModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ فحص المنخل</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
