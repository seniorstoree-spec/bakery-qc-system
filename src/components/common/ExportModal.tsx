import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, Printer, Database, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { 
    operatingParams, 
    defectLogs, 
    coreTemperatures, 
    metalDetectorLogs, 
    electricSieveLogs, 
    additiveWeights, 
    sensoryEvaluations, 
    nonConformanceLogs, 
    releaseFormB1, 
    releaseFormB2, 
    exportDataJSON, 
    importDataJSON,
    resetAllData
  } = useApp();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export full Excel workbook with all sheets
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Defect logs
    const defectsData = defectLogs.map(d => ({
      'اسم المنتج': d.productName,
      'القسم': d.bakerySection === 1 ? 'مخبوزات 1' : 'مخبوزات 2',
      'المرحلة': d.stage === 'start' ? 'بداية التشغيل' : d.stage === 'mid' ? 'منتصف التشغيل' : d.stage === 'end' ? 'نهاية التشغيل' : 'غير مخططة',
      'الوقت': d.time,
      'كمية الإنتاج المطلوبة': d.requiredProductionQty,
      'حجم العينة': d.sampleSize,
      'حجم زائد': d.oversize,
      'حجم أقل': d.undersize,
      'وزن زيادة': d.overweight,
      'وزن أقل': d.underweight,
      'لون داكن': d.darkColor,
      'لون فاتح': d.lightColor,
      'أجزاء محروقة': d.burntParts,
      'منتج هابط': d.deflatedProduct,
      'فراغات بالقطع': d.gapsInPieces,
      'منتج ناشف': d.dryProduct,
      'منتج معجن': d.doughyProduct,
      'غير مورق': d.nonLaminated,
      'خروج حشو': d.fillingLeakage,
      'حشو زائد': d.excessFilling,
      'حشو أقل': d.insufficientFilling,
      'تلميع زائد': d.excessGlaze,
      'بقع على السطح': d.surfaceSpots,
      'شوائب ومواد غريبة': d.foreignMatters,
      'تاريخ الصلاحية': d.expiryDateDefect,
      'عيوب اللحام': d.sealingDefect,
      'عيوب الطباعة': d.printingDefect,
      'رائحة غير مرغوبة': d.undesiredSmell,
      'الحالة': d.status === 'compliant' ? 'مطابق' : d.status === 'warning' ? 'تحذير' : 'غير مطابق'
    }));
    const wsDefects = XLSX.utils.json_to_sheet(defectsData);
    XLSX.utils.book_append_sheet(wb, wsDefects, 'تقرير عيوب الجودة');

    // Sheet 2: Core Temperature
    const tempData = coreTemperatures.map(t => ({
      'م': t.sn,
      'اسم الصنف': t.productName,
      'القسم': t.bakerySection === 1 ? 'مخبوزات 1' : 'مخبوزات 2',
      'الوقت': t.time,
      'كود الماكينة': t.machineCode,
      'حرارة المركز (°م)': t.coreTemperature,
      'المطابقة (>=90°C)': t.isCompliant ? 'مطابق' : 'غير مطابق',
      'المسؤول': t.responsiblePerson,
      'الإجراء التصحيحي': t.correctiveAction || '-',
      'المتحقق': t.verifiedBy || '-',
      'التاريخ': t.date
    }));
    const wsTemp = XLSX.utils.json_to_sheet(tempData);
    XLSX.utils.book_append_sheet(wb, wsTemp, 'مراقبة حرارة التسوية');

    // Sheet 3: Metal Detector CCP
    const mdData = metalDetectorLogs.map(m => ({
      'م': m.sn,
      'الوقت': m.time,
      'كود الماكينة': m.machineCode,
      'Fe (2.5mm)': m.feStatus === 'pass' ? 'مطابق (√)' : 'غير مطابق (×)',
      'NFe (3.0mm)': m.nfeStatus === 'pass' ? 'مطابق (√)' : 'غير مطابق (×)',
      'S.S (3.5mm)': m.ssStatus === 'pass' ? 'مطابق (√)' : 'غير مطابق (×)',
      'الحالة الإجمالية': m.isCompliant ? 'مطابق' : 'غير مطابق',
      'المسؤول': m.responsiblePerson,
      'المتحقق': m.verifiedBy || '-',
      'التاريخ': m.date
    }));
    const wsMd = XLSX.utils.json_to_sheet(mdData);
    XLSX.utils.book_append_sheet(wb, wsMd, 'كاشف المعادن CCP');

    // Sheet 4: Sensory Evaluation
    const sensoryData = sensoryEvaluations.map(s => ({
      'م': s.sn,
      'اسم الصنف': s.productName,
      'نوع العينة': s.sampleType === 'daily_product' ? 'منتج يومي' : 'عينة جديدة',
      'صيامي': s.isVegan ? 'نعم' : 'لا',
      'الوقت': s.time,
      'رقم العينة': s.sampleNumber,
      'اللون (1-10)': s.colorScore,
      'الطعم (1-10)': s.tasteScore,
      'الرائحة (1-10)': s.aromaScore,
      'القوام (1-10)': s.textureScore,
      'الإنطباع العام': s.overallImpressionScore,
      'التقييم العام': s.overallRating,
      'الفاحص': s.inspectorName,
      'رئيس التقييم الحسي': s.headOfSensoryName,
      'الملاحظات': s.notes || '-'
    }));
    const wsSensory = XLSX.utils.json_to_sheet(sensoryData);
    XLSX.utils.book_append_sheet(wb, wsSensory, 'التقييم الحسي للأغذية');

    // Sheet 5: Additives
    const additivesData = additiveWeights.map(a => ({
      'م': a.sn,
      'اسم المنتج': a.productName,
      'المادة المضافة': a.additiveName,
      'رقم التشغيلة': a.batchNumber,
      'الوزن الفعلي (جم)': a.actualWeight_gm,
      'الحد القياسي (جم)': a.standardLimit_gm,
      'المطابقة': a.isCompliant ? 'مطابق' : 'غير مطابق',
      'المسؤول': a.responsiblePerson
    }));
    const wsAdditives = XLSX.utils.json_to_sheet(additivesData);
    XLSX.utils.book_append_sheet(wb, wsAdditives, 'أوزان المواد المضافة');

    // Generate Excel file
    XLSX.writeFile(wb, `تقرير_الجودة_اليومي_شركة_العبد_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Download JSON backup
  const handleDownloadJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `نسخة_احتياطية_الجودة_العبد_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle JSON file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportStatus('تم استعادة البيانات بنجاح!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('حدث خطأ أثناء قراءة الملف، تأكد من صحة التنسيق');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                تصدير وطباعة تقارير الجودة الرسمية
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تصدير مصفوفة البيانات بصيغ Excel و PDF والطباعة المباشرة والنسخ الاحتياطي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl"
          >
            ✕
          </button>
        </div>

        {importStatus && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {/* Excel Export */}
          <button
            onClick={handleExportExcel}
            className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/60 transition-all text-right group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                تصدير مصنف إكسيل شامل (Excel)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                يشمل أوراق عمل منفصلة لكافة النماذج والعيوب والحرارة وكواشف المعادن
              </p>
            </div>
          </button>

          {/* Browser Print */}
          <button
            onClick={() => {
              window.print();
            }}
            className="p-4 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-950/60 transition-all text-right group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                طباعة التقرير الفوري (Print / PDF)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                تنسيق طباعة رسمي مصمم للمصانع والاعتمادات الورقية
              </p>
            </div>
          </button>

          {/* JSON Backup Download */}
          <button
            onClick={handleDownloadJSON}
            className="p-4 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-950/60 transition-all text-right group flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                تحميل نسخة احتياطية (JSON Backup)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                حفظ كافة التسجيلات والمعايير على جهازك لاستعادتها لاحقاً
              </p>
            </div>
          </button>

          {/* Restore JSON Backup */}
          <label className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100/60 dark:hover:bg-amber-950/60 transition-all text-right group flex items-start gap-3 cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                استعادة نسخة احتياطية (Import JSON)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                استيراد ملف JSON محفوظ مسبقاً وتحديث السجلات
              </p>
            </div>
          </label>
        </div>

        {/* Reset Database */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('هل أنت متأكد من إعادة ضبط البيانات إلى الحالة الافتراضية للوثيقة؟')) {
                resetAllData();
                setImportStatus('تمت إعادة ضبط البيانات إلى الأصل بنجاح!');
                setTimeout(() => setImportStatus(null), 3000);
              }
            }}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
          >
            إعادة تعيين البيانات الافتراضية للملف
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
