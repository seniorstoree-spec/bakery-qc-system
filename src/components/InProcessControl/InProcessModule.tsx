import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OperatingParametersLog, RawMaterialRecipe } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { 
  SlidersHorizontal, 
  Scale, 
  Plus, 
  Trash2, 
  Edit2,
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Droplet, 
  Layers, 
  Maximize2,
  Check,
  Search
} from 'lucide-react';

export const InProcessModule: React.FC = () => {
  const { 
    activeSection, 
    recipesList,
    operatingParams, 
    addOperatingParam, 
    updateOperatingParam,
    deleteOperatingParam,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'recipes' | 'parameters' | 'calculator'>('recipes');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // New/Edit Operating Log State
  const [newLog, setNewLog] = useState<{
    time: string;
    stage: OperatingParametersLog['stage'];
    productName: string;
    temperature: string;
    duration_min: string;
    sheetingThickness_cm: string;
    glazingConcentration_pct: string;
    oilAddedPct: string;
    tpmPct: string;
    packagingQuality: 'مطابق' | 'غير مطابق';
    notes: string;
  }>({
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    stage: 'kneading',
    productName: '',
    temperature: '17',
    duration_min: '15',
    sheetingThickness_cm: '0.5',
    glazingConcentration_pct: '63',
    oilAddedPct: '2.1',
    tpmPct: '14.5',
    packagingQuality: 'مطابق',
    notes: ''
  });

  const recipes = recipesList.filter(r => r.sectionId === activeSection || !r.sectionId);
  const currentRecipe = recipes.find(r => r.productName === selectedProduct) || recipes[0];

  const sectionLogs = operatingParams.filter(p => p.bakerySection === activeSection);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const tempVal = newLog.temperature ? parseFloat(newLog.temperature) : undefined;
    const durVal = newLog.duration_min ? parseFloat(newLog.duration_min) : undefined;
    const thickVal = newLog.sheetingThickness_cm ? parseFloat(newLog.sheetingThickness_cm) : undefined;
    const glazeVal = newLog.glazingConcentration_pct ? parseFloat(newLog.glazingConcentration_pct) : undefined;
    const tpmVal = newLog.tpmPct ? parseFloat(newLog.tpmPct) : undefined;
    const oilVal = newLog.oilAddedPct ? parseFloat(newLog.oilAddedPct) : undefined;

    let isCompliant = true;
    if (newLog.stage === 'kneading') {
      if (tempVal !== undefined && (tempVal < 15 || tempVal > 19)) isCompliant = false;
      if (durVal !== undefined && (durVal < 12 || durVal > 20)) isCompliant = false;
    } else if (newLog.stage === 'sheeting') {
      if (thickVal !== undefined && (thickVal < 0.4 || thickVal > 1.5)) isCompliant = false;
    } else if (newLog.stage === 'frying') {
      if (tpmVal !== undefined && tpmVal >= 24) isCompliant = false;
    }

    if (editingLogId) {
      updateOperatingParam(editingLogId, {
        time: newLog.time,
        stage: newLog.stage,
        productName: newLog.productName || currentRecipe?.productName || 'كرواسون',
        temperature: tempVal,
        duration_min: durVal,
        sheetingThickness_cm: thickVal,
        glazingConcentration_pct: glazeVal,
        tpmPct: tpmVal,
        oilAddedPct: oilVal,
        packagingQuality: newLog.packagingQuality,
        isCompliant,
        notes: newLog.notes
      });
      setEditingLogId(null);
    } else {
      addOperatingParam({
        time: newLog.time,
        stage: newLog.stage,
        productName: newLog.productName || currentRecipe?.productName || 'كرواسون',
        bakerySection: activeSection,
        temperature: tempVal,
        duration_min: durVal,
        sheetingThickness_cm: thickVal,
        glazingConcentration_pct: glazeVal,
        tpmPct: tpmVal,
        oilAddedPct: oilVal,
        packagingQuality: newLog.packagingQuality,
        isCompliant,
        notes: newLog.notes
      });
    }

    setNewLog({
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      stage: 'kneading',
      productName: '',
      temperature: '17',
      duration_min: '15',
      sheetingThickness_cm: '0.5',
      glazingConcentration_pct: '63',
      oilAddedPct: '2.1',
      tpmPct: '14.5',
      packagingQuality: 'مطابق',
      notes: ''
    });
    setActiveTab('parameters');
  };

  const handleOpenEditLog = (log: OperatingParametersLog) => {
    setEditingLogId(log.id);
    setNewLog({
      time: log.time,
      stage: log.stage,
      productName: log.productName,
      temperature: log.temperature !== undefined ? log.temperature.toString() : '',
      duration_min: log.duration_min !== undefined ? log.duration_min.toString() : '',
      sheetingThickness_cm: log.sheetingThickness_cm !== undefined ? log.sheetingThickness_cm.toString() : '',
      glazingConcentration_pct: log.glazingConcentration_pct !== undefined ? log.glazingConcentration_pct.toString() : '',
      oilAddedPct: log.oilAddedPct !== undefined ? log.oilAddedPct.toString() : '',
      tpmPct: log.tpmPct !== undefined ? log.tpmPct.toString() : '',
      packagingQuality: log.packagingQuality || 'مطابق',
      notes: log.notes || ''
    });
    setActiveTab('calculator');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner
        title={`متابعة عوامل التشغيل وموازين الخامات (In-Process Control)`}
        subtitle={`مصفوفة موازين الخامات الدقيقة ومعايير العجن، الفرد، التبنيط، التسوية، التلميع والتغليف - قسم المخبوزات ${activeSection}`}
        docCode="QC-IS-FM-01-06"
        revNo="0"
        date="01-01-2025"
      />

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'recipes'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>مصفوفة موازين الخامات القياسية ({recipes.length} صنف)</span>
        </button>

        <button
          onClick={() => setActiveTab('parameters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'parameters'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>سجل متابعة عوامل التشغيل ({sectionLogs.length})</span>
        </button>

        <button
          onClick={() => {
            setEditingLogId(null);
            setNewLog({
              time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
              stage: 'kneading',
              productName: '',
              temperature: '17',
              duration_min: '15',
              sheetingThickness_cm: '0.5',
              glazingConcentration_pct: '63',
              oilAddedPct: '2.1',
              tpmPct: '14.5',
              packagingQuality: 'مطابق',
              notes: ''
            });
            setActiveTab('calculator');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'calculator'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{editingLogId ? 'تعديل القياس التشغيلي' : 'تسجيل قياس تشغيلي جديد'}</span>
        </button>
      </div>

      {/* Tab 1: Recipes Matrix */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-sm">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                <Clock className="w-4 h-4" />
                <span>معيار العجن القياسي:</span>
              </div>
              <div className="text-sm font-extrabold mt-1">الوقت: 12 : 20 دقيقة</div>
              <div className="text-xs text-slate-300">درجة الحرارة: 15 : 19 °م</div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Layers className="w-4 h-4" />
                <span>معيار التبنيط والفرد:</span>
              </div>
              <div className="text-sm font-extrabold mt-1">
                {activeSection === 1 ? 'كرواسون 29% | باتيه 23%' : 'سمك العجين: 0.4 : 1.5 cm'}
              </div>
              <div className="text-xs text-slate-300">
                {activeSection === 1 ? 'سمك العجين: 0.4 : 0.7 cm' : 'تخمير وراحة قياسية'}
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Flame className="w-4 h-4" />
                <span>معيار التسوية بالفرن:</span>
              </div>
              <div className="text-sm font-extrabold mt-1">
                {activeSection === 1 ? 'الحرارة: 160 : 205 °م' : 'الحرارة: 145 : 270 °م'}
              </div>
              <div className="text-xs text-slate-300">
                {activeSection === 1 ? 'الوقت: 6 : 40 دقيقة' : 'الوقت: 5 : 28 دقيقة'}
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                <Droplet className="w-4 h-4" />
                <span>
                  {activeSection === 1 ? 'معيار تركيز التلميع:' : 'معيار زيت القلي (TPM):'}
                </span>
              </div>
              <div className="text-sm font-extrabold mt-1">
                {activeSection === 1 ? 'عسل بغاشة: 73-75%' : 'نسبة TPM: < 24%'}
              </div>
              <div className="text-xs text-slate-300">
                {activeSection === 1 ? 'مربى مشمش دانش: 60-65%' : 'الزيت المضاف للتخفيف: 0.5-4.5%'}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">اختر الصنف لعرض الخلطة القياسية:</label>
                <select
                  value={selectedProduct || recipes[0]?.productName}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 dark:text-white"
                >
                  {recipes.map(r => (
                    <option key={r.productName} value={r.productName}>{r.productName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">مضاعف العجنة:</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setBatchMultiplier(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        batchMultiplier === num
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      ×{num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {currentRecipe && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-rose-600" />
                    <span>مقادير عجين {currentRecipe.productName}</span>
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                  {currentRecipe.flour_kg !== undefined && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                      <div className="text-slate-400 font-medium">دقيق (كجم)</div>
                      <div className="text-base font-black text-rose-600 mt-1">
                        {(currentRecipe.flour_kg * batchMultiplier).toFixed(2)} كجم
                      </div>
                    </div>
                  )}

                  {currentRecipe.butter_kg !== undefined && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                      <div className="text-slate-400 font-medium">زبدة (كجم)</div>
                      <div className="text-base font-black text-amber-600 mt-1">
                        {(currentRecipe.butter_kg * batchMultiplier).toFixed(2)} كجم
                      </div>
                    </div>
                  )}

                  {currentRecipe.water_ice_L !== undefined && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                      <div className="text-slate-400 font-medium">ماء + ثلج (لتر)</div>
                      <div className="text-base font-black text-blue-500 mt-1">
                        {(currentRecipe.water_ice_L * batchMultiplier).toFixed(1)} لتر
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Operational Parameters Table */}
      {activeTab === 'parameters' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-rose-600" />
                <span>سجل متابعة عوامل التشغيل اليومية - قسم المخبوزات {activeSection}</span>
              </h3>
              <span className="text-xs text-slate-500">عدد القياسات: {sectionLogs.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">الوقت</th>
                    <th className="p-3.5">المرحلة</th>
                    <th className="p-3.5">الصنف</th>
                    <th className="p-3.5">درجة الحرارة / السمك</th>
                    <th className="p-3.5">المدة (دقيقة)</th>
                    <th className="p-3.5">التلميع / الزيت / التغليف</th>
                    <th className="p-3.5">المطابقة</th>
                    <th className="p-3.5">ملاحظات</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {sectionLogs.map((log) => {
                    const stageNames: Record<string, string> = {
                      kneading: 'العجن',
                      sheeting: 'الفرد والتبنيط',
                      flattening: 'التشكيل',
                      baking: 'التسوية بالفرن',
                      glazing: 'التلميع',
                      packaging: 'التغليف',
                      quick_freezing: 'التجميد السريع',
                      frying: 'القلي'
                    };

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-slate-600 dark:text-slate-400">{log.time}</td>
                        <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400">{stageNames[log.stage] || log.stage}</td>
                        <td className="p-3.5 font-medium">{log.productName}</td>
                        <td className="p-3.5">
                          {log.temperature !== undefined && <span>{log.temperature} °م</span>}
                          {log.sheetingThickness_cm !== undefined && <span>سمك: {log.sheetingThickness_cm} سم</span>}
                        </td>
                        <td className="p-3.5">
                          {log.duration_min !== undefined ? `${log.duration_min} دقيقة` : '-'}
                        </td>
                        <td className="p-3.5">
                          {log.glazingConcentration_pct !== undefined && <span>تركيز التلميع: {log.glazingConcentration_pct}%</span>}
                          {log.tpmPct !== undefined && <span>TPM: {log.tpmPct}%</span>}
                          {log.packagingQuality && <span>الغلاف: {log.packagingQuality}</span>}
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            log.isCompliant
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                              : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                          }`}>
                            {log.isCompliant ? 'مطابق' : 'غير مطابق'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 dark:text-slate-400 max-w-xs truncate">{log.notes || '-'}</td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditLog(log)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                              title="تعديل السجل"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteOperatingParam(log.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="حذف التسجيل"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Quick Parameter Entry Form */}
      {activeTab === 'calculator' && (
        <form onSubmit={handleAddLog} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-600" />
              <span>{editingLogId ? 'تعديل قياس عوامل التشغيل' : 'تسجيل قياس جديد لعوامل التشغيل'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1">الوقت</label>
              <input
                type="text"
                required
                value={newLog.time}
                onChange={(e) => setNewLog({ ...newLog, time: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">اسم الصنف</label>
              <input
                type="text"
                required
                placeholder="اسم المنتج..."
                value={newLog.productName}
                onChange={(e) => setNewLog({ ...newLog, productName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">مرحلة التشغيل</label>
              <select
                value={newLog.stage}
                onChange={(e) => setNewLog({ ...newLog, stage: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
              >
                <option value="kneading">العجن (Kneading)</option>
                <option value="sheeting">الفرد والتبنيط (Sheeting)</option>
                <option value="flattening">التشكيل (Forming)</option>
                <option value="baking">التسوية بالفرن (Baking)</option>
                <option value="glazing">التلميع (Glazing)</option>
                <option value="frying">القلي (Frying)</option>
                <option value="packaging">التغليف (Packaging)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => { setEditingLogId(null); setActiveTab('parameters'); }}
              className="px-4 py-2 border rounded-xl font-bold text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingLogId ? 'تحديث السجل' : 'حفظ القياس'}</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
