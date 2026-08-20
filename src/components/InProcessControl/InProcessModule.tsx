import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BAKERY_1_RECIPES, BAKERY_2_RECIPES } from '../../data/initialData';
import { RawMaterialRecipe, OperatingParametersLog } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { 
  Scale, 
  SlidersHorizontal, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  Trash2, 
  Search, 
  Layers, 
  Flame, 
  Clock, 
  Thermometer, 
  Droplet,
  PackageCheck
} from 'lucide-react';

export const InProcessModule: React.FC = () => {
  const { 
    activeSection, 
    operatingParams, 
    addOperatingParam, 
    deleteOperatingParam, 
    currentUser,
    activeDate 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'recipes' | 'parameters' | 'calculator'>('recipes');
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Interactive recipe scaling multiplier
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);

  // New Parameter Entry Form State
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
    temperature: '',
    duration_min: '',
    sheetingThickness_cm: '',
    glazingConcentration_pct: '',
    packagingQuality: 'مطابق',
    packagingExpiryDate: '',
    packagingProductionDate: activeDate,
    packagingValidity: '3 شهور',
    oilAddedPct: '',
    tpmPct: '',
    fryerCode: 'FRY-01',
    notes: ''
  });

  const recipes = activeSection === 1 ? BAKERY_1_RECIPES : BAKERY_2_RECIPES;
  const filteredRecipes = recipes.filter(r => r.productName.includes(searchTerm));
  const currentRecipe = recipes[selectedRecipeIndex] || recipes[0];

  const sectionLogs = operatingParams.filter(p => p.bakerySection === activeSection);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Automatic compliance check
    let isCompliant = true;
    const temp = newLog.temperature ? parseFloat(newLog.temperature) : undefined;
    const dur = newLog.duration_min ? parseFloat(newLog.duration_min) : undefined;
    const thick = newLog.sheetingThickness_cm ? parseFloat(newLog.sheetingThickness_cm) : undefined;
    const glaze = newLog.glazingConcentration_pct ? parseFloat(newLog.glazingConcentration_pct) : undefined;
    const tpm = newLog.tpmPct ? parseFloat(newLog.tpmPct) : undefined;
    const oil = newLog.oilAddedPct ? parseFloat(newLog.oilAddedPct) : undefined;

    if (newLog.stage === 'kneading' && temp !== undefined) {
      if (temp < 15 || temp > 19) isCompliant = false;
    }
    if (newLog.stage === 'baking' && temp !== undefined) {
      const minTemp = activeSection === 1 ? 160 : 145;
      const maxTemp = activeSection === 1 ? 205 : 270;
      if (temp < minTemp || temp > maxTemp) isCompliant = false;
    }
    if (newLog.stage === 'sheeting' && thick !== undefined) {
      const maxThick = activeSection === 1 ? 0.7 : 1.5;
      if (thick < 0.4 || thick > maxThick) isCompliant = false;
    }
    if (newLog.stage === 'frying' && tpm !== undefined && tpm >= 24) {
      isCompliant = false;
    }
    if (newLog.stage === 'frying' && oil !== undefined && (oil < 0.5 || oil > 4.5)) {
      isCompliant = false;
    }

    addOperatingParam({
      time: newLog.time,
      stage: newLog.stage,
      bakerySection: activeSection,
      productName: newLog.productName,
      temperature: temp,
      duration_min: dur,
      sheetingThickness_cm: thick,
      glazingConcentration_pct: glaze,
      packagingQuality: newLog.packagingQuality,
      packagingProductionDate: newLog.packagingProductionDate,
      packagingExpiryDate: newLog.packagingExpiryDate,
      packagingValidity: newLog.packagingValidity,
      oilAddedPct: oil,
      tpmPct: tpm,
      fryerCode: newLog.fryerCode,
      isCompliant,
      notes: newLog.notes || (isCompliant ? 'مطابق للحدود القياسية' : 'انحراف عن المعيار القياسي للتشغيل')
    });

    // Reset inputs
    setNewLog(prev => ({
      ...prev,
      temperature: '',
      duration_min: '',
      sheetingThickness_cm: '',
      glazingConcentration_pct: '',
      oilAddedPct: '',
      tpmPct: '',
      notes: ''
    }));
    setActiveTab('parameters');
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
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'calculator'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل قياس تشغيلي جديد</span>
        </button>
      </div>

      {/* Tab 1: Recipes Matrix */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          
          {/* Operating Standard Limits Quick Bar */}
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

          {/* Recipe Selector & Batch Scaling Tool */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن خلطة أو صنف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 w-56"
                />
              </div>

              {/* Batch multiplier buttons */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400 px-2">مضاعف العجنة:</span>
                {[0.5, 1, 2, 3, 5].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setBatchMultiplier(mult)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      batchMultiplier === mult
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    ×{mult}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Recipe Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {filteredRecipes.map((recipe, idx) => {
                const isSelected = selectedRecipeIndex === idx;
                return (
                  <button
                    key={recipe.productName}
                    onClick={() => setSelectedRecipeIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{recipe.productName}</span>
                    {recipe.flour_kg && (
                      <span className="text-[10px] opacity-75">({(recipe.flour_kg * batchMultiplier).toFixed(1)} كجم دقيق)</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Recipe Card */}
            {currentRecipe && (
              <div className="bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        مكونات عجنة: {currentRecipe.productName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        القيم المحسوبة لحجم عجنة (مضاعف ×{batchMultiplier})
                      </p>
                    </div>
                  </div>
                  {currentRecipe.notes && (
                    <span className="text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800 font-semibold">
                      {currentRecipe.notes}
                    </span>
                  )}
                </div>

                {/* Grid of Raw Materials with precise document values */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                  {currentRecipe.flour_kg !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">دقيق (كجم)</div>
                      <div className="text-base font-black text-rose-600 mt-1">
                        {(currentRecipe.flour_kg * batchMultiplier).toFixed(2)} كجم
                      </div>
                    </div>
                  )}

                  {currentRecipe.butter_kg !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">زبدة (كجم)</div>
                      <div className="text-base font-black text-amber-600 mt-1">
                        {(currentRecipe.butter_kg * batchMultiplier).toFixed(2)} كجم
                      </div>
                    </div>
                  )}

                  {currentRecipe.pasteurized_eggs_kg !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">بيض مبستر (كجم)</div>
                      <div className="text-base font-black text-amber-700 mt-1">
                        {(currentRecipe.pasteurized_eggs_kg * batchMultiplier).toFixed(2)} كجم
                      </div>
                    </div>
                  )}

                  {currentRecipe.powdered_milk_kg !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">لبن بودرة (كجم)</div>
                      <div className="text-base font-black text-blue-600 mt-1">
                        {(currentRecipe.powdered_milk_kg * batchMultiplier).toFixed(2)} كجم
                      </div>
                    </div>
                  )}

                  {currentRecipe.sugar_kg !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">سكر (كجم)</div>
                      <div className="text-base font-black text-purple-600 mt-1">
                        {(currentRecipe.sugar_kg * batchMultiplier).toFixed(2)} كجم
                      </div>
                    </div>
                  )}

                  {currentRecipe.salt_gm !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">ملح (جم)</div>
                      <div className="text-base font-black text-slate-700 dark:text-slate-200 mt-1">
                        {(currentRecipe.salt_gm * batchMultiplier).toLocaleString('ar-EG')} جم
                      </div>
                    </div>
                  )}

                  {currentRecipe.yeast_gm !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">خميرة (جم)</div>
                      <div className="text-base font-black text-emerald-600 mt-1">
                        {(currentRecipe.yeast_gm * batchMultiplier).toLocaleString('ar-EG')} جم
                      </div>
                    </div>
                  )}

                  {currentRecipe.improver_gm !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">محسن (جم)</div>
                      <div className="text-base font-black text-teal-600 mt-1">
                        {(currentRecipe.improver_gm * batchMultiplier).toLocaleString('ar-EG')} جم
                      </div>
                    </div>
                  )}

                  {currentRecipe.softener_gm !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">مطري (جم)</div>
                      <div className="text-base font-black text-cyan-600 mt-1">
                        {(currentRecipe.softener_gm * batchMultiplier).toLocaleString('ar-EG')} جم
                      </div>
                    </div>
                  )}

                  {currentRecipe.gluten_kg !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">جلوتين (كجم/جم)</div>
                      <div className="text-base font-black text-indigo-600 mt-1">
                        {(currentRecipe.gluten_kg * batchMultiplier).toFixed(2)}
                      </div>
                    </div>
                  )}

                  {currentRecipe.oil_L !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">زيت (لتر)</div>
                      <div className="text-base font-black text-amber-500 mt-1">
                        {(currentRecipe.oil_L * batchMultiplier).toFixed(2)} لتر
                      </div>
                    </div>
                  )}

                  {currentRecipe.water_ice_L !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">ماء + ثلج (لتر)</div>
                      <div className="text-base font-black text-blue-500 mt-1">
                        {(currentRecipe.water_ice_L * batchMultiplier).toFixed(1)} لتر
                      </div>
                    </div>
                  )}

                  {currentRecipe.debris_kg !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">دبري (كجم)</div>
                      <div className="text-base font-black text-orange-600 mt-1">
                        {(currentRecipe.debris_kg * batchMultiplier).toFixed(1)} كجم
                      </div>
                    </div>
                  )}

                  {currentRecipe.polish_kg !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">بوليش (كجم)</div>
                      <div className="text-base font-black text-pink-600 mt-1">
                        {(currentRecipe.polish_kg * batchMultiplier).toFixed(1)} كجم
                      </div>
                    </div>
                  )}

                  {currentRecipe.broken_ghorayeba_kg !== undefined && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">كسر غريبة (كجم)</div>
                      <div className="text-base font-black text-amber-800 mt-1">
                        {(currentRecipe.broken_ghorayeba_kg * batchMultiplier).toFixed(1)} كجم
                      </div>
                    </div>
                  )}

                  {/* Custom Fields if any */}
                  {currentRecipe.customFields && Object.entries(currentRecipe.customFields).map(([k, v]) => (
                    <div key={k} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="text-slate-400 font-medium">{k}</div>
                      <div className="text-base font-black text-rose-600 mt-1">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Operating Parameters Log */}
      {activeTab === 'parameters' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-rose-600" />
                <span>سجل متابعة عوامل التشغيل (مخبوزات {activeSection})</span>
              </h3>
              <span className="text-xs text-slate-500">إجمالي التسجيلات: {sectionLogs.length}</span>
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
                    <th className="p-3.5">المعايير الإضافية (تلميع / زيت)</th>
                    <th className="p-3.5">الحالة الرقابية</th>
                    <th className="p-3.5">ملاحظات</th>
                    <th className="p-3.5 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {sectionLogs.map((log) => {
                    const stageNames = {
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
                          {log.tpmPct !== undefined && <span>TPM: {log.tpmPct}% | زيت: {log.oilAddedPct}%</span>}
                          {log.packagingQuality && <span>جودة الغلاف: {log.packagingQuality}</span>}
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            log.isCompliant
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}>
                            {log.isCompliant ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-rose-600" />}
                            <span>{log.isCompliant ? 'مطابق' : 'غير مطابق'}</span>
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 dark:text-slate-400 max-w-xs truncate">{log.notes || '-'}</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => deleteOperatingParam(log.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="حذف التسجيل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {sectionLogs.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400 font-medium">
                        لا توجد تسجيلات تشغيلية مسجلة بعد لهذا القسم اليوم.
                      </td>
                    </tr>
                  )}
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
              <span>تسجيل قياس جديد لعوامل التشغيل - قسم المخبوزات {activeSection}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              إدخال درجات الحرارة والأزمنة وسماكة العجين وتركيز التلميع مع فحص المطابقة الفوري
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            
            {/* Time */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">الوقت</label>
              <input
                type="text"
                required
                value={newLog.time}
                onChange={(e) => setNewLog({ ...newLog, time: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Stage */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">مرحلة التشغيل</label>
              <select
                value={newLog.stage}
                onChange={(e) => setNewLog({ ...newLog, stage: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="kneading">العجن (Kneading)</option>
                <option value="sheeting">الفرد والتبنيط (Sheeting)</option>
                <option value="flattening">التشكيل (Forming)</option>
                <option value="baking">التسوية بالفرن (Baking)</option>
                <option value="glazing">التلميع (Glazing)</option>
                <option value="frying">القلي (Frying - Bakery 2)</option>
                <option value="packaging">التغليف (Packaging)</option>
                <option value="quick_freezing">التجميد السريع (Quick Freezing)</option>
              </select>
            </div>

            {/* Product Name */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">اسم الصنف</label>
              <select
                value={newLog.productName}
                onChange={(e) => setNewLog({ ...newLog, productName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
              >
                {recipes.map(r => (
                  <option key={r.productName} value={r.productName}>{r.productName}</option>
                ))}
              </select>
            </div>

            {/* Temperature */}
            {(newLog.stage === 'kneading' || newLog.stage === 'baking' || newLog.stage === 'frying' || newLog.stage === 'quick_freezing') && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  درجة الحرارة (°م)
                  {newLog.stage === 'kneading' && <span className="text-slate-400 font-normal"> (القياسي 15:19°C)</span>}
                  {newLog.stage === 'baking' && <span className="text-slate-400 font-normal"> ({activeSection === 1 ? '160:205°C' : '145:270°C'})</span>}
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="مثال: 18"
                  value={newLog.temperature}
                  onChange={(e) => setNewLog({ ...newLog, temperature: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            )}

            {/* Duration */}
            {(newLog.stage === 'kneading' || newLog.stage === 'baking') && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  الوقت / المدة (بالدقائق)
                  {newLog.stage === 'kneading' && <span className="text-slate-400 font-normal"> (12 : 20 min)</span>}
                  {newLog.stage === 'baking' && <span className="text-slate-400 font-normal"> ({activeSection === 1 ? '6 : 40 min' : '5 : 28 min'})</span>}
                </label>
                <input
                  type="number"
                  placeholder="مثال: 15"
                  value={newLog.duration_min}
                  onChange={(e) => setNewLog({ ...newLog, duration_min: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            )}

            {/* Sheeting Thickness */}
            {newLog.stage === 'sheeting' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  سمك العجين (سم)
                  <span className="text-slate-400 font-normal"> ({activeSection === 1 ? '0.4 : 0.7 cm' : '0.4 : 1.5 cm'})</span>
                </label>
                <input
                  type="number"
                  step="0.05"
                  placeholder="مثال: 0.5"
                  value={newLog.sheetingThickness_cm}
                  onChange={(e) => setNewLog({ ...newLog, sheetingThickness_cm: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            )}

            {/* Glazing */}
            {newLog.stage === 'glazing' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  تركيز التلميع %
                  <span className="text-slate-400 font-normal"> (بغاشة 73-75% / دانش 60-65%)</span>
                </label>
                <input
                  type="number"
                  placeholder="مثال: 62"
                  value={newLog.glazingConcentration_pct}
                  onChange={(e) => setNewLog({ ...newLog, glazingConcentration_pct: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            )}

            {/* Frying TPM & Oil */}
            {newLog.stage === 'frying' && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    نسبة TPM للزيت % (أقل من 24%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="مثال: 15.2"
                    value={newLog.tpmPct}
                    onChange={(e) => setNewLog({ ...newLog, tpmPct: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    نسبة الزيت المضافة للتخفيف % (0.5 - 4.5)%
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="مثال: 2.0"
                    value={newLog.oilAddedPct}
                    onChange={(e) => setNewLog({ ...newLog, oilAddedPct: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">ملاحظات الفاحص والتشغيل</label>
              <input
                type="text"
                placeholder="أية ملاحظات إضافية أثناء التشغيل..."
                value={newLog.notes}
                onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('parameters')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ القياس والتحقق</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
