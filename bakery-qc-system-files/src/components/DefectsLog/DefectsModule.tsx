import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DefectItemRow, ProductionStage } from '../../types';
import { HeaderBanner } from '../common/HeaderBanner';
import { 
  ClipboardCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const BAKERY_1_PRODUCTS = [
  'كرواسون ساده ميجا',
  'كرواسون جبنه بيضاء ميجا',
  'كرواسون شيكوالتة ميجا',
  'باتيه جبنة بيضاء هالوبينو',
  'باتيه جبنه بيضاء ميجا',
  'باتيه جبنه رومي ميجا',
  'بيتزا إيطالي ميجا',
  'دانش فواكه ميجا',
  'دانش كريمه ميجا',
  'دانش سكر ميجا',
  'دانش كريمة دايموند',
  'دانش فواكه وكريمة ميجا',
  'دانش شوكوالتة بندق ميجا',
  'بغاشة ميجا',
  'كرواسون كيندر',
  'كرواسون فيلد لوز',
  'كرواسون جبنه رومي',
  'كرواسون شوكولاته وكريمة تويست',
  'كرواسون لبنة زعتر',
  'كرواسون شيدر',
  'كرواسون شيكوالته بندق',
  'كرواسون سموك بيف',
  'كرواسون بسطرمة كيرى',
  'كرواسون تركى',
  'باتيه كيري بسطرمه',
  'آبل بــــاي',
  'منقوشة لبنة زعتر',
  'منقوشة تركي كيري',
  'منقوشة سجق',
  'منقوشة ايطالي',
  'منقوشة بيبروني',
  'منقوشة فراخ كريسبي',
  'باتيه صيامي سادة',
  'باتيه صيامي شيكوالتة',
  'دانش فواكه صيامي'
];

const BAKERY_2_PRODUCTS = [
  'ساندويتش فاهيتا فراخ',
  'ساندويتش فاهيتا لحمه',
  'ساندويتش بسطرمه بالجبنه الشيدر',
  'ساندويتش سوسيس',
  'ساندويتش جبنه بالفلفل والزيتون',
  'ساندويتش تونة بالمستردة',
  'ميني ساندويتش',
  'سينامون كالسيك',
  'سينامون شيكوالتة',
  'سينامون كراميل',
  'سينامون تراميسيو',
  'دونتس مفتوح ميجا شيكوالتة',
  'دونتس مفتوح ميجا ابيض سبرينكلز',
  'دونتس مفتوح ميجا شيكوالتة سبرينكلز',
  'دونتس فيلد ميجا شيكوالتة',
  'دونتس شكوالته بندق',
  'دونتس بينك',
  'دونتس كوتن كاندى',
  'دونتس فيلد فسدق',
  'دونتس فيلد كوكيز اند كريم',
  'دونتس فيلد عجينه بندق',
  'دونتس فيلد لوتس',
  'دونتس فيلد كوكيز',
  'دونتس فيلد ترند دبي',
  'دونتس فيلد كيندر',
  'دونتس فيلد تشيز كيك راسبيري',
  'دونتس فيلد تشيز ريد فيلفيت',
  'دونتس شيكوالته ميجا ( صيامي )'
];

export const DefectsModule: React.FC = () => {
  const { 
    activeSection, 
    defectLogs, 
    addDefectLog, 
    updateDefectLog, 
    deleteDefectLog, 
    currentUser,
    activeDate 
  } = useApp();

  const [activeStageFilter, setActiveStageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const productList = activeSection === 1 ? BAKERY_1_PRODUCTS : BAKERY_2_PRODUCTS;

  // New Defect Entry Form state
  const [formData, setFormData] = useState<Omit<DefectItemRow, 'id' | 'status' | 'criticalDeviation'>>({
    productName: productList[0],
    bakerySection: activeSection,
    stage: 'start',
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    requiredProductionQty: 3000,
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

  // Calculate compliance status automatically based on the document limits
  const evaluateStatus = (data: typeof formData): { status: 'compliant' | 'warning' | 'non_compliant'; isCritical: boolean } => {
    const sample = data.sampleSize || 100;
    
    // Critical 0% defects
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

    // 3% max limit defects
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

    // 5% max limit defects
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

    // Warning if near limit
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

  const handleSaveDefect = (e: React.FormEvent) => {
    e.preventDefault();
    const evaluation = evaluateStatus(formData);
    addDefectLog({
      ...formData,
      status: evaluation.status,
      criticalDeviation: evaluation.isCritical
    });
    setIsNewModalOpen(false);
  };

  const filteredLogs = defectLogs
    .filter(l => l.bakerySection === activeSection)
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

      {/* Control Bar: Filters & Actions */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search & Stage Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
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
            setFormData({
              ...formData,
              productName: productList[0],
              bakerySection: activeSection,
              time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
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
                <th className="p-3.5 text-center">تفاصيل</th>
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
                      <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400">{stageLabels[log.stage]}</td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{log.time}</td>
                      <td className="p-3.5">
                        <span className="font-semibold">{log.requiredProductionQty}</span> / <span className="font-bold text-rose-600">{log.sampleSize}</span>
                      </td>
                      <td className="p-3.5">
                        <span>زيادة: {log.oversize + log.overweight}</span> | <span>نقص: {log.undersize + log.underweight}</span>
                      </td>
                      <td className="p-3.5">
                        <span>لون: {log.darkColor + log.lightColor}</span> | <span>هابط/فراغ: {log.deflatedProduct + log.gapsInPieces}</span>
                      </td>
                      <td className="p-3.5">
                        <span>تسريب: {log.fillingLeakage}</span> | <span>تلميع: {log.excessGlaze + log.insufficientGlaze}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${zeroDefectsCount === 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
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
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setExpandedRowId(isExpanded ? null : log.id)}
                            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="عرض التفاصيل الكاملة"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteDefectLog(log.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
                              <span className="text-slate-400">منتج ناشف / معجن:</span>
                              <div className="font-bold mt-0.5">{log.dryProduct} / {log.doughyProduct}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">خروج حشو / زائد:</span>
                              <div className="font-bold mt-0.5">{log.fillingLeakage} / {log.excessFilling}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">تلميع زائد / أقل:</span>
                              <div className="font-bold mt-0.5">{log.excessGlaze} / {log.insufficientGlaze}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">بقع / تقشير سطح:</span>
                              <div className="font-bold mt-0.5">{log.surfaceSpots} / {log.surfacePeeling}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">شوائب ومواد غريبة:</span>
                              <div className={`font-bold mt-0.5 ${log.foreignMatters > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{log.foreignMatters}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">لحام / طباعة:</span>
                              <div className="font-bold mt-0.5">{log.sealingDefect} / {log.printingDefect}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border">
                              <span className="text-slate-400">رائحة غير مرغوبة:</span>
                              <div className={`font-bold mt-0.5 ${log.undesiredSmell > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{log.undesiredSmell}</div>
                            </div>
                          </div>

                          {log.notes && (
                            <div className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border">
                              <strong className="text-slate-900 dark:text-white">ملاحظات:</strong> {log.notes}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                    لا توجد تسجيلات عيوب مطابقة للشروط المحددة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Fast Touch Defect Entry */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    تسجيل فحص عيوب جديد (تقرير الجودة اليومي)
                  </h3>
                  <p className="text-xs text-slate-500">
                    واجهة لمسية سريعة لفحص العينات والتحقق من الحدود الحرجة (قسم {activeSection})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDefect} className="p-5 overflow-y-auto space-y-5 custom-scrollbar text-xs">
              
              {/* Header selection: Product, Stage, Time, Quantities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الصنف</label>
                  <select
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-bold"
                  >
                    {productList.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">مرحلة التشغيل</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-bold"
                  >
                    <option value="start">بداية التشغيل</option>
                    <option value="mid">منتصف التشغيل</option>
                    <option value="end">نهاية التشغيل</option>
                    <option value="unplanned">غير مخططة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الوقت</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">حجم العينة (قطعة)</label>
                  <input
                    type="number"
                    required
                    value={formData.sampleSize}
                    onChange={(e) => setFormData({ ...formData, sampleSize: parseInt(e.target.value) || 100 })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-bold text-rose-600"
                  />
                </div>
              </div>

              {/* Categorized Defect Counters with Steppers */}
              
              {/* Category 1: Volume & Weight (Limit <= 5%) */}
              <div className="space-y-2">
                <div className="font-extrabold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                  <span>1. حجم القطع والأوزان (حد المسموح حتى 5%)</span>
                  <span className="text-[10px] text-slate-400 font-normal">أقصى حد: {(formData.sampleSize * 0.05)} قطع</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'oversize', label: 'حجم زائد' },
                    { key: 'undersize', label: 'حجم أقل' },
                    { key: 'overweight', label: 'وزن زيادة' },
                    { key: 'underweight', label: 'وزن أقل' },
                  ].map((item) => (
                    <div key={item.key} className="p-3 rounded-xl border bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, [item.key]: Math.max(0, (formData as any)[item.key] - 1) })}
                          className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-slate-900 dark:text-white">
                          {(formData as any)[item.key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, [item.key]: (formData as any)[item.key] + 1 })}
                          className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 2: Baking & Texture (Color <= 5%, Burnt 0%, Texture <= 3%) */}
              <div className="space-y-2">
                <div className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                  <span>2. التسوية والنسيج الداخلي (لون ≤ 5%، محروق صفر%، نسيج ≤ 3%)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'darkColor', label: 'لون داكن (≤5%)' },
                    { key: 'lightColor', label: 'لون فاتح (≤5%)' },
                    { key: 'burntParts', label: 'أجزاء محروقة (0%)', isCritical: true },
                    { key: 'deflatedProduct', label: 'منتج هابط (≤3%)' },
                    { key: 'gapsInPieces', label: 'فراغات بالقطع (≤3%)' },
                    { key: 'dryProduct', label: 'منتج ناشف (≤3%)' },
                    { key: 'doughyProduct', label: 'منتج معجن (≤3%)' },
                    { key: 'nonLaminated', label: 'غير مورق (0%)', isCritical: true },
                  ].map((item) => (
                    <div key={item.key} className={`p-3 rounded-xl border flex items-center justify-between ${item.isCritical ? 'bg-rose-50/40 border-rose-200 dark:bg-rose-950/20' : 'bg-slate-50/50 dark:bg-slate-800/40'}`}>
                      <span className={`font-medium ${item.isCritical ? 'text-rose-700 dark:text-rose-300 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, [item.key]: Math.max(0, (formData as any)[item.key] - 1) })}
                          className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-slate-900 dark:text-white">
                          {(formData as any)[item.key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, [item.key]: (formData as any)[item.key] + 1 })}
                          className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center ${item.isCritical ? 'bg-rose-600 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-700'}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 3: Filling & Glaze */}
              <div className="space-y-2">
                <div className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span>3. الحشو والتلميع والمظهر الخارجي (≤ 3% و ≤ 5%، شوائب 0%)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'fillingLeakage', label: 'خروج حشو (≤3%)' },
                    { key: 'excessFilling', label: 'حشو زائد (≤3%)' },
                    { key: 'insufficientFilling', label: 'حشو أقل (≤3%)' },
                    { key: 'noFilling', label: 'بدون حشو (0%)', isCritical: true },
                    { key: 'excessGlaze', label: 'تلميع زائد (≤5%)' },
                    { key: 'insufficientGlaze', label: 'تلميع أقل (≤5%)' },
                    { key: 'surfaceSpots', label: 'بقع على السطح (≤3%)' },
                    { key: 'foreignMatters', label: 'شوائب / مواد غريبة (0%)', isCritical: true },
                  ].map((item) => (
                    <div key={item.key} className={`p-3 rounded-xl border flex items-center justify-between ${item.isCritical ? 'bg-rose-50/40 border-rose-200 dark:bg-rose-950/20' : 'bg-slate-50/50 dark:bg-slate-800/40'}`}>
                      <span className={`font-medium ${item.isCritical ? 'text-rose-700 dark:text-rose-300 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, [item.key]: Math.max(0, (formData as any)[item.key] - 1) })}
                          className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-slate-900 dark:text-white">
                          {(formData as any)[item.key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, [item.key]: (formData as any)[item.key] + 1 })}
                          className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center ${item.isCritical ? 'bg-rose-600 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-700'}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ملاحظات الجودة والإجراءات</label>
                <input
                  type="text"
                  placeholder="أي ملاحظات تفصيلية حول خط الإنتاج..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اعتماد وتسجيل الفحص</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
