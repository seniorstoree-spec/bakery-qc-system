import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SensoryEvaluationRecord, NonConformanceRecord } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { 
  Sparkles, 
  AlertOctagon, 
  Brush, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit2,
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Check, 
  X,
  FileText
} from 'lucide-react';

export const SensoryFoodSafetyModule: React.FC = () => {
  const { 
    activeSection,
    sensoryEvaluations,
    addSensoryEvaluation,
    updateSensoryEvaluation,
    deleteSensoryEvaluation,
    nonConformanceLogs,
    addNonConformanceRecord,
    updateNonConformanceRecord,
    deleteNonConformanceRecord,
    sanitationLogB1,
    updateSanitationLogB1,
    foodSafetyLog,
    updateFoodSafetyLog,
    currentUser,
    activeDate
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sensory_regular' | 'sensory_vegan' | 'ncr' | 'sanitation' | 'ghp'>('sensory_regular');
  
  // Modals state
  const [isSensoryModalOpen, setIsSensoryModalOpen] = useState(false);
  const [editingSensoryId, setEditingSensoryId] = useState<string | null>(null);

  const [isNcrModalOpen, setIsNcrModalOpen] = useState(false);
  const [editingNcrId, setEditingNcrId] = useState<string | null>(null);

  // New/Edit Sensory Form State
  const [sensoryForm, setSensoryForm] = useState<{
    productName: string;
    sampleType: 'daily_product' | 'new_sample';
    isVegan: boolean;
    time: string;
    sampleNumber: string;
    colorScore: number;
    tasteScore: number;
    aromaScore: number;
    textureScore: number;
    overallImpressionScore: number;
    notes: string;
  }>({
    productName: activeSection === 1 ? 'دانش كريمه' : 'سينامون كلاسيك',
    sampleType: 'daily_product',
    isVegan: false,
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    sampleNumber: `SAMP-${Math.floor(100 + Math.random() * 900)}`,
    colorScore: 9,
    tasteScore: 9,
    aromaScore: 9,
    textureScore: 9,
    overallImpressionScore: 9,
    notes: ''
  });

  // New/Edit NCR Form State
  const [ncrForm, setNcrForm] = useState({
    productName: activeSection === 1 ? 'كرواسون شوكولاتة ميجا' : 'دونتس فيلد ميجا',
    productionQty: 3000,
    detectedDefects: '',
    defectiveQty: 15,
    rootCause: '',
    correctiveAction: '',
    signee: currentUser.name
  });

  const getMatrixRating = (score: number): 'مرفوض' | 'مقبول' | 'جيد' | 'جيد جداً' | 'ممتاز' => {
    if (score <= 4) return 'مرفوض';
    if (score <= 6) return 'مقبول';
    if (score <= 8) return 'جيد';
    if (score === 9) return 'جيد جداً';
    return 'ممتاز';
  };

  const handleSaveSensory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!sensoryForm.productName.trim()) {
      alert('يرجى إدخال اسم الصنف');
      return;
    }

    const rating = getMatrixRating(sensoryForm.overallImpressionScore);

    if (editingSensoryId) {
      updateSensoryEvaluation(editingSensoryId, {
        productName: sensoryForm.productName,
        sampleType: sensoryForm.sampleType,
        isVegan: sensoryForm.isVegan,
        time: sensoryForm.time || new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        sampleNumber: sensoryForm.sampleNumber,
        colorScore: sensoryForm.colorScore,
        tasteScore: sensoryForm.tasteScore,
        aromaScore: sensoryForm.aromaScore,
        textureScore: sensoryForm.textureScore,
        overallImpressionScore: sensoryForm.overallImpressionScore,
        overallRating: rating,
        inspectorName: currentUser.name,
        notes: sensoryForm.notes
      });
    } else {
      addSensoryEvaluation({
        sn: sensoryEvaluations.length + 1,
        productName: sensoryForm.productName,
        sampleType: sensoryForm.sampleType,
        isVegan: sensoryForm.isVegan,
        time: sensoryForm.time || new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        sampleNumber: sensoryForm.sampleNumber,
        colorScore: sensoryForm.colorScore,
        tasteScore: sensoryForm.tasteScore,
        aromaScore: sensoryForm.aromaScore,
        textureScore: sensoryForm.textureScore,
        overallImpressionScore: sensoryForm.overallImpressionScore,
        overallRating: rating,
        inspectorName: currentUser.name,
        headOfSensoryName: 'م. محمد سيف الإسلام',
        notes: sensoryForm.notes,
        date: activeDate
      });
    }

    setIsSensoryModalOpen(false);
    setEditingSensoryId(null);
  };

  const handleOpenEditSensory = (rec: SensoryEvaluationRecord) => {
    setEditingSensoryId(rec.id);
    setSensoryForm({
      productName: rec.productName,
      sampleType: rec.sampleType,
      isVegan: rec.isVegan,
      time: rec.time,
      sampleNumber: rec.sampleNumber,
      colorScore: rec.colorScore,
      tasteScore: rec.tasteScore,
      aromaScore: rec.aromaScore,
      textureScore: rec.textureScore,
      overallImpressionScore: rec.overallImpressionScore,
      notes: rec.notes || ''
    });
    setIsSensoryModalOpen(true);
  };

  const handleSaveNCR = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!ncrForm.productName.trim()) {
      alert('يرجى إدخال اسم المنتج');
      return;
    }

    const pct = Number(((ncrForm.defectiveQty / (ncrForm.productionQty || 1)) * 100).toFixed(2));

    if (editingNcrId) {
      updateNonConformanceRecord(editingNcrId, {
        productName: ncrForm.productName,
        productionQty: ncrForm.productionQty,
        detectedDefects: ncrForm.detectedDefects,
        defectiveQty: ncrForm.defectiveQty,
        defectPercentage: pct,
        rootCause: ncrForm.rootCause,
        correctiveAction: ncrForm.correctiveAction,
        signee: ncrForm.signee
      });
    } else {
      addNonConformanceRecord({
        sn: nonConformanceLogs.length + 1,
        productName: ncrForm.productName,
        productionQty: ncrForm.productionQty,
        detectedDefects: ncrForm.detectedDefects,
        defectiveQty: ncrForm.defectiveQty,
        defectPercentage: pct,
        rootCause: ncrForm.rootCause,
        correctiveAction: ncrForm.correctiveAction,
        signee: ncrForm.signee,
        date: activeDate,
        status: 'under_review'
      });
    }

    setIsNcrModalOpen(false);
    setEditingNcrId(null);
  };

  const handleOpenEditNCR = (rec: NonConformanceRecord) => {
    setEditingNcrId(rec.id);
    setNcrForm({
      productName: rec.productName,
      productionQty: rec.productionQty,
      detectedDefects: rec.detectedDefects,
      defectiveQty: rec.defectiveQty,
      rootCause: rec.rootCause,
      correctiveAction: rec.correctiveAction,
      signee: rec.signee
    });
    setIsNcrModalOpen(true);
  };

  // Toggle Sanitation check item
  const toggleSanitationItem = (index: number, shift: 'morningShift' | 'eveningShift', timing: 'startShift' | 'endShift') => {
    const updated = { ...sanitationLogB1 };
    const currentVal = updated.items[index][shift][timing];
    const nextVal: 'compliant' | 'non_compliant' | 'not_operated' = 
      currentVal === 'compliant' ? 'non_compliant' : currentVal === 'non_compliant' ? 'not_operated' : 'compliant';
    
    updated.items[index][shift][timing] = nextVal;
    updateSanitationLogB1(updated);
  };

  // Toggle GHP check item
  const toggleGhpItem = (index: number, shift: 'morningShift' | 'eveningShift', timing: 'startShift' | 'midShift') => {
    const updated = { ...foodSafetyLog };
    const currentVal = updated.checks[index][shift][timing];
    const nextVal: 'compliant' | 'non_compliant' | 'not_operated' = 
      currentVal === 'compliant' ? 'non_compliant' : currentVal === 'non_compliant' ? 'not_operated' : 'compliant';
    
    updated.checks[index][shift][timing] = nextVal;
    updateFoodSafetyLog(updated);
  };

  const regularSensory = sensoryEvaluations.filter(s => !s.isVegan);
  const veganSensory = sensoryEvaluations.filter(s => s.isVegan);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner
        title={`التقييم الحسي للأغذية واشتراطات سلامة الغذاء (GHP & Hygiene)`}
        subtitle={`مصفوفة التقييم الحسي MATRIX (1-10)، تقارير عدم المطابقة (NCR)، ومتابعة النظافة والتطهير واشتراطات GHP`}
        docCode={activeTab.startsWith('sensory') ? 'QA-IS-FM-28-04' : activeTab === 'ncr' ? 'QC-IS-FM-01-19' : activeTab === 'sanitation' ? 'QC-IS-FM-01-13' : 'QC-IS-FM-01-07'}
        revNo="1 / 0"
        date="01-05-2024"
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('sensory_regular')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'sensory_regular'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>التقييم الحسي اليومي (نماذج 13 & 29)</span>
        </button>

        <button
          onClick={() => setActiveTab('sensory_vegan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'sensory_vegan'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>التقييم الحسي للمنتجات الصيامي (نموذج 14)</span>
        </button>

        <button
          onClick={() => setActiveTab('ncr')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'ncr'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>بيان المنتجات غير المطابقة (NCR - نموذج 15)</span>
        </button>

        <button
          onClick={() => setActiveTab('sanitation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'sanitation'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Brush className="w-4 h-4" />
          <span>متابعة النظافة والتطهير (نماذج 16 & 30)</span>
        </button>

        <button
          onClick={() => setActiveTab('ghp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'ghp'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>اشتراطات سلامة الغذاء وGHP (نماذج 17 & 31)</span>
        </button>
      </div>

      {/* MATRIX Scoring Legend */}
      {(activeTab === 'sensory_regular' || activeTab === 'sensory_vegan') && (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-lg">MATRIX</span>
            <span>مقياس التقييم الحسي المعتمد (0 - 10):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-bold">
            <span className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-200">
              0 : 4 = مرفوض
            </span>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-1 rounded-lg border border-amber-200">
              5 : 6 = مقبول
            </span>
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-200">
              7 : 8 = جيد
            </span>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-200">
              9 = جيد جداً | 10 = ممتاز
            </span>
          </div>
        </div>
      )}

      {/* Tab 1 & 2: Sensory Evaluation */}
      {(activeTab === 'sensory_regular' || activeTab === 'sensory_vegan') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {activeTab === 'sensory_regular' ? 'سجل التقييم الحسي اليومي لمنتجات العصر واليوم' : 'سجل التقييم الحسي للمنتجات الصيامي'}
            </h3>
            <button
              onClick={() => {
                setEditingSensoryId(null);
                setSensoryForm({
                  productName: activeSection === 1 ? 'دانش كريمه' : 'سينامون كلاسيك',
                  sampleType: 'daily_product',
                  isVegan: activeTab === 'sensory_vegan',
                  time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                  sampleNumber: `SAMP-${Math.floor(100 + Math.random() * 900)}`,
                  colorScore: 9,
                  tasteScore: 9,
                  aromaScore: 9,
                  textureScore: 9,
                  overallImpressionScore: 9,
                  notes: ''
                });
                setIsSensoryModalOpen(true);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل فحص حسي جديد</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">م</th>
                    <th className="p-3.5">اسم الصنف</th>
                    <th className="p-3.5">نوع العينة</th>
                    <th className="p-3.5">رقم العينة</th>
                    <th className="p-3.5">الوقت</th>
                    <th className="p-3.5 text-center">اللون (0-10)</th>
                    <th className="p-3.5 text-center">الطعم (0-10)</th>
                    <th className="p-3.5 text-center">الرائحة (0-10)</th>
                    <th className="p-3.5 text-center">القوام (0-10)</th>
                    <th className="p-3.5 text-center">الإنطباع العام</th>
                    <th className="p-3.5">التقييم العام</th>
                    <th className="p-3.5">الفاحص / الملاحظات</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {(activeTab === 'sensory_regular' ? regularSensory : veganSensory).map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono">{rec.sn}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{rec.productName}</td>
                      <td className="p-3.5 font-semibold text-purple-600">
                        {rec.sampleType === 'daily_product' ? 'منتج يومي' : 'عينة جديدة'}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{rec.sampleNumber}</td>
                      <td className="p-3.5 font-mono">{rec.time}</td>
                      <td className="p-3.5 text-center font-bold">{rec.colorScore}</td>
                      <td className="p-3.5 text-center font-bold">{rec.tasteScore}</td>
                      <td className="p-3.5 text-center font-bold">{rec.aromaScore}</td>
                      <td className="p-3.5 text-center font-bold">{rec.textureScore}</td>
                      <td className="p-3.5 text-center font-black text-rose-600">{rec.overallImpressionScore}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          rec.overallRating === 'ممتاز' || rec.overallRating === 'جيد جداً'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : rec.overallRating === 'جيد'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rec.overallRating}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">
                        <span>{rec.inspectorName}</span>
                        {rec.notes && <span className="block text-[11px] text-slate-400 mt-0.5">{rec.notes}</span>}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditSensory(rec)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تعديل السجل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSensoryEvaluation(rec.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="حذف"
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

      {/* Tab 3: Non-Conformance Reports (NCR) */}
      {activeTab === 'ncr' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                بيان بالمنتجات غير المطابقة والإجراءات التصحيحية المتخذة
              </h3>
              <p className="text-xs text-slate-500">
                تسجيل العيوب المكتشفة، تحليل السبب الجذري، والتصحيح (نموذج QC-IS-FM-01-19)
              </p>
            </div>
            <button
              onClick={() => {
                setEditingNcrId(null);
                setNcrForm({
                  productName: activeSection === 1 ? 'كرواسون شوكولاتة ميجا' : 'دونتس فيلد ميجا',
                  productionQty: 3000,
                  detectedDefects: '',
                  defectiveQty: 15,
                  rootCause: '',
                  correctiveAction: '',
                  signee: currentUser.name
                });
                setIsNcrModalOpen(true);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل تقرير عدم مطابقة (NCR)</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">م</th>
                    <th className="p-3.5">المنتج</th>
                    <th className="p-3.5">كمية الإنتاج</th>
                    <th className="p-3.5">العيوب المكتشفة</th>
                    <th className="p-3.5">كمية المعيب</th>
                    <th className="p-3.5">نسبة المعيب %</th>
                    <th className="p-3.5">السبب الجذري</th>
                    <th className="p-3.5">التصحيح</th>
                    <th className="p-3.5">المسؤول / التوقيع</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {nonConformanceLogs.map((ncr) => (
                    <tr key={ncr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono">{ncr.sn}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{ncr.productName}</td>
                      <td className="p-3.5 font-mono">{ncr.productionQty} قطعة</td>
                      <td className="p-3.5 text-rose-600 font-semibold max-w-xs truncate">{ncr.detectedDefects}</td>
                      <td className="p-3.5 font-bold text-rose-600">{ncr.defectiveQty}</td>
                      <td className="p-3.5 font-bold font-mono">{ncr.defectPercentage}%</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">{ncr.rootCause}</td>
                      <td className="p-3.5 text-emerald-600 font-medium max-w-xs truncate">{ncr.correctiveAction}</td>
                      <td className="p-3.5 font-semibold">{ncr.signee}</td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditNCR(ncr)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تعديل السجل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteNonConformanceRecord(ncr.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="حذف"
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

      {/* Modal: Sensory Evaluation Record */}
      {isSensoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingSensoryId ? 'تعديل التقييم الحسي' : 'تسجيل تقييم حسي جديد'}
              </h3>
              <button onClick={() => { setIsSensoryModalOpen(false); setEditingSensoryId(null); }} className="text-slate-400 p-1">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم الصنف</label>
                <input
                  type="text"
                  value={sensoryForm.productName}
                  onChange={(e) => setSensoryForm({ ...sensoryForm, productName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">اللون (0 - 10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={sensoryForm.colorScore}
                    onChange={(e) => setSensoryForm({ ...sensoryForm, colorScore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">الطعم (0 - 10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={sensoryForm.tasteScore}
                    onChange={(e) => setSensoryForm({ ...sensoryForm, tasteScore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setIsSensoryModalOpen(false); setEditingSensoryId(null); }}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSensory()}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-rose-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingSensoryId ? 'تحديث الفحص' : 'حفظ الفحص'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: NCR Record */}
      {isNcrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingNcrId ? 'تعديل تقرير عدم مطابقة (NCR)' : 'تسجيل تقرير عدم مطابقة (NCR)'}
              </h3>
              <button onClick={() => { setIsNcrModalOpen(false); setEditingNcrId(null); }} className="text-slate-400 p-1">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم المنتج</label>
                <input
                  type="text"
                  value={ncrForm.productName}
                  onChange={(e) => setNcrForm({ ...ncrForm, productName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">العيوب المكتشفة</label>
                <input
                  type="text"
                  value={ncrForm.detectedDefects}
                  onChange={(e) => setNcrForm({ ...ncrForm, detectedDefects: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-rose-600 font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setIsNcrModalOpen(false); setEditingNcrId(null); }}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveNCR()}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-rose-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingNcrId ? 'تحديث التقرير' : 'حفظ التقرير'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
