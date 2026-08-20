import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  SensoryEvaluationRecord, 
  NonConformanceRecord, 
  SanitationEquipmentCheck,
  FoodSafetyItemCheck 
} from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertOctagon, 
  Brush, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Minus, 
  FileSpreadsheet,
  Layers,
  ChevronDown
} from 'lucide-react';

export const SensoryFoodSafetyModule: React.FC = () => {
  const { 
    sensoryEvaluations, 
    addSensoryEvaluation, 
    deleteSensoryEvaluation,
    nonConformanceLogs,
    addNonConformanceRecord,
    updateNonConformanceRecord,
    deleteNonConformanceRecord,
    sanitationLogB1,
    updateSanitationLogB1,
    foodSafetyLog,
    updateFoodSafetyLog,
    activeSection,
    currentUser,
    activeDate 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sensory_regular' | 'sensory_vegan' | 'ncr' | 'sanitation' | 'ghp'>('sensory_regular');
  
  // Modals
  const [isSensoryModalOpen, setIsSensoryModalOpen] = useState(false);
  const [isNcrModalOpen, setIsNcrModalOpen] = useState(false);

  // New Sensory Record State
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

  // New NCR Form State
  const [ncrForm, setNcrForm] = useState({
    productName: activeSection === 1 ? 'كرواسون شوكولاتة ميجا' : 'دونتس فيلد ميجا',
    productionQty: 3000,
    detectedDefects: '',
    defectiveQty: 15,
    rootCause: '',
    correctiveAction: '',
    signee: currentUser.name
  });

  // Calculate MATRIX rating
  const getMatrixRating = (score: number): 'مرفوض' | 'مقبول' | 'جيد' | 'جيد جداً' | 'ممتاز' => {
    if (score <= 4) return 'مرفوض';
    if (score <= 6) return 'مقبول';
    if (score <= 8) return 'جيد';
    if (score === 9) return 'جيد جداً';
    return 'ممتاز';
  };

  const handleSaveSensory = (e: React.FormEvent) => {
    e.preventDefault();
    const rating = getMatrixRating(sensoryForm.overallImpressionScore);
    addSensoryEvaluation({
      sn: sensoryEvaluations.length + 1,
      productName: sensoryForm.productName,
      sampleType: sensoryForm.sampleType,
      isVegan: sensoryForm.isVegan,
      time: sensoryForm.time,
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
    setIsSensoryModalOpen(false);
  };

  const handleSaveNCR = (e: React.FormEvent) => {
    e.preventDefault();
    const pct = Number(((ncrForm.defectiveQty / (ncrForm.productionQty || 1)) * 100).toFixed(2));
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
    setIsNcrModalOpen(false);
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
            <span className="bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 px-2.5 py-1 rounded-lg border border-teal-200">
              9 = جيد جداً
            </span>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-200">
              10 = ممتاز
            </span>
          </div>
        </div>
      )}

      {/* Tab 1: Sensory Regular & Tab 2: Sensory Vegan */}
      {(activeTab === 'sensory_regular' || activeTab === 'sensory_vegan') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {activeTab === 'sensory_regular' ? 'سجل التقييم الحسي للأغذية اليومي' : 'سجل التقييم الحسي لمنتجات المخبوزات (صيامي)'}
            </h3>
            <button
              onClick={() => {
                setSensoryForm({
                  ...sensoryForm,
                  isVegan: activeTab === 'sensory_vegan',
                  productName: activeTab === 'sensory_vegan' ? 'باتيه صيامي ساده' : 'كرواسون ساده'
                });
                setIsSensoryModalOpen(true);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل تقييم حسي جديد</span>
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
                    <th className="p-3.5 text-center">إجراء</th>
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
                        <button
                          onClick={() => deleteSensoryEvaluation(rec.id)}
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
              onClick={() => setIsNcrModalOpen(true)}
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
                    <th className="p-3.5 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {nonConformanceLogs.map((ncr) => (
                    <tr key={ncr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono">{ncr.sn}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{ncr.productName}</td>
                      <td className="p-3.5 font-semibold">{ncr.productionQty.toLocaleString('ar-EG')}</td>
                      <td className="p-3.5 text-rose-600 dark:text-rose-400 font-medium">{ncr.detectedDefects}</td>
                      <td className="p-3.5 font-bold text-rose-600">{ncr.defectiveQty}</td>
                      <td className="p-3.5 font-bold">{ncr.defectPercentage}%</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{ncr.rootCause}</td>
                      <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-medium">{ncr.correctiveAction}</td>
                      <td className="p-3.5 font-medium">{ncr.signee}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => deleteNonConformanceRecord(ncr.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {nonConformanceLogs.length === 0 && (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                        لا توجد تقارير عدم مطابقة مفتوحة اليوم.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sanitation Checklist (18 equipment) */}
      {activeTab === 'sanitation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                نموذج متابعة النظافة والتطهير بقسم المخبوزات (18 أداة ومعدة)
              </h3>
              <p className="text-xs text-slate-500">
                التحقق للوردية الصباحية والمسائية (بداية ونهاية التشغيل) - كود QC-IS-FM-01-13
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-bold text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> مطابق (√)</span>
              <span className="flex items-center gap-1 font-bold text-rose-600"><XCircle className="w-3.5 h-3.5" /> غير مطابق (×)</span>
              <span className="flex items-center gap-1 font-bold text-slate-400"><Minus className="w-3.5 h-3.5" /> لم يتم العمل عليها (—)</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th rowSpan={2} className="p-3.5 border-l">م</th>
                    <th rowSpan={2} className="p-3.5 border-l">فحص الأدوات والمعدات</th>
                    <th rowSpan={2} className="p-3.5 border-l">الكود</th>
                    <th colSpan={3} className="p-2 text-center border-l bg-rose-50/50 dark:bg-rose-950/20">وردية صباحية</th>
                    <th colSpan={3} className="p-2 text-center bg-blue-50/50 dark:bg-blue-950/20">وردية مسائية</th>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-700 text-[11px]">
                    <th className="p-2 text-center">بداية التشغيل</th>
                    <th className="p-2 text-center">نهاية التشغيل</th>
                    <th className="p-2 border-l">ملاحظات</th>
                    <th className="p-2 text-center">بداية التشغيل</th>
                    <th className="p-2 text-center">نهاية التشغيل</th>
                    <th className="p-2">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {sanitationLogB1.items.map((item, idx) => (
                    <tr key={item.equipmentCode} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold font-mono border-l">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white border-l">{item.equipmentName}</td>
                      <td className="p-3 font-mono text-slate-400 border-l">{item.equipmentCode}</td>
                      
                      {/* Morning Shift Start */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleSanitationItem(idx, 'morningShift', 'startShift')}
                          className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center transition-all ${
                            item.morningShift.startShift === 'compliant'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.morningShift.startShift === 'non_compliant'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          }`}
                        >
                          {item.morningShift.startShift === 'compliant' ? '√' : item.morningShift.startShift === 'non_compliant' ? '×' : '—'}
                        </button>
                      </td>

                      {/* Morning Shift End */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleSanitationItem(idx, 'morningShift', 'endShift')}
                          className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center transition-all ${
                            item.morningShift.endShift === 'compliant'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.morningShift.endShift === 'non_compliant'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          }`}
                        >
                          {item.morningShift.endShift === 'compliant' ? '√' : item.morningShift.endShift === 'non_compliant' ? '×' : '—'}
                        </button>
                      </td>

                      <td className="p-2 text-[11px] text-slate-400 border-l max-w-[120px] truncate">{item.morningShift.notes || '-'}</td>

                      {/* Evening Shift Start */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleSanitationItem(idx, 'eveningShift', 'startShift')}
                          className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center transition-all ${
                            item.eveningShift.startShift === 'compliant'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.eveningShift.startShift === 'non_compliant'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          }`}
                        >
                          {item.eveningShift.startShift === 'compliant' ? '√' : item.eveningShift.startShift === 'non_compliant' ? '×' : '—'}
                        </button>
                      </td>

                      {/* Evening Shift End */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleSanitationItem(idx, 'eveningShift', 'endShift')}
                          className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center transition-all ${
                            item.eveningShift.endShift === 'compliant'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.eveningShift.endShift === 'non_compliant'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          }`}
                        >
                          {item.eveningShift.endShift === 'compliant' ? '√' : item.eveningShift.endShift === 'non_compliant' ? '×' : '—'}
                        </button>
                      </td>

                      <td className="p-2 text-[11px] text-slate-400 max-w-[120px] truncate">{item.eveningShift.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: GHP & Food Safety Checklist */}
      {activeTab === 'ghp' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                نموذج متابعة التحقق من اشتراطات سلامة الغذاء ومكافحة الآفات (GHP)
              </h3>
              <p className="text-xs text-slate-500">
                النظافة الشخصية، المصائد الضوئية، الستائر الهوائية، سلامة البيئة والصالة (كود QC-IS-FM-01-07)
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th rowSpan={2} className="p-3.5 border-l">الفئة</th>
                    <th rowSpan={2} className="p-3.5 border-l">عناصر التحقق والمعايير</th>
                    <th colSpan={3} className="p-2 text-center border-l bg-emerald-50/50 dark:bg-emerald-950/20">وردية صباحية</th>
                    <th colSpan={3} className="p-2 text-center bg-blue-50/50 dark:bg-blue-950/20">وردية مسائية</th>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-700 text-[11px]">
                    <th className="p-2 text-center">بداية التشغيل</th>
                    <th className="p-2 text-center">منتصف التشغيل</th>
                    <th className="p-2 border-l">ملاحظات</th>
                    <th className="p-2 text-center">بداية التشغيل</th>
                    <th className="p-2 text-center">منتصف التشغيل</th>
                    <th className="p-2">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {foodSafetyLog.checks.map((chk, idx) => (
                    <tr key={chk.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold border-l text-rose-600">
                        {chk.category === 'GHP' ? 'GHP النظافة الشخصية' : chk.category === 'Pest_Control' ? 'Pest Control مكافحة الآفات' : chk.category === 'Work_Environment' ? 'نظافة بيئة العمل' : 'سلامة صالة الإنتاج'}
                      </td>
                      <td className="p-3 font-medium text-slate-900 dark:text-white border-l">{chk.criterion}</td>
                      
                      {/* Morning Start */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleGhpItem(idx, 'morningShift', 'startShift')}
                          className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center transition-all ${
                            chk.morningShift.startShift === 'compliant' ? 'bg-emerald-100 text-emerald-800' : chk.morningShift.startShift === 'non_compliant' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {chk.morningShift.startShift === 'compliant' ? '√' : chk.morningShift.startShift === 'non_compliant' ? '×' : '—'}
                        </button>
                      </td>

                      {/* Morning Mid */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleGhpItem(idx, 'morningShift', 'midShift')}
                          className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center transition-all ${
                            chk.morningShift.midShift === 'compliant' ? 'bg-emerald-100 text-emerald-800' : chk.morningShift.midShift === 'non_compliant' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {chk.morningShift.midShift === 'compliant' ? '√' : chk.morningShift.midShift === 'non_compliant' ? '×' : '—'}
                        </button>
                      </td>

                      <td className="p-2 text-[11px] text-slate-400 border-l max-w-[100px] truncate">{chk.morningShift.notes || '-'}</td>

                      {/* Evening Start */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleGhpItem(idx, 'eveningShift', 'startShift')}
                          className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center transition-all ${
                            chk.eveningShift.startShift === 'compliant' ? 'bg-emerald-100 text-emerald-800' : chk.eveningShift.startShift === 'non_compliant' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {chk.eveningShift.startShift === 'compliant' ? '√' : chk.eveningShift.startShift === 'non_compliant' ? '×' : '—'}
                        </button>
                      </td>

                      {/* Evening Mid */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleGhpItem(idx, 'eveningShift', 'midShift')}
                          className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center transition-all ${
                            chk.eveningShift.midShift === 'compliant' ? 'bg-emerald-100 text-emerald-800' : chk.eveningShift.midShift === 'non_compliant' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {chk.eveningShift.midShift === 'compliant' ? '√' : chk.eveningShift.midShift === 'non_compliant' ? '×' : '—'}
                        </button>
                      </td>

                      <td className="p-2 text-[11px] text-slate-400 max-w-[100px] truncate">{chk.eveningShift.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Sensory Record */}
      {isSensoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">تسجيل فحص تقييم حسي جديد</h3>
              <button onClick={() => setIsSensoryModalOpen(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSaveSensory} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">اسم الصنف</label>
                  <input
                    type="text"
                    required
                    value={sensoryForm.productName}
                    onChange={(e) => setSensoryForm({ ...sensoryForm, productName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">نوع العينة</label>
                  <select
                    value={sensoryForm.sampleType}
                    onChange={(e) => setSensoryForm({ ...sensoryForm, sampleType: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  >
                    <option value="daily_product">منتج يومي</option>
                    <option value="new_sample">عينة جديدة</option>
                  </select>
                </div>
              </div>

              {/* Sliders for 5 Sensory Attributes (0 - 10) */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border">
                {[
                  { key: 'colorScore', label: 'درجة اللون (Color)' },
                  { key: 'tasteScore', label: 'درجة الطعم (Taste)' },
                  { key: 'aromaScore', label: 'درجة الرائحة (Aroma)' },
                  { key: 'textureScore', label: 'درجة القوام والتوريق (Texture)' },
                  { key: 'overallImpressionScore', label: 'الإنطباع العام للمنتج (Overall)' },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{item.label}:</span>
                      <span className="text-purple-600 font-extrabold">{(sensoryForm as any)[item.key]} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={(sensoryForm as any)[item.key]}
                      onChange={(e) => setSensoryForm({ ...sensoryForm, [item.key]: parseInt(e.target.value) })}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold mb-1">ملاحظات التقييم</label>
                <input
                  type="text"
                  placeholder="ملاحظات حول النكهة أو التحسين..."
                  value={sensoryForm.notes}
                  onChange={(e) => setSensoryForm({ ...sensoryForm, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsSensoryModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ التقييم</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New NCR Record */}
      {isNcrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">تسجيل بيان بالمنتجات غير المطابقة (NCR)</h3>
              <button onClick={() => setIsNcrModalOpen(false)} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSaveNCR} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    required
                    value={ncrForm.productName}
                    onChange={(e) => setNcrForm({ ...ncrForm, productName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">كمية الإنتاج</label>
                  <input
                    type="number"
                    required
                    value={ncrForm.productionQty}
                    onChange={(e) => setNcrForm({ ...ncrForm, productionQty: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-rose-600">العيوب المكتشفة</label>
                <input
                  type="text"
                  required
                  placeholder="وصف دقيق للعيوب..."
                  value={ncrForm.detectedDefects}
                  onChange={(e) => setNcrForm({ ...ncrForm, detectedDefects: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-rose-300 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">كمية المعيب</label>
                  <input
                    type="number"
                    required
                    value={ncrForm.defectiveQty}
                    onChange={(e) => setNcrForm({ ...ncrForm, defectiveQty: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">نسبة المعيب المحسوبة</label>
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-rose-600">
                    {((ncrForm.defectiveQty / (ncrForm.productionQty || 1)) * 100).toFixed(2)} %
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">السبب الجذري (Root Cause)</label>
                <input
                  type="text"
                  required
                  placeholder="تحليل السبب الفني..."
                  value={ncrForm.rootCause}
                  onChange={(e) => setNcrForm({ ...ncrForm, rootCause: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">التصحيح والإجراء الوقائي</label>
                <input
                  type="text"
                  required
                  placeholder="الإجراء المتخذ لمنع التكرار..."
                  value={ncrForm.correctiveAction}
                  onChange={(e) => setNcrForm({ ...ncrForm, correctiveAction: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-semibold text-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsNcrModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ تقرير NCR</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
