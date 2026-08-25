import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SensoryEvaluationRecord, NonConformanceRecord, SanitationEquipmentCheck, FoodSafetyItemCheck } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { Sparkles, ShieldCheck, AlertOctagon, Brush, Plus, Trash2, CheckCircle2, XCircle, Minus, Save } from 'lucide-react';

export const SensoryFoodSafetyModule: React.FC = () => {
  const {
    sensoryEvaluations,
    addSensoryEvaluation,
    deleteSensoryEvaluation,
    nonConformanceLogs,
    addNonConformanceRecord,
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
  const [isSensoryModalOpen, setIsSensoryModalOpen] = useState(false);
  const [isNcrModalOpen, setIsNcrModalOpen] = useState(false);
  const [sanitationSaving, setSanitationSaving] = useState(false);
  const [ghpSaving, setGhpSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [sensoryForm, setSensoryForm] = useState({
    productName: activeSection === 1 ? 'دانش كريمه' : 'سينامون كلاسيك',
    sampleType: 'daily_product' as 'daily_product' | 'new_sample',
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

  const toggleSanitationItem = (index: number, shift: 'morningShift' | 'eveningShift', timing: 'startShift' | 'endShift') => {
    const updated = { ...sanitationLogB1 };
    const currentVal = updated.items[index][shift][timing];
    const nextVal: 'compliant' | 'non_compliant' | 'not_operated' = currentVal === 'compliant' ? 'non_compliant' : currentVal === 'non_compliant' ? 'not_operated' : 'compliant';
    updated.items[index][shift][timing] = nextVal;
    updateSanitationLogB1(updated);
  };

  const toggleGhpItem = (index: number, shift: 'morningShift' | 'eveningShift', timing: 'startShift' | 'midShift') => {
    const updated = { ...foodSafetyLog };
    const currentVal = updated.checks[index][shift][timing];
    const nextVal: 'compliant' | 'non_compliant' | 'not_operated' = currentVal === 'compliant' ? 'non_compliant' : currentVal === 'non_compliant' ? 'not_operated' : 'compliant';
    updated.checks[index][shift][timing] = nextVal;
    updateFoodSafetyLog(updated);
  };

  const saveSanitation = async () => {
    setSanitationSaving(true);
    setSaveMessage('');
    try {
      await Promise.resolve(updateSanitationLogB1({ ...sanitationLogB1, date: activeDate }));
      setSaveMessage('تم حفظ بيانات نموذج النظافة والتطهير بنجاح');
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (error) {
      console.error('Sanitation save failed', error);
      setSaveMessage('تعذر حفظ بيانات نموذج النظافة والتطهير');
    } finally {
      setSanitationSaving(false);
    }
  };

  const saveGhp = async () => {
    setGhpSaving(true);
    setSaveMessage('');
    try {
      await Promise.resolve(updateFoodSafetyLog({ ...foodSafetyLog, date: activeDate }));
      setSaveMessage('تم حفظ بيانات نموذج GHP بنجاح');
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (error) {
      console.error('GHP save failed', error);
      setSaveMessage('تعذر حفظ بيانات نموذج GHP');
    } finally {
      setGhpSaving(false);
    }
  };

  const regularSensory = sensoryEvaluations.filter(s => !s.isVegan);
  const veganSensory = sensoryEvaluations.filter(s => s.isVegan);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner title="التقييم الحسي للأغذية واشتراطات سلامة الغذاء (GHP & Hygiene)" subtitle="مصفوفة التقييم الحسي MATRIX (1-10)، تقارير عدم المطابقة (NCR)، ومتابعة النظافة والتطهير واشتراطات GHP" docCode={activeTab.startsWith('sensory') ? 'QA-IS-FM-28-04' : activeTab === 'ncr' ? 'QC-IS-FM-01-19' : activeTab === 'sanitation' ? 'QC-IS-FM-01-13' : 'QC-IS-FM-01-07'} revNo="1 / 0" date="01-05-2024" />

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button onClick={() => setActiveTab('sensory_regular')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'sensory_regular' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Sparkles className="w-4 h-4" /><span>التقييم الحسي اليومي (نماذج 13 & 29)</span></button>
        <button onClick={() => setActiveTab('sensory_vegan')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'sensory_vegan' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Sparkles className="w-4 h-4" /><span>التقييم الحسي للمنتجات الصيامي (نموذج 14)</span></button>
        <button onClick={() => setActiveTab('ncr')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'ncr' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><AlertOctagon className="w-4 h-4" /><span>بيان المنتجات غير المطابقة (NCR - نموذج 15)</span></button>
        <button onClick={() => setActiveTab('sanitation')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'sanitation' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Brush className="w-4 h-4" /><span>متابعة النظافة والتطهير (نماذج 16 & 30)</span></button>
        <button onClick={() => setActiveTab('ghp')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'ghp' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><ShieldCheck className="w-4 h-4" /><span>اشتراطات سلامة الغذاء وGHP (نماذج 17 & 31)</span></button>
      </div>

      {(activeTab === 'sensory_regular' || activeTab === 'sensory_vegan') && (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200"><span className="bg-purple-600 text-white px-2 py-0.5 rounded-lg">MATRIX</span><span>مقياس التقييم الحسي المعتمد (0 - 10):</span></div>
          <div className="flex flex-wrap items-center gap-2 font-bold"><span className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-200">0 : 4 = مرفوض</span><span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-1 rounded-lg border border-amber-200">5 : 6 = مقبول</span><span className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-200">7 : 8 = جيد</span><span className="bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 px-2.5 py-1 rounded-lg border border-teal-200">9 = جيد جداً</span><span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-200">10 = ممتاز</span></div>
        </div>
      )}

      {(activeTab === 'sensory_regular' || activeTab === 'sensory_vegan') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-bold text-base text-slate-900 dark:text-white">{activeTab === 'sensory_regular' ? 'سجل التقييم الحسي للأغذية اليومي' : 'سجل التقييم الحسي لمنتجات المخبوزات (صيامي)'}</h3><button onClick={() => {setSensoryForm({...sensoryForm,isVegan:activeTab==='sensory_vegan',productName:activeTab==='sensory_vegan'?'باتيه صيامي ساده':'كرواسون ساده'});setIsSensoryModalOpen(true);}} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20"><Plus className="w-4 h-4" /><span>تسجيل تقييم حسي جديد</span></button></div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"><div className="overflow-x-auto"><table className="w-full text-right text-xs"><thead className="bg-slate-50 dark:bg-slate-800/80"><tr><th className="p-3.5">م</th><th className="p-3.5">اسم الصنف</th><th className="p-3.5">نوع العينة</th><th className="p-3.5">رقم العينة</th><th className="p-3.5">الوقت</th><th className="p-3.5 text-center">اللون (0-10)</th><th className="p-3.5 text-center">الطعم (0-10)</th><th className="p-3.5 text-center">الرائحة (0-10)</th><th className="p-3.5 text-center">القوام (0-10)</th><th className="p-3.5 text-center">الإنطباع العام</th><th className="p-3.5">التقييم العام</th><th className="p-3.5">الفاحص / الملاحظات</th><th className="p-3.5 text-center">إجراء</th></tr></thead><tbody>{(activeTab==='sensory_regular'?regularSensory:veganSensory).map((rec)=><tr key={rec.id}><td className="p-3.5 font-bold">{rec.sn}</td><td className="p-3.5 font-bold">{rec.productName}</td><td className="p-3.5">{rec.sampleType==='daily_product'?'منتج يومي':'عينة جديدة'}</td><td className="p-3.5">{rec.sampleNumber}</td><td className="p-3.5">{rec.time}</td><td className="p-3.5 text-center">{rec.colorScore}</td><td className="p-3.5 text-center">{rec.tasteScore}</td><td className="p-3.5 text-center">{rec.aromaScore}</td><td className="p-3.5 text-center">{rec.textureScore}</td><td className="p-3.5 text-center">{rec.overallImpressionScore}</td><td className="p-3.5">{rec.overallRating}</td><td className="p-3.5">{rec.inspectorName}{rec.notes?<span className="block text-slate-400">{rec.notes}</span>:null}</td><td className="p-3.5 text-center"><button onClick={()=>deleteSensoryEvaluation(rec.id)} className="p-1.5"><Trash2 className="w-4 h-4"/></button></td></tr>)}</tbody></table></div></div>
        </div>
      )}

      {activeTab === 'ncr' && (
        <div className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="font-bold text-base">بيان بالمنتجات غير المطابقة والإجراءات التصحيحية المتخذة</h3><p className="text-xs text-slate-500">تسجيل العيوب المكتشفة، تحليل السبب الجذري، والتصحيح</p></div><button onClick={()=>setIsNcrModalOpen(true)} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"><Plus className="w-4 h-4"/>تسجيل تقرير عدم مطابقة (NCR)</button></div><div className="bg-white rounded-2xl border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-right text-xs"><thead className="bg-slate-50"><tr><th className="p-3.5">م</th><th className="p-3.5">المنتج</th><th className="p-3.5">كمية الإنتاج</th><th className="p-3.5">العيوب المكتشفة</th><th className="p-3.5">كمية المعيب</th><th className="p-3.5">نسبة المعيب %</th><th className="p-3.5">السبب الجذري</th><th className="p-3.5">التصحيح</th><th className="p-3.5">المسؤول / التوقيع</th><th className="p-3.5 text-center">إجراء</th></tr></thead><tbody>{nonConformanceLogs.map(ncr=><tr key={ncr.id}><td className="p-3.5">{ncr.sn}</td><td className="p-3.5">{ncr.productName}</td><td className="p-3.5">{ncr.productionQty.toLocaleString('ar-EG')}</td><td className="p-3.5">{ncr.detectedDefects}</td><td className="p-3.5">{ncr.defectiveQty}</td><td className="p-3.5">{ncr.defectPercentage}%</td><td className="p-3.5">{ncr.rootCause}</td><td className="p-3.5">{ncr.correctiveAction}</td><td className="p-3.5">{ncr.signee}</td><td className="p-3.5"><button onClick={()=>deleteNonConformanceRecord(ncr.id)}><Trash2 className="w-4 h-4"/></button></td></tr>)}</tbody></table></div></div></div>
      )}

      {activeTab === 'sanitation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div><h3 className="font-bold text-base text-slate-900 dark:text-white">نموذج متابعة النظافة والتطهير بقسم المخبوزات (18 أداة ومعدة)</h3><p className="text-xs text-slate-500">التحقق للوردية الصباحية والمسائية (بداية ونهاية التشغيل) - كود QC-IS-FM-01-13</p></div><div className="flex items-center gap-2 text-xs"><span className="flex items-center gap-1 font-bold text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5"/> مطابق (√)</span><span className="flex items-center gap-1 font-bold text-rose-600"><XCircle className="w-3.5 h-3.5"/> غير مطابق (×)</span><span className="flex items-center gap-1 font-bold text-slate-400"><Minus className="w-3.5 h-3.5"/> لم يتم العمل عليها (—)</span></div></div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"><div className="overflow-x-auto"><table className="w-full text-right text-xs"><thead className="bg-slate-50 dark:bg-slate-800/80"><tr><th rowSpan={2} className="p-3.5">م</th><th rowSpan={2} className="p-3.5">الأداة والمعدة</th><th rowSpan={2} className="p-3.5">كود الأداة</th><th colSpan={3} className="p-2 text-center">وردية صباحية</th><th colSpan={3} className="p-2 text-center">وردية مسائية</th></tr><tr><th className="p-2 text-center">بداية التشغيل</th><th className="p-2 text-center">نهاية التشغيل</th><th className="p-2">ملاحظات</th><th className="p-2 text-center">بداية التشغيل</th><th className="p-2 text-center">نهاية التشغيل</th><th className="p-2">ملاحظات</th></tr></thead><tbody>{sanitationLogB1.items.map((item,idx)=><tr key={`${item.equipmentName}-${idx}`}><td className="p-2">{idx+1}</td><td className="p-2 font-bold">{item.equipmentName}</td><td className="p-2">{item.equipmentCode||'-'}</td><td className="p-2 text-center"><button onClick={()=>toggleSanitationItem(idx,'morningShift','startShift')} className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center ${item.morningShift.startShift==='compliant'?'bg-emerald-100 text-emerald-800':item.morningShift.startShift==='non_compliant'?'bg-rose-100 text-rose-800':'bg-slate-100 text-slate-400'}`}>{item.morningShift.startShift==='compliant'?'√':item.morningShift.startShift==='non_compliant'?'×':'—'}</button></td><td className="p-2 text-center"><button onClick={()=>toggleSanitationItem(idx,'morningShift','endShift')} className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center ${item.morningShift.endShift==='compliant'?'bg-emerald-100 text-emerald-800':item.morningShift.endShift==='non_compliant'?'bg-rose-100 text-rose-800':'bg-slate-100 text-slate-400'}`}>{item.morningShift.endShift==='compliant'?'√':item.morningShift.endShift==='non_compliant'?'×':'—'}</button></td><td className="p-2 text-[11px] text-slate-400 max-w-[120px] truncate">{item.morningShift.notes||'-'}</td><td className="p-2 text-center"><button onClick={()=>toggleSanitationItem(idx,'eveningShift','startShift')} className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center ${item.eveningShift.startShift==='compliant'?'bg-emerald-100 text-emerald-800':item.eveningShift.startShift==='non_compliant'?'bg-rose-100 text-rose-800':'bg-slate-100 text-slate-400'}`}>{item.eveningShift.startShift==='compliant'?'√':item.eveningShift.startShift==='non_compliant'?'×':'—'}</button></td><td className="p-2 text-center"><button onClick={()=>toggleSanitationItem(idx,'eveningShift','endShift')} className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center ${item.eveningShift.endShift==='compliant'?'bg-emerald-100 text-emerald-800':item.eveningShift.endShift==='non_compliant'?'bg-rose-100 text-rose-800':'bg-slate-100 text-slate-400'}`}>{item.eveningShift.endShift==='compliant'?'√':item.eveningShift.endShift==='non_compliant'?'×':'—'}</button></td><td className="p-2 text-[11px] text-slate-400 max-w-[120px] truncate">{item.eveningShift.notes||'-'}</td></tr>)}</tbody></table></div></div>
          <div className="flex items-center justify-end gap-3"><button type="button" onClick={()=>void saveSanitation()} disabled={sanitationSaving} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-black shadow-sm hover:bg-emerald-700 disabled:opacity-50"><Save className="w-4 h-4"/>{sanitationSaving?'جارٍ الحفظ...':'حفظ بيانات النموذج'}</button></div>
        </div>
      )}

      {activeTab === 'ghp' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div><h3 className="font-bold text-base text-slate-900 dark:text-white">نموذج متابعة التحقق من اشتراطات سلامة الغذاء ومكافحة الآفات (GHP)</h3><p className="text-xs text-slate-500">النظافة الشخصية، المصائد الضوئية، الستائر الهوائية، سلامة البيئة والصالة (كود QC-IS-FM-01-07)</p></div><div className="text-xs font-bold text-slate-500">يمكن حفظ بيانات الورديات مباشرة</div></div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"><div className="overflow-x-auto"><table className="w-full text-right text-xs"><thead className="bg-slate-50 dark:bg-slate-800/80"><tr><th rowSpan={2} className="p-3.5 border-l">الفئة</th><th rowSpan={2} className="p-3.5 border-l">عناصر التحقق والمعايير</th><th colSpan={3} className="p-2 text-center border-l bg-emerald-50/50">وردية صباحية</th><th colSpan={3} className="p-2 text-center bg-blue-50/50">وردية مسائية</th></tr><tr><th className="p-2 text-center">بداية التشغيل</th><th className="p-2 text-center">منتصف التشغيل</th><th className="p-2 border-l">ملاحظات</th><th className="p-2 text-center">بداية التشغيل</th><th className="p-2 text-center">منتصف التشغيل</th><th className="p-2">ملاحظات</th></tr></thead><tbody>{foodSafetyLog.checks.map((chk,idx)=><tr key={chk.id}><td className="p-3 font-bold border-l text-rose-600">{chk.category==='GHP'?'GHP النظافة الشخصية':chk.category==='Pest_Control'?'Pest Control مكافحة الآفات':chk.category==='Work_Environment'?'نظافة بيئة العمل':'سلامة صالة الإنتاج'}</td><td className="p-3 font-medium border-l">{chk.criterion}</td><td className="p-2 text-center"><button onClick={()=>toggleGhpItem(idx,'morningShift','startShift')} className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center ${chk.morningShift.startShift==='compliant'?'bg-emerald-100 text-emerald-800':chk.morningShift.startShift==='non_compliant'?'bg-rose-100 text-rose-800':'bg-slate-100 text-slate-400'}`}>{chk.morningShift.startShift==='compliant'?'√':chk.morningShift.startShift==='non_compliant'?'×':'—'}</button></td><td className="p-2 text-center"><button onClick={()=>toggleGhpItem(idx,'morningShift','midShift')} className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center ${chk.morningShift.midShift==='compliant'?'bg-emerald-100 text-emerald-800':chk.morningShift.midShift==='non_compliant'?'bg-rose-100 text-rose-800':'bg-slate-100 text-slate-400'}`}>{chk.morningShift.midShift==='compliant'?'√':chk.morningShift.midShift==='non_compliant'?'×':'—'}</button></td><td className="p-2 text-[11px] text-slate-400 border-l max-w-[100px] truncate">{chk.morningShift.notes||'-'}</td><td className="p-2 text-center"><button onClick={()=>toggleGhpItem(idx,'eveningShift','startShift')} className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center ${chk.eveningShift.startShift==='compliant'?'bg-emerald-100 text-emerald-800':chk.eveningShift.startShift==='non_compliant'?'bg-rose-100 text-rose-800':'bg-slate-100 text-slate-400'}`}>{chk.eveningShift.startShift==='compliant'?'√':chk.eveningShift.startShift==='non_compliant'?'×':'—'}</button></td><td className="p-2 text-center"><button onClick={()=>toggleGhpItem(idx,'eveningShift','midShift')} className={`w-8 h-8 rounded-lg font-bold mx-auto flex items-center justify-center ${chk.eveningShift.midShift==='compliant'?'bg-emerald-100 text-emerald-800':chk.eveningShift.midShift==='non_compliant'?'bg-rose-100 text-rose-800':'bg-slate-100 text-slate-400'}`}>{chk.eveningShift.midShift==='compliant'?'√':chk.eveningShift.midShift==='non_compliant'?'×':'—'}</button></td><td className="p-2 text-[11px] text-slate-400 max-w-[100px] truncate">{chk.eveningShift.notes||'-'}</td></tr>)}</tbody></table></div></div>
          <div className="flex items-center justify-end gap-3"><button type="button" onClick={()=>void saveGhp()} disabled={ghpSaving} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-black shadow-sm hover:bg-emerald-700 disabled:opacity-50"><Save className="w-4 h-4"/>{ghpSaving?'جارٍ الحفظ...':'حفظ بيانات النموذج'}</button></div>
        </div>
      )}

      {saveMessage && <div className="fixed bottom-5 left-5 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-bold shadow-lg">{saveMessage}</div>}

      {isSensoryModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"><div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6"><div className="flex items-center justify-between pb-3 mb-4 border-b"><h3 className="font-bold">تسجيل فحص تقييم حسي جديد</h3><button type="button" onClick={()=>setIsSensoryModalOpen(false)}>✕</button></div><form onSubmit={handleSaveSensory} className="space-y-4 text-xs"><input type="text" required value={sensoryForm.productName} onChange={e=>setSensoryForm({...sensoryForm,productName:e.target.value})} className="w-full border rounded-xl p-2.5"/><select value={sensoryForm.sampleType} onChange={e=>setSensoryForm({...sensoryForm,sampleType:e.target.value as any})} className="w-full border rounded-xl p-2.5"><option value="daily_product">منتج يومي</option><option value="new_sample">عينة جديدة</option></select>{['colorScore','tasteScore','aromaScore','textureScore','overallImpressionScore'].map(key=><div key={key}><div className="flex justify-between"><span>{key}</span><span>{(sensoryForm as any)[key]} / 10</span></div><input type="range" min="0" max="10" value={(sensoryForm as any)[key]} onChange={e=>setSensoryForm({...sensoryForm,[key]:Number(e.target.value)})} className="w-full"/></div>)}<input type="text" value={sensoryForm.notes} onChange={e=>setSensoryForm({...sensoryForm,notes:e.target.value})} placeholder="ملاحظات" className="w-full border rounded-xl p-2.5"/><div className="flex justify-end gap-3"><button type="button" onClick={()=>setIsSensoryModalOpen(false)} className="px-4 py-2 border rounded-xl">إلغاء</button><button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-xl">حفظ التقييم</button></div></form></div></div>}
      {isNcrModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"><div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6"><div className="flex items-center justify-between pb-3 mb-4 border-b"><h3 className="font-bold">تسجيل بيان بالمنتجات غير المطابقة (NCR)</h3><button type="button" onClick={()=>setIsNcrModalOpen(false)}>✕</button></div><form onSubmit={handleSaveNCR} className="space-y-4 text-xs"><input type="text" required value={ncrForm.productName} onChange={e=>setNcrForm({...ncrForm,productName:e.target.value})} className="w-full border rounded-xl p-2.5"/><input type="number" value={ncrForm.productionQty} onChange={e=>setNcrForm({...ncrForm,productionQty:Number(e.target.value)})} className="w-full border rounded-xl p-2.5"/><input type="text" value={ncrForm.detectedDefects} onChange={e=>setNcrForm({...ncrForm,detectedDefects:e.target.value})} placeholder="العيوب المكتشفة" className="w-full border rounded-xl p-2.5"/><input type="number" value={ncrForm.defectiveQty} onChange={e=>setNcrForm({...ncrForm,defectiveQty:Number(e.target.value)})} className="w-full border rounded-xl p-2.5"/><input type="text" value={ncrForm.rootCause} onChange={e=>setNcrForm({...ncrForm,rootCause:e.target.value})} placeholder="السبب الجذري" className="w-full border rounded-xl p-2.5"/><input type="text" value={ncrForm.correctiveAction} onChange={e=>setNcrForm({...ncrForm,correctiveAction:e.target.value})} placeholder="التصحيح" className="w-full border rounded-xl p-2.5"/><div className="flex justify-end gap-3"><button type="button" onClick={()=>setIsNcrModalOpen(false)} className="px-4 py-2 border rounded-xl">إلغاء</button><button type="submit" className="px-5 py-2 bg-rose-600 text-white rounded-xl">حفظ NCR</button></div></form></div></div>}
    </div>
  );
};
