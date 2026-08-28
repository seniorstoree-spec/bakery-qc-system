import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CoreTemperatureRecord, AdditiveWeightRecord, ProductWeightSpecRecord } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { 
  Thermometer, 
  Flame, 
  Scale, 
  Plus, 
  Trash2, 
  Edit2,
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';

export const WeightsTempModule: React.FC = () => {
  const { 
    activeSection, 
    coreTemperatures, 
    addCoreTemperature, 
    updateCoreTemperature,
    deleteCoreTemperature,
    additiveWeights,
    addAdditiveWeightRecord,
    updateAdditiveWeightRecord,
    deleteAdditiveWeightRecord,
    productWeightSpecs,
    addProductWeightSpec,
    updateProductWeightSpec,
    deleteProductWeightSpec,
    currentUser,
    activeDate,
    criticalLimits
  } = useApp();

  const [activeTab, setActiveTab] = useState<'temp' | 'additives' | 'weights'>('temp');
  
  // Modals state
  const [isTempModalOpen, setIsTempModalOpen] = useState(false);
  const [editingTempId, setEditingTempId] = useState<string | null>(null);

  const [isAdditiveModalOpen, setIsAdditiveModalOpen] = useState(false);
  const [editingAdditiveId, setEditingAdditiveId] = useState<string | null>(null);

  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [editingWeightId, setEditingWeightId] = useState<string | null>(null);

  // New/Edit Core Temp Record State
  const [tempForm, setTempForm] = useState({
    productName: activeSection === 1 ? 'كرواسون ساده' : 'دونتس مفتوح',
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    machineCode: activeSection === 1 ? 'OVEN-01' : 'FRY-01',
    coreTemperature: '93.5',
    correctiveAction: '',
    verifiedBy: 'م. محمد سيف الإسلام'
  });

  // New/Edit Additive Weight State
  const [additiveForm, setAdditiveForm] = useState({
    productName: 'بغاشة',
    additiveName: 'ملح ليمون E330 (0.67 جم / كجم)',
    batchNumber: `LOT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-01`,
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    actualWeight_gm: '0.67',
    standardLimit_gm: '0.67',
    correctiveAction: '',
    verifiedBy: 'م. محمد سيف الإسلام'
  });

  // New/Edit Product Weight State
  const [weightForm, setWeightForm] = useState({
    productName: 'دونتس مفتوح ميجا (شيكولاتة)',
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    doughWeight: '80',
    doughWeightMin: '75',
    doughWeightMax: '85',
    bakedWeight: '90',
    bakedWeightMin: '85',
    bakedWeightMax: '95',
    finishedWeight: '112',
    finishedWeightMin: '105',
    finishedWeightMax: '120'
  });

  const handleSaveTemp = (e: React.FormEvent) => {
    e.preventDefault();
    const tempVal = parseFloat(tempForm.coreTemperature) || 90;
    const isCompliant = tempVal >= (criticalLimits.coreTempMin || 90);

    if (editingTempId) {
      updateCoreTemperature(editingTempId, {
        productName: tempForm.productName,
        time: tempForm.time,
        machineCode: tempForm.machineCode,
        coreTemperature: tempVal,
        isCompliant,
        responsiblePerson: currentUser.name,
        correctiveAction: isCompliant ? undefined : tempForm.correctiveAction || 'إعادة ضبط حرارة وسرعة السير بالفرن وفحص عينة جديدة',
        verifiedBy: tempForm.verifiedBy
      });
    } else {
      addCoreTemperature({
        sn: coreTemperatures.length + 1,
        productName: tempForm.productName,
        time: tempForm.time,
        machineCode: tempForm.machineCode,
        coreTemperature: tempVal,
        isCompliant,
        responsiblePerson: currentUser.name,
        correctiveAction: isCompliant ? undefined : tempForm.correctiveAction || 'إعادة ضبط حرارة وسرعة السير بالفرن وفحص عينة جديدة',
        verifiedBy: tempForm.verifiedBy,
        date: activeDate,
        bakerySection: activeSection
      });
    }

    setIsTempModalOpen(false);
    setEditingTempId(null);
  };

  const handleOpenEditTemp = (rec: CoreTemperatureRecord) => {
    setEditingTempId(rec.id);
    setTempForm({
      productName: rec.productName,
      time: rec.time,
      machineCode: rec.machineCode,
      coreTemperature: rec.coreTemperature.toString(),
      correctiveAction: rec.correctiveAction || '',
      verifiedBy: rec.verifiedBy || 'م. محمد سيف الإسلام'
    });
    setIsTempModalOpen(true);
  };

  const handleSaveAdditive = (e: React.FormEvent) => {
    e.preventDefault();
    const actual = parseFloat(additiveForm.actualWeight_gm) || 0;
    const standard = parseFloat(additiveForm.standardLimit_gm) || 0;
    const isCompliant = actual <= standard;

    if (editingAdditiveId) {
      updateAdditiveWeightRecord(editingAdditiveId, {
        productName: additiveForm.productName,
        additiveName: additiveForm.additiveName,
        batchNumber: additiveForm.batchNumber,
        time: additiveForm.time,
        actualWeight_gm: actual,
        standardLimit_gm: standard,
        isCompliant,
        responsiblePerson: currentUser.name,
        correctiveAction: isCompliant ? undefined : additiveForm.correctiveAction,
        verifiedBy: additiveForm.verifiedBy
      });
    } else {
      addAdditiveWeightRecord({
        sn: additiveWeights.length + 1,
        productName: additiveForm.productName,
        additiveName: additiveForm.additiveName,
        batchNumber: additiveForm.batchNumber,
        time: additiveForm.time,
        actualWeight_gm: actual,
        standardLimit_gm: standard,
        isCompliant,
        responsiblePerson: currentUser.name,
        correctiveAction: isCompliant ? undefined : additiveForm.correctiveAction,
        verifiedBy: additiveForm.verifiedBy,
        date: activeDate
      });
    }

    setIsAdditiveModalOpen(false);
    setEditingAdditiveId(null);
  };

  const handleOpenEditAdditive = (ad: AdditiveWeightRecord) => {
    setEditingAdditiveId(ad.id);
    setAdditiveForm({
      productName: ad.productName,
      additiveName: ad.additiveName,
      batchNumber: ad.batchNumber,
      time: ad.time,
      actualWeight_gm: ad.actualWeight_gm.toString(),
      standardLimit_gm: ad.standardLimit_gm.toString(),
      correctiveAction: ad.correctiveAction || '',
      verifiedBy: ad.verifiedBy || 'م. محمد سيف الإسلام'
    });
    setIsAdditiveModalOpen(true);
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseFloat(weightForm.doughWeight) || 0;
    const dMin = parseFloat(weightForm.doughWeightMin) || 0;
    const dMax = parseFloat(weightForm.doughWeightMax) || 0;
    const b = parseFloat(weightForm.bakedWeight) || 0;
    const bMin = parseFloat(weightForm.bakedWeightMin) || 0;
    const bMax = parseFloat(weightForm.bakedWeightMax) || 0;
    const f = parseFloat(weightForm.finishedWeight) || 0;
    const fMin = parseFloat(weightForm.finishedWeightMin) || 0;
    const fMax = parseFloat(weightForm.finishedWeightMax) || 0;

    const isCompliant = d >= dMin && d <= dMax && b >= bMin && b <= bMax && f >= fMin && f <= fMax;

    if (editingWeightId) {
      updateProductWeightSpec(editingWeightId, {
        productName: weightForm.productName,
        time: weightForm.time,
        doughWeight: d,
        doughWeightMin: dMin,
        doughWeightMax: dMax,
        bakedWeight: b,
        bakedWeightMin: bMin,
        bakedWeightMax: bMax,
        finishedWeight: f,
        finishedWeightMin: fMin,
        finishedWeightMax: fMax,
        isCompliant
      });
    } else {
      addProductWeightSpec({
        productName: weightForm.productName,
        time: weightForm.time,
        doughWeight: d,
        doughWeightMin: dMin,
        doughWeightMax: dMax,
        bakedWeight: b,
        bakedWeightMin: bMin,
        bakedWeightMax: bMax,
        finishedWeight: f,
        finishedWeightMin: fMin,
        finishedWeightMax: fMax,
        isCompliant,
        date: activeDate
      });
    }

    setIsWeightModalOpen(false);
    setEditingWeightId(null);
  };

  const handleOpenEditWeight = (spec: ProductWeightSpecRecord) => {
    setEditingWeightId(spec.id);
    setWeightForm({
      productName: spec.productName,
      time: spec.time,
      doughWeight: spec.doughWeight.toString(),
      doughWeightMin: spec.doughWeightMin.toString(),
      doughWeightMax: spec.doughWeightMax.toString(),
      bakedWeight: spec.bakedWeight.toString(),
      bakedWeightMin: spec.bakedWeightMin.toString(),
      bakedWeightMax: spec.bakedWeightMax.toString(),
      finishedWeight: spec.finishedWeight.toString(),
      finishedWeightMin: spec.finishedWeightMin.toString(),
      finishedWeightMax: spec.finishedWeightMax.toString()
    });
    setIsWeightModalOpen(true);
  };

  const filteredCoreTemps = coreTemperatures.filter(t => t.bakerySection === activeSection);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner
        title={`مراقبة درجات حرارة تسوية المنتجات والأوزان`}
        subtitle={`الحد الحرج الإلزامي لدرجة حرارة مركز المنتج: ≥ 90 °م، ومراقبة أوزان المواد المضافة والأوزان التامة`}
        docCode={activeTab === 'temp' ? 'QC-IS-FM-01-12' : activeTab === 'additives' ? 'QC-IS-FM-01-10' : 'QC-IS-FM-01-02'}
        revNo="0 / 1"
        date="01-01-2025"
      />

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('temp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'temp'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>حرارة مركز المنتج (≥ 90°C) - نماذج 10 & 27</span>
        </button>

        <button
          onClick={() => setActiveTab('additives')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'additives'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>أوزان المواد المضافة (Additives) - نموذج 26</span>
        </button>

        <button
          onClick={() => setActiveTab('weights')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'weights'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>متابعة أوزان المنتجات التامة (نماذج 23-25)</span>
        </button>
      </div>

      {/* Tab 1: Core Temperature */}
      {activeTab === 'temp' && (
        <div className="space-y-4">
          
          {/* Critical limit alert box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold text-xl shrink-0">
                ≥ {criticalLimits.coreTempMin || 90}°
              </div>
              <div>
                <div className="font-extrabold text-sm md:text-base text-emerald-300">
                  الحد الحرج الإلزامي لسلامة الغذاء: درجة حرارة مركز المنتج ≥ {criticalLimits.coreTempMin || 90} °م
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  يتم القياس الفوري فور خروج المنتجات من أفران التسوية أو القلايات بواسطة ترمومتر إلكتروني معاير
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingTempId(null);
                setTempForm({
                  productName: activeSection === 1 ? 'كرواسون ساده' : 'دونتس مفتوح',
                  time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                  machineCode: activeSection === 1 ? 'OVEN-01' : 'FRY-01',
                  coreTemperature: '93.5',
                  correctiveAction: '',
                  verifiedBy: 'م. محمد سيف الإسلام'
                });
                setIsTempModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/30 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل قياس حرارة جديد</span>
            </button>
          </div>

          {/* Temperature Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>سجل درجات حرارة مركز المنتج (مخبوزات {activeSection})</span>
              </h3>
              <span className="text-xs text-slate-500">إجمالي القياسات: {filteredCoreTemps.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">م</th>
                    <th className="p-3.5">اسم الصنف</th>
                    <th className="p-3.5">الوقت</th>
                    <th className="p-3.5">كود الماكينة</th>
                    <th className="p-3.5">حرارة مركز المنتج (°م)</th>
                    <th className="p-3.5">المطابقة (≥ 90°م)</th>
                    <th className="p-3.5">المسئول</th>
                    <th className="p-3.5">الإجراء التصحيحي</th>
                    <th className="p-3.5">المتحقق</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {filteredCoreTemps.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono">{rec.sn}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{rec.productName}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{rec.time}</td>
                      <td className="p-3.5 font-mono text-xs font-semibold">{rec.machineCode}</td>
                      <td className="p-3.5">
                        <span className={`font-extrabold text-sm ${rec.isCompliant ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {rec.coreTemperature} °م
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold ${
                          rec.isCompliant
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                        }`}>
                          {rec.isCompliant ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          <span>{rec.isCompliant ? 'مطابق (√)' : 'غير مطابق (×)'}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{rec.responsiblePerson}</td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{rec.correctiveAction || '-'}</td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{rec.verifiedBy || '-'}</td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditTemp(rec)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تعديل السجل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCoreTemperature(rec.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCoreTemps.length === 0 && (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                        لا توجد قياسات حرارة مسجلة بعد لهذا القسم.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Food Additives */}
      {activeTab === 'additives' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="font-extrabold text-sm md:text-base text-blue-300">
                مراقبة أوزان المواد المضافة (Critical Limits طبقاً لقانون المواد المضافة)
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                التحقق من نسب الإضافة الدقيقة: E330 ملح ليمون (0.67 جم/كجم) | Cotton Candy 120 (2 جم/كجم) | E133 (3.3 جم/كجم) | E122 (1.5 جم/كجم)
              </p>
            </div>

            <button
              onClick={() => {
                setEditingAdditiveId(null);
                setAdditiveForm({
                  productName: 'بغاشة',
                  additiveName: 'ملح ليمون E330 (0.67 جم / كجم)',
                  batchNumber: `LOT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-01`,
                  time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                  actualWeight_gm: '0.67',
                  standardLimit_gm: '0.67',
                  correctiveAction: '',
                  verifiedBy: 'م. محمد سيف الإسلام'
                });
                setIsAdditiveModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/30 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل وزن مادة مضافة</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">م</th>
                    <th className="p-3.5">اسم المنتج</th>
                    <th className="p-3.5">اسم المادة المضافة</th>
                    <th className="p-3.5">رقم التشغيلة</th>
                    <th className="p-3.5">الوقت</th>
                    <th className="p-3.5">الوزن الفعلي (جم)</th>
                    <th className="p-3.5">الحد القياسي (جم)</th>
                    <th className="p-3.5">المطابقة</th>
                    <th className="p-3.5">المسئول</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {additiveWeights.map((ad) => (
                    <tr key={ad.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono">{ad.sn}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{ad.productName}</td>
                      <td className="p-3.5 text-blue-600 dark:text-blue-400 font-semibold">{ad.additiveName}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{ad.batchNumber}</td>
                      <td className="p-3.5 font-mono">{ad.time}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{ad.actualWeight_gm} جم</td>
                      <td className="p-3.5 text-slate-500">{ad.standardLimit_gm} جم</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold ${
                          ad.isCompliant
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                        }`}>
                          {ad.isCompliant ? '✓ مطابق' : '✕ غير مطابق'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{ad.responsiblePerson}</td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditAdditive(ad)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تعديل السجل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAdditiveWeightRecord(ad.id)}
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

      {/* Tab 3: Finished Products Weights Specs */}
      {activeTab === 'weights' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                متابعة أوزان منتجات قسم المخبوزات (عجين - بعد التسوية - بعد الفنش)
              </h3>
              <p className="text-xs text-slate-500">
                مقارنة الوزن المقاس بالمواصفة القياسية الدنيا والقصوى المعتمدة
              </p>
            </div>
            <button
              onClick={() => {
                setEditingWeightId(null);
                setWeightForm({
                  productName: 'دونتس مفتوح ميجا (شيكولاتة)',
                  time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                  doughWeight: '80',
                  doughWeightMin: '75',
                  doughWeightMax: '85',
                  bakedWeight: '90',
                  bakedWeightMin: '85',
                  bakedWeightMax: '95',
                  finishedWeight: '112',
                  finishedWeightMin: '105',
                  finishedWeightMax: '120'
                });
                setIsWeightModalOpen(true);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل وزن منتج</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {productWeightSpecs.map((spec) => (
              <div key={spec.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative group">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {spec.productName}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{spec.time}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-500">وزن قطع العجين:</span>
                    <div className="text-right">
                      <strong className="text-slate-900 dark:text-white">{spec.doughWeight} جم</strong>
                      <div className="text-[10px] text-slate-400 font-mono">({spec.doughWeightMin} : {spec.doughWeightMax})</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-500">وزن بعد التسوية:</span>
                    <div className="text-right">
                      <strong className="text-slate-900 dark:text-white">{spec.bakedWeight} جم</strong>
                      <div className="text-[10px] text-slate-400 font-mono">({spec.bakedWeightMin} : {spec.bakedWeightMax})</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-500">وزن بعد الفنش/الحشو:</span>
                    <div className="text-right">
                      <strong className="text-rose-600 font-bold">{spec.finishedWeight} جم</strong>
                      <div className="text-[10px] text-slate-400 font-mono">({spec.finishedWeightMin} : {spec.finishedWeightMax})</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                    spec.isCompliant ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {spec.isCompliant ? '✓ مطابق للأوزان القياسية' : '✕ انحراف عن الوزن'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditWeight(spec)}
                      className="text-blue-600 hover:bg-blue-50 p-1 rounded-lg"
                      title="تعديل السجل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProductWeightSpec(spec.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                      title="حذف السجل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Core Temp Record */}
      {isTempModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {editingTempId ? 'تعديل تسجيل درجة حرارة مركز المنتج' : 'تسجيل درجة حرارة مركز المنتج'}
                  </h3>
                  <p className="text-xs text-slate-500">الحد الحرج الإلزامي ≥ {criticalLimits.coreTempMin || 90} °م</p>
                </div>
              </div>
              <button onClick={() => { setIsTempModalOpen(false); setEditingTempId(null); }} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSaveTemp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم الصنف</label>
                <input
                  type="text"
                  required
                  value={tempForm.productName}
                  onChange={(e) => setTempForm({ ...tempForm, productName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">الوقت</label>
                  <input
                    type="text"
                    required
                    value={tempForm.time}
                    onChange={(e) => setTempForm({ ...tempForm, time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">كود الماكينة / الفرن</label>
                  <input
                    type="text"
                    required
                    value={tempForm.machineCode}
                    onChange={(e) => setTempForm({ ...tempForm, machineCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-emerald-600 dark:text-emerald-400 text-sm">
                  درجة حرارة مركز المنتج بعد التسوية (°م)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="مثال: 94.5"
                  value={tempForm.coreTemperature}
                  onChange={(e) => setTempForm({ ...tempForm, coreTemperature: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-emerald-500 rounded-xl p-3 text-lg font-black text-slate-900 dark:text-white"
                />
              </div>

              {parseFloat(tempForm.coreTemperature) < (criticalLimits.coreTempMin || 90) && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950 border border-rose-200 rounded-xl text-rose-700 dark:text-rose-300">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>تحذير: درجة الحرارة أقل من الحد الحرج ({criticalLimits.coreTempMin || 90}°م)!</span>
                  </div>
                  <label className="block font-semibold mb-1">الإجراء التصحيحي الفوري المطلوب:</label>
                  <input
                    type="text"
                    required
                    placeholder="سبب الانحراف والإجراء المتخذ..."
                    value={tempForm.correctiveAction}
                    onChange={(e) => setTempForm({ ...tempForm, correctiveAction: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-rose-300 rounded-lg p-2 text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setIsTempModalOpen(false); setEditingTempId(null); }}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingTempId ? 'تحديث وتعديل القياس' : 'حفظ القياس'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Additive Record */}
      {isAdditiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingAdditiveId ? 'تعديل تسجيل مادة مضافة' : 'تسجيل وزن مادة مضافة'}
              </h3>
              <button onClick={() => { setIsAdditiveModalOpen(false); setEditingAdditiveId(null); }} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSaveAdditive} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={additiveForm.productName}
                  onChange={(e) => setAdditiveForm({ ...additiveForm, productName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">المادة المضافة والمعيار</label>
                <select
                  value={additiveForm.additiveName}
                  onChange={(e) => {
                    const val = e.target.value;
                    let std = '0.67';
                    if (val.includes('Cotton')) std = '2.0';
                    if (val.includes('أزرق')) std = '3.3';
                    if (val.includes('كارموازين')) std = '1.5';
                    setAdditiveForm({ ...additiveForm, additiveName: val, standardLimit_gm: std, actualWeight_gm: std });
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                >
                  <option value="ملح ليمون E330 (0.67 جم / كجم)">ملح ليمون E330 (0.67 جم / كجم)</option>
                  <option value="اسانس Cotton Candy 120 (2 جم / كجم)">اسانس Cotton Candy 120 (2 جم / كجم)</option>
                  <option value="لون أزرق E133 FD&C Blue 1 lake (3.3 جم / كجم)">لون أزرق E133 FD&C Blue 1 lake (3.3 جم / كجم)</option>
                  <option value="أحمر كارموازين 610 - E122 (1.5 جم / كجم)">أحمر كارموازين 610 - E122 (1.5 جم / كجم)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">الوزن الفعلي (جم)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={additiveForm.actualWeight_gm}
                    onChange={(e) => setAdditiveForm({ ...additiveForm, actualWeight_gm: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">الحد الأقصى القياسي (جم)</label>
                  <input
                    type="number"
                    readOnly
                    value={additiveForm.standardLimit_gm}
                    className="w-full bg-slate-100 dark:bg-slate-800 border rounded-xl p-2.5 text-slate-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setIsAdditiveModalOpen(false); setEditingAdditiveId(null); }}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingAdditiveId ? 'تحديث السجل' : 'حفظ الوزن'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Weight Spec Record */}
      {isWeightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingWeightId ? 'تعديل تسجيل أوزان منتج' : 'تسجيل متابعة أوزان منتج'}
              </h3>
              <button onClick={() => { setIsWeightModalOpen(false); setEditingWeightId(null); }} className="text-slate-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={weightForm.productName}
                  onChange={(e) => setWeightForm({ ...weightForm, productName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-1">وزن العجين (جم)</label>
                  <input
                    type="number"
                    required
                    value={weightForm.doughWeight}
                    onChange={(e) => setWeightForm({ ...weightForm, doughWeight: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">وزن التسوية (جم)</label>
                  <input
                    type="number"
                    required
                    value={weightForm.bakedWeight}
                    onChange={(e) => setWeightForm({ ...weightForm, bakedWeight: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">وزن الفنش (جم)</label>
                  <input
                    type="number"
                    required
                    value={weightForm.finishedWeight}
                    onChange={(e) => setWeightForm({ ...weightForm, finishedWeight: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2 font-bold text-rose-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setIsWeightModalOpen(false); setEditingWeightId(null); }}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingWeightId ? 'تحديث السجل' : 'حفظ الأوزان'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
