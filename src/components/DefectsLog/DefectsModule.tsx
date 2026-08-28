import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DefectItemRow, ProductionStage } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { 
  ClipboardCheck, 
  Plus, 
  Trash2, 
  Edit2,
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Check
} from 'lucide-react';

export const DefectsModule: React.FC = () => {
  const { activeSection, defectLogs, addDefectLog, updateDefectLog, deleteDefectLog, recipesList } = useApp();

  const [activeStageFilter, setActiveStageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  const productList = recipesList
    .filter(r => !r.sectionId || Number(r.sectionId) === Number(activeSection))
    .map(r => r.productName);

  const defaultProductName = productList[0] || (activeSection === 1 ? 'كرواسون ساده ميجا' : 'دونتس مفتوح ميجا شيكولاتة');

  const [formData, setFormData] = useState<Omit<DefectItemRow, 'id' | 'status' | 'criticalDeviation'>>({
    productName: defaultProductName,
    bakerySection: activeSection,
    stage: 'start',
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    requiredProductionQty: 5000,
    sampleSize: 100,
    oversize: 0,
    undersize: 0,
    overweight: 0,
    underweight: 0,
    darkColor: 0,
    lightColor: 0,
    burntParts: 0,
    deflatedProduct: 0,
    gapsInPieces: 0,
    dryProduct: 0,
    doughyProduct: 0,
    nonLaminated: 0,
    bitterTaste: 0,
    rancidTaste: 0,
    fillingLeakage: 0,
    excessFilling: 0,
    insufficientFilling: 0,
    noFilling: 0,
    heavyTexture: 0,
    lightTexture: 0,
    excessGlaze: 0,
    insufficientGlaze: 0,
    surfaceSpots: 0,
    surfacePeeling: 0,
    surfaceCracks: 0,
    foreignMatters: 0,
    expiryDateDefect: 0,
    sealingDefect: 0,
    printingDefect: 0,
    undesiredSmell: 0,
    notes: ''
  });

  const evaluateStatus = (data: typeof formData): { status: 'compliant' | 'warning' | 'non_compliant'; isCritical: boolean } => {
    const sample = data.sampleSize || 100;
    
    const criticalZeroDefects = 
      data.burntParts > 0 ||
      data.nonLaminated > 0 ||
      data.bitterTaste > 0 ||
      data.rancidTaste > 0 ||
      data.noFilling > 0 ||
      data.foreignMatters > 0 ||
      data.expiryDateDefect > 0 ||
      data.undesiredSmell > 0;

    if (criticalZeroDefects) {
      return { status: 'non_compliant', isCritical: true };
    }

    const threePctExceeded = 
      (data.deflatedProduct / sample) * 100 > 3 ||
      (data.gapsInPieces / sample) * 100 > 3 ||
      (data.dryProduct / sample) * 100 > 3 ||
      (data.doughyProduct / sample) * 100 > 3 ||
      (data.fillingLeakage / sample) * 100 > 3 ||
      (data.excessFilling / sample) * 100 > 3 ||
      (data.insufficientFilling / sample) * 100 > 3 ||
      (data.heavyTexture / sample) * 100 > 3 ||
      (data.lightTexture / sample) * 100 > 3 ||
      (data.surfaceSpots / sample) * 100 > 3 ||
      (data.surfacePeeling / sample) * 100 > 3 ||
      (data.surfaceCracks / sample) * 100 > 3 ||
      (data.sealingDefect / sample) * 100 > 3 ||
      (data.printingDefect / sample) * 100 > 3;

    const fivePctExceeded = 
      (data.oversize / sample) * 100 > 5 ||
      (data.undersize / sample) * 100 > 5 ||
      (data.overweight / sample) * 100 > 5 ||
      (data.underweight / sample) * 100 > 5 ||
      (data.darkColor / sample) * 100 > 5 ||
      (data.lightColor / sample) * 100 > 5 ||
      (data.excessGlaze / sample) * 100 > 5 ||
      (data.insufficientGlaze / sample) * 100 > 5;

    if (threePctExceeded || fivePctExceeded) {
      return { status: 'non_compliant', isCritical: false };
    }

    const isNearLimit = 
      (data.oversize / sample) * 100 >= 4 ||
      (data.undersize / sample) * 100 >= 4 ||
      (data.darkColor / sample) * 100 >= 4 ||
      (data.deflatedProduct / sample) * 100 >= 2.5;

    if (isNearLimit) {
      return { status: 'warning', isCritical: false };
    }

    return { status: 'compliant', isCritical: false };
  };

  const handleSaveDefect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const evaluation = evaluateStatus(formData);

    if (editingLogId) {
      updateDefectLog(editingLogId, {
        ...formData,
        bakerySection: activeSection,
        status: evaluation.status,
        criticalDeviation: evaluation.isCritical
      });
      setEditingLogId(null);
    } else {
      addDefectLog({
        ...formData,
        bakerySection: activeSection,
        status: evaluation.status,
        criticalDeviation: evaluation.isCritical
      });
    }

    setIsNewModalOpen(false);
  };

  const handleOpenEditDefect = (log: DefectItemRow) => {
    setEditingLogId(log.id);
    setFormData({
      productName: log.productName,
      bakerySection: log.bakerySection,
      stage: log.stage,
      time: log.time,
      requiredProductionQty: log.requiredProductionQty,
      sampleSize: log.sampleSize,
      oversize: log.oversize,
      undersize: log.undersize,
      overweight: log.overweight,
      underweight: log.underweight,
      darkColor: log.darkColor,
      lightColor: log.lightColor,
      burntParts: log.burntParts,
      deflatedProduct: log.deflatedProduct,
      gapsInPieces: log.gapsInPieces,
      dryProduct: log.dryProduct,
      doughyProduct: log.doughyProduct,
      nonLaminated: log.nonLaminated,
      bitterTaste: log.bitterTaste,
      rancidTaste: log.rancidTaste,
      fillingLeakage: log.fillingLeakage,
      excessFilling: log.excessFilling,
      insufficientFilling: log.insufficientFilling,
      noFilling: log.noFilling,
      heavyTexture: log.heavyTexture,
      lightTexture: log.lightTexture,
      excessGlaze: log.excessGlaze,
      insufficientGlaze: log.insufficientGlaze,
      surfaceSpots: log.surfaceSpots,
      surfacePeeling: log.surfacePeeling,
      surfaceCracks: log.surfaceCracks,
      foreignMatters: log.foreignMatters,
      expiryDateDefect: log.expiryDateDefect,
      sealingDefect: log.sealingDefect,
      printingDefect: log.printingDefect,
      undesiredSmell: log.undesiredSmell,
      notes: log.notes || ''
    });
    setIsNewModalOpen(true);
  };

  const filteredLogs = defectLogs
    .filter(l => !l.bakerySection || Number(l.bakerySection) === Number(activeSection))
    .filter(l => activeStageFilter === 'all' || l.stage === activeStageFilter)
    .filter(l => l.productName.includes(searchTerm));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner
        title={`تقرير الجودة اليومي - تسجيل عيوب الجودة ومواصفات التشغيل`}
        subtitle={`مصفوفة فحص العيوب عبر مراحل التشغيل (بداية، منتصف، نهاية، غير مخططة) - قسم المخبوزات ${activeSection}`}
        docCode="QC-IS-FM-01-03"
        revNo="2"
        date="01-05-2025"
      />

      {/* Control Bar: Filters & New Entry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs shadow-sm">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="بحث بالصنف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-slate-800 dark:text-slate-200 focus:outline-none w-36"
            />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'start', label: 'بداية التشغيل' },
              { id: 'mid', label: 'منتصف التشغيل' },
              { id: 'end', label: 'نهاية التشغيل' },
              { id: 'unplanned', label: 'غير مخططة' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveStageFilter(st.id)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeStageFilter === st.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Record Button */}
        <button
          onClick={() => {
            setEditingLogId(null);
            setFormData({
              productName: defaultProductName,
              bakerySection: activeSection,
              stage: 'start',
              time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
              requiredProductionQty: 5000,
              sampleSize: 100,
              oversize: 0,
              undersize: 0,
              overweight: 0,
              underweight: 0,
              darkColor: 0,
              lightColor: 0,
              burntParts: 0,
              deflatedProduct: 0,
              gapsInPieces: 0,
              dryProduct: 0,
              doughyProduct: 0,
              nonLaminated: 0,
              bitterTaste: 0,
              rancidTaste: 0,
              fillingLeakage: 0,
              excessFilling: 0,
              insufficientFilling: 0,
              noFilling: 0,
              heavyTexture: 0,
              lightTexture: 0,
              excessGlaze: 0,
              insufficientGlaze: 0,
              surfaceSpots: 0,
              surfacePeeling: 0,
              surfaceCracks: 0,
              foreignMatters: 0,
              expiryDateDefect: 0,
              sealingDefect: 0,
              printingDefect: 0,
              undesiredSmell: 0,
              notes: ''
            });
            setIsNewModalOpen(true);
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل فحص عيوب جديد</span>
        </button>

      </div>

      {/* Critical Limits Summary Badge Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-2">
          <span className="font-bold text-blue-700 dark:text-blue-300">حد الحجم والأوزان:</span>
          <span className="text-slate-600 dark:text-slate-400">حتى %5 (حد العينات)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
          <span className="font-bold text-amber-700 dark:text-amber-300">حد التسوية والتلميع:</span>
          <span className="text-slate-600 dark:text-slate-400">حتى %3 و %5</span>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
          <span className="font-bold text-emerald-700 dark:text-emerald-300">حد النسيج والحشو:</span>
          <span className="text-slate-600 dark:text-slate-400">حتى %3 (حد العينات)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2">
          <span className="font-bold text-rose-700 dark:text-rose-300">الحد الحرج للإفراج:</span>
          <span className="text-slate-600 dark:text-slate-400">صفر % (محروق/شوائب/روائح)</span>
        </div>
      </div>

      {/* Defects Table View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-rose-600" />
            <span>سجل فحوصات الجودة المسجلة ({filteredLogs.length})</span>
          </h3>
          <span className="text-xs text-slate-500">مخبوزات {activeSection}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">الصنف</th>
                <th className="p-3.5">المرحلة</th>
                <th className="p-3.5">الوقت</th>
                <th className="p-3.5">الكمية / العينة</th>
                <th className="p-3.5">حجم وأوزان (≤5%)</th>
                <th className="p-3.5">التسوية والنسيج (≤3%)</th>
                <th className="p-3.5">الحشو والتلميع</th>
                <th className="p-3.5">العيوب الحرجة (0%)</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات والتفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredLogs.map((log) => {
                const isExpanded = expandedRowId === log.id;
                const stageLabels: Record<ProductionStage, string> = {
                  start: 'بداية التشغيل',
                  mid: 'منتصف التشغيل',
                  end: 'نهاية التشغيل',
                  unplanned: 'غير مخططة'
                };

                const zeroDefectsCount = 
                  log.burntParts + log.nonLaminated + log.bitterTaste + 
                  log.rancidTaste + log.noFilling + log.foreignMatters + 
                  log.expiryDateDefect + log.undesiredSmell;

                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{log.productName}</td>
                      <td className="p-3.5 font-semibold text-rose-600 dark:text-rose-400">{stageLabels[log.stage]}</td>
                      <td className="p-3.5 font-mono text-slate-500">{log.time}</td>
                      <td className="p-3.5 font-mono">
                        <span>{log.requiredProductionQty} / </span>
                        <strong className="text-slate-900 dark:text-white">{log.sampleSize} عينة</strong>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-0.5 text-[11px]">
                          <div>حجم (ز/ق): {log.oversize}/{log.undersize}</div>
                          <div>وزن (ز/ق): {log.overweight}/{log.underweight}</div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-0.5 text-[11px]">
                          <div>لون (د/ف): {log.darkColor}/{log.lightColor}</div>
                          <div>نسيج/هابط: {log.deflatedProduct}</div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-0.5 text-[11px]">
                          <div>تلميع (ز/ق): {log.excessGlaze}/{log.insufficientGlaze}</div>
                          <div>حشو (تسييل): {log.fillingLeakage}</div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          zeroDefectsCount === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                        }`}>
                          {zeroDefectsCount === 0 ? '✓ صفر عيوب' : `✕ ${zeroDefectsCount} عيب حرج`}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          log.status === 'compliant'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            : log.status === 'warning'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                        }`}>
                          {log.status === 'compliant' ? 'مطابق' : log.status === 'warning' ? 'تحذير' : 'غير مطابق'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditDefect(log)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تعديل السجل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDefectLog(log.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpandedRowId(isExpanded ? null : log.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="عرض/إخفاء التفاصيل"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Detailed Expanded Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 dark:bg-slate-800/60">
                        <td colSpan={10} className="p-4 text-xs space-y-3">
                          <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                            تفاصيل فحص العيوب الكاملة - {log.productName} ({stageLabels[log.stage]})
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">حجم زائد / أقل:</span>
                              <div className="font-bold mt-0.5">{log.oversize} / {log.undersize}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">وزن زيادة / أقل:</span>
                              <div className="font-bold mt-0.5">{log.overweight} / {log.underweight}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">لون داكن / فاتح:</span>
                              <div className="font-bold mt-0.5">{log.darkColor} / {log.lightColor}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">أجزاء محروقة:</span>
                              <div className={`font-bold mt-0.5 ${log.burntParts > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{log.burntParts}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">منتج هابط / فراغات:</span>
                              <div className="font-bold mt-0.5">{log.deflatedProduct} / {log.gapsInPieces}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">تلميع غير متجانس:</span>
                              <div className="font-bold mt-0.5">{log.excessGlaze} / {log.insufficientGlaze}</div>
                            </div>
                          </div>

                          {log.notes && (
                            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300">
                              <strong className="ml-1">ملاحظات المهندس:</strong> {log.notes}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New / Edit Defect Log Form */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingLogId ? 'تعديل تقرير فحص العيوب' : 'تسجيل فحص عيوب جديد'}
              </h3>
              <button onClick={() => { setIsNewModalOpen(false); setEditingLogId(null); }} className="text-slate-400 p-1">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">اسم الصنف</label>
                  <select
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold"
                  >
                    {productList.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">مرحلة الفحص</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as ProductionStage })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold text-rose-600"
                  >
                    <option value="start">بداية التشغيل (Start)</option>
                    <option value="mid">منتصف التشغيل (Mid)</option>
                    <option value="end">نهاية التشغيل (End)</option>
                    <option value="unplanned">فحص غير مخطط (Unplanned)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">حجم العينة المفحوصة</label>
                  <input
                    type="number"
                    value={formData.sampleSize}
                    onChange={(e) => setFormData({ ...formData, sampleSize: parseInt(e.target.value) || 100 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5 font-bold font-mono"
                  />
                </div>
              </div>

              {/* Defect counters input */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white">إدخال أعداد القطع المعيبة في العينة:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">حجم زائد</label>
                    <input
                      type="number"
                      value={formData.oversize}
                      onChange={(e) => setFormData({ ...formData, oversize: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">حجم أقل</label>
                    <input
                      type="number"
                      value={formData.undersize}
                      onChange={(e) => setFormData({ ...formData, undersize: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">وزن زيادة</label>
                    <input
                      type="number"
                      value={formData.overweight}
                      onChange={(e) => setFormData({ ...formData, overweight: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">وزن أقل</label>
                    <input
                      type="number"
                      value={formData.underweight}
                      onChange={(e) => setFormData({ ...formData, underweight: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setIsNewModalOpen(false); setEditingLogId(null); }}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDefect()}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-rose-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingLogId ? 'تحديث السجل' : 'حفظ الفحص'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
