import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BAKERY_1_RECIPES, BAKERY_2_RECIPES } from '../../data/initialData';
import { OperatingParametersLog } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { Scale, SlidersHorizontal, Plus, CheckCircle2, Search, Layers, Flame, Clock, Droplet, XCircle } from 'lucide-react';

export const InProcessModule: React.FC = () => {
  const { activeSection, operatingParams, addOperatingParam, deleteOperatingParam, currentUser, activeDate } = useApp();

  const [activeTab, setActiveTab] = useState<'recipes' | 'parameters' | 'calculator'>('recipes');
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);
  const [complianceState, setComplianceState] = useState<Record<string, boolean>>({});
  const [nonComplianceReasons, setNonComplianceReasons] = useState<Record<string, string>>({});

  const [newLog, setNewLog] = useState<{
    time: string;
    stage: OperatingParametersLog['stage'];
    productName: string;
    temperature: string;
    duration_min: string;
    sheetingThickness_cm: string;
    glazingConcentration_pct: string;
    packagingQuality: 'مطابق' | 'غير مطابق';
    packagingExpiryDate: string;
    packagingProductionDate: string;
    packagingValidity: string;
    oilAddedPct: string;
    tpmPct: string;
    fryerCode: string;
    notes: string;
  }>({
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    stage: 'kneading',
    productName: activeSection === 1 ? 'كرواسون ساده ميجا' : 'دونتس ميجا مفتوح',
    temperature: '', duration_min: '', sheetingThickness_cm: '', glazingConcentration_pct: '',
    packagingQuality: 'مطابق', packagingExpiryDate: '', packagingProductionDate: activeDate,
    packagingValidity: '3 شهور', oilAddedPct: '', tpmPct: '', fryerCode: 'FRY-01', notes: ''
  });

  const recipes = activeSection === 1 ? BAKERY_1_RECIPES : BAKERY_2_RECIPES;
  const filteredRecipes = recipes.filter(r => r.productName.includes(searchTerm));
  const currentRecipe = recipes[selectedRecipeIndex] || recipes[0];
  const sectionLogs = operatingParams.filter(p => p.bakerySection === activeSection);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    let isCompliant = true;
    const temp = newLog.temperature ? parseFloat(newLog.temperature) : undefined;
    const dur = newLog.duration_min ? parseFloat(newLog.duration_min) : undefined;
    const thick = newLog.sheetingThickness_cm ? parseFloat(newLog.sheetingThickness_cm) : undefined;
    const glaze = newLog.glazingConcentration_pct ? parseFloat(newLog.glazingConcentration_pct) : undefined;
    const tpm = newLog.tpmPct ? parseFloat(newLog.tpmPct) : undefined;
    const oil = newLog.oilAddedPct ? parseFloat(newLog.oilAddedPct) : undefined;

    if (newLog.stage === 'kneading' && temp !== undefined && (temp < 15 || temp > 19)) isCompliant = false;
    if (newLog.stage === 'baking' && temp !== undefined) {
      const minTemp = activeSection === 1 ? 160 : 145;
      const maxTemp = activeSection === 1 ? 205 : 270;
      if (temp < minTemp || temp > maxTemp) isCompliant = false;
    }
    if (newLog.stage === 'sheeting' && thick !== undefined) {
      const maxThick = activeSection === 1 ? 0.7 : 1.5;
      if (thick < 0.4 || thick > maxThick) isCompliant = false;
    }
    if (newLog.stage === 'frying' && tpm !== undefined && tpm >= 24) isCompliant = false;
    if (newLog.stage === 'frying' && oil !== undefined && (oil < 0.5 || oil > 4.5)) isCompliant = false;

    addOperatingParam({
      time: newLog.time, stage: newLog.stage, bakerySection: activeSection, productName: newLog.productName,
      temperature: temp, duration_min: dur, sheetingThickness_cm: thick, glazingConcentration_pct: glaze,
      packagingQuality: newLog.packagingQuality, packagingProductionDate: newLog.packagingProductionDate,
      packagingExpiryDate: newLog.packagingExpiryDate, packagingValidity: newLog.packagingValidity,
      oilAddedPct: oil, tpmPct: tpm, fryerCode: newLog.fryerCode, isCompliant,
      notes: newLog.notes || (isCompliant ? 'مطابق للحدود القياسية' : '')
    });

    setNewLog(prev => ({ ...prev, temperature: '', duration_min: '', sheetingThickness_cm: '', glazingConcentration_pct: '', oilAddedPct: '', tpmPct: '', notes: '' }));
    setActiveTab('parameters');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner
        title={`متابعة عوامل التشغيل وموازين الخامات (In-Process Control)`}
        subtitle={`مصفوفة موازين الخامات الدقيقة ومعايير العجن، الفرد، التبنيط، التسوية، التلميع والتغليف - قسم المخبوزات ${activeSection}`}
        docCode="QC-IS-FM-01-06" revNo="0" date="01-01-2025"
      />

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button onClick={() => setActiveTab('recipes')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'recipes' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Scale className="w-4 h-4" /><span>مصفوفة موازين الخامات القياسية ({recipes.length} صنف)</span></button>
        <button onClick={() => setActiveTab('parameters')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'parameters' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><SlidersHorizontal className="w-4 h-4" /><span>سجل متابعة عوامل التشغيل ({sectionLogs.length})</span></button>
        <button onClick={() => setActiveTab('calculator')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'calculator' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Plus className="w-4 h-4" /><span>تسجيل قياس تشغيلي جديد</span></button>
      </div>

      {activeTab === 'recipes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-sm">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10"><div className="flex items-center gap-2 text-rose-400 text-xs font-bold"><Clock className="w-4 h-4" /><span>معيار العجن القياسي:</span></div><div className="text-sm font-extrabold mt-1">الوقت: 12 : 20 دقيقة</div><div className="text-xs text-slate-300">درجة الحرارة: 15 : 19 °م</div></div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10"><div className="flex items-center gap-2 text-amber-400 text-xs font-bold"><Layers className="w-4 h-4" /><span>معيار التبنيط والفرد:</span></div><div className="text-sm font-extrabold mt-1">{activeSection === 1 ? 'كرواسون 29% | باتيه 23%' : 'سمك العجين: 0.4 : 1.5 cm'}</div><div className="text-xs text-slate-300">{activeSection === 1 ? 'سمك العجين: 0.4 : 0.7 cm' : 'تخمير وراحة قياسية'}</div></div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10"><div className="flex items-center gap-2 text-emerald-400 text-xs font-bold"><Flame className="w-4 h-4" /><span>معيار التسوية بالفرن:</span></div><div className="text-sm font-extrabold mt-1">{activeSection === 1 ? 'الحرارة: 160 : 205 °م' : 'الحرارة: 145 : 270 °م'}</div><div className="text-xs text-slate-300">{activeSection === 1 ? 'الوقت: 6 : 40 دقيقة' : 'الوقت: 5 : 28 دقيقة'}</div></div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10"><div className="flex items-center gap-2 text-blue-400 text-xs font-bold"><Droplet className="w-4 h-4" /><span>{activeSection === 1 ? 'معيار تركيز التلميع:' : 'معيار زيت القلي (TPM):'}</span></div><div className="text-sm font-extrabold mt-1">{activeSection === 1 ? 'عسل بغاشة: 73-75%' : 'نسبة TPM: < 24%'}</div><div className="text-xs text-slate-300">{activeSection === 1 ? 'مربى مشمش دانش: 60-65%' : 'الزيت المضاف للتخفيف: 0.5-4.5%'}</div></div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div className="flex items-center gap-2"><Search className="w-4 h-4 text-slate-400" /><input type="text" placeholder="ابحث عن خلطة أو صنف..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs w-56" /></div><div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-bold"><span className="text-slate-500 dark:text-slate-400 px-2">مضاعف العجنة:</span>{[0.5,1,2,3,5].map(mult => <button key={mult} onClick={() => setBatchMultiplier(mult)} className={`px-2.5 py-1 rounded-lg ${batchMultiplier === mult ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}>×{mult}</button>)}</div></div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">{filteredRecipes.map((recipe, idx) => <button key={recipe.productName} onClick={() => setSelectedRecipeIndex(idx)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border ${selectedRecipeIndex === idx ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}><span>{recipe.productName}</span>{recipe.flour_kg && <span className="text-[10px] opacity-75">({(recipe.flour_kg * batchMultiplier).toFixed(1)} كجم دقيق)</span>}</button>)}</div>
            {currentRecipe && <div className="bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4"><div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3"><div className="flex items-center gap-2"><div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold"><Scale className="w-5 h-5" /></div><div><h4 className="font-extrabold text-base text-slate-900 dark:text-white">مكونات عجنة: {currentRecipe.productName}</h4><p className="text-xs text-slate-500 dark:text-slate-400">القيم المحسوبة لحجم عجنة (مضاعف ×{batchMultiplier})</p></div></div>{currentRecipe.notes && <span className="text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800 font-semibold">{currentRecipe.notes}</span>}</div><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">{Object.entries(currentRecipe).filter(([k]) => k !== 'productName' && k !== 'notes' && k !== 'customFields').map(([key,value]) => <div key={key} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"><div className="text-slate-400 font-medium">{key}</div><div className="text-base font-black text-rose-600 mt-1">{typeof value === 'number' ? (value * batchMultiplier).toFixed(2) : String(value)}</div></div>)}{currentRecipe.customFields && Object.entries(currentRecipe.customFields).map(([k,v]) => <div key={k} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"><div className="text-slate-400 font-medium">{k}</div><div className="text-base font-black text-rose-600 mt-1">{v}</div></div>)}</div></div>}
          </div>
        </div>
      )}

      {activeTab === 'parameters' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"><h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2"><SlidersHorizontal className="w-5 h-5 text-rose-600" /><span>سجل متابعة عوامل التشغيل (مخبوزات {activeSection})</span></h3><span className="text-xs text-slate-500">إجمالي التسجيلات: {sectionLogs.length}</span></div>
            <div className="overflow-x-auto"><table className="w-full text-right text-xs"><thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700"><tr><th className="p-3.5">الوقت</th><th className="p-3.5">المرحلة</th><th className="p-3.5">الصنف</th><th className="p-3.5">درجة الحرارة / السمك</th><th className="p-3.5">المدة (دقيقة)</th><th className="p-3.5">المعايير الإضافية (تلميع / زيت)</th><th className="p-3.5">المطابقة</th><th className="p-3.5 min-w-[280px]">سبب عدم المطابقة</th><th className="p-3.5 text-center">إجراء</th></tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {sectionLogs.map(log => {
                  const isCompliant = complianceState[log.id] ?? log.isCompliant;
                  const reason = nonComplianceReasons[log.id] ?? '';
                  return <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-slate-600 dark:text-slate-400">{log.time}</td>
                    <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400">{{kneading:'العجن',sheeting:'الفرد والتبنيط',flattening:'التشكيل',baking:'التسوية بالفرن',glazing:'التلميع',packaging:'التغليف',quick_freezing:'التجميد السريع',frying:'القلي'}[log.stage] || log.stage}</td>
                    <td className="p-3.5 font-medium">{log.productName}</td>
                    <td className="p-3.5">{log.temperature !== undefined && <span>{log.temperature} °م</span>}{log.sheetingThickness_cm !== undefined && <span>سمك: {log.sheetingThickness_cm} سم</span>}</td>
                    <td className="p-3.5">{log.duration_min !== undefined ? `${log.duration_min} دقيقة` : '-'}</td>
                    <td className="p-3.5">{log.glazingConcentration_pct !== undefined && <span>تركيز التلميع: {log.glazingConcentration_pct}%</span>}{log.tpmPct !== undefined && <span>TPM: {log.tpmPct}% | زيت: {log.oilAddedPct}%</span>}{log.packagingQuality && <span>جودة الغلاف: {log.packagingQuality}</span>}</td>
                    <td className="p-3.5"><div className="flex items-center gap-2"><label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer font-bold ${isCompliant ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 border-emerald-200' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200'}`}><input type="checkbox" aria-label={`مطابق - ${log.productName}`} checked={isCompliant} onChange={() => setComplianceState(prev => ({ ...prev, [log.id]: true }))} className="h-4 w-4" /><CheckCircle2 className="w-3.5 h-3.5" /><span>مطابق</span></label><label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border cursor-pointer font-bold ${!isCompliant ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 border-rose-200' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200'}`}><input type="checkbox" aria-label={`غير مطابق - ${log.productName}`} checked={!isCompliant} onChange={() => setComplianceState(prev => ({ ...prev, [log.id]: false }))} className="h-4 w-4" /><XCircle className="w-3.5 h-3.5" /><span>غير مطابق</span></label></div></td>
                    <td className="p-3.5">{!isCompliant ? <textarea value={reason} onChange={e => setNonComplianceReasons(prev => ({ ...prev, [log.id]: e.target.value }))} placeholder="اكتب سبب عدم المطابقة..." rows={2} className="w-full min-w-[250px] bg-slate-50 dark:bg-slate-800 border border-rose-200 rounded-xl p-2 text-xs resize-y" /> : <span className="text-slate-400">-</span>}</td>
                    <td className="p-3.5 text-center"><button onClick={() => deleteOperatingParam(log.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="حذف التسجيل"><span className="sr-only">حذف</span>🗑️</button></td>
                  </tr>;
                })}
                {sectionLogs.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-slate-400 font-medium">لا توجد تسجيلات تشغيلية مسجلة بعد لهذا القسم اليوم.</td></tr>}
              </tbody>
            </table></div>
          </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <form onSubmit={handleAddLog} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4"><h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2"><Plus className="w-5 h-5 text-rose-600" /><span>تسجيل قياس جديد لعوامل التشغيل - قسم المخبوزات {activeSection}</span></h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">إدخال درجات الحرارة والأزمنة وسماكة العجين وتركيز التلميع مع فحص المطابقة الفوري</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">الوقت</label><input type="text" required value={newLog.time} onChange={e => setNewLog({...newLog,time:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs" /></div>
            <div><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">مرحلة التشغيل</label><select value={newLog.stage} onChange={e => setNewLog({...newLog,stage:e.target.value as OperatingParametersLog['stage']})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs"><option value="kneading">العجن (Kneading)</option><option value="sheeting">الفرد والتبنيط (Sheeting)</option><option value="flattening">التشكيل (Forming)</option><option value="baking">التسوية بالفرن (Baking)</option><option value="frying">القلي (Frying - Bakery 2)</option><option value="packaging">التغليف (Packaging)</option><option value="quick_freezing">التجميد السريع (Quick Freezing)</option><option value="glazing">التلميع (Glazing)</option></select></div>
            <div><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">اسم الصنف</label><select value={newLog.productName} onChange={e => setNewLog({...newLog,productName:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs">{recipes.map(r=><option key={r.productName} value={r.productName}>{r.productName}</option>)}</select></div>
            {(newLog.stage === 'kneading' || newLog.stage === 'baking' || newLog.stage === 'frying' || newLog.stage === 'quick_freezing') && <div><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">درجة الحرارة (°م)</label><input type="number" step="0.5" value={newLog.temperature} onChange={e => setNewLog({...newLog,temperature:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs" /></div>}
            {(newLog.stage === 'kneading' || newLog.stage === 'baking') && <div><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">الوقت / المدة (بالدقائق)</label><input type="number" value={newLog.duration_min} onChange={e => setNewLog({...newLog,duration_min:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs" /></div>}
            {newLog.stage === 'sheeting' && <div><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">سمك العجين (سم)</label><input type="number" step="0.05" value={newLog.sheetingThickness_cm} onChange={e => setNewLog({...newLog,sheetingThickness_cm:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs" /></div>}
            {newLog.stage === 'glazing' && <div><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">تركيز التلميع %</label><input type="number" value={newLog.glazingConcentration_pct} onChange={e => setNewLog({...newLog,glazingConcentration_pct:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs" /></div>}
            {newLog.stage === 'frying' && <><div><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">نسبة TPM للزيت %</label><input type="number" step="0.1" value={newLog.tpmPct} onChange={e => setNewLog({...newLog,tpmPct:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs" /></div><div><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">نسبة الزيت المضافة للتخفيف %</label><input type="number" step="0.1" value={newLog.oilAddedPct} onChange={e => setNewLog({...newLog,oilAddedPct:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs" /></div></>}
            <div className="sm:col-span-2 md:col-span-3"><label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">ملاحظات الفاحص والتشغيل</label><input type="text" value={newLog.notes} onChange={e => setNewLog({...newLog,notes:e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 text-xs" /></div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800"><button type="button" onClick={() => setActiveTab('parameters')} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs">إلغاء</button><button type="submit" className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /><span>حفظ القياس والتحقق</span></button></div>
        </form>
      )}
    </div>
  );
};
