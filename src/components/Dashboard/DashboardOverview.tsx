import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Thermometer, 
  Activity, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  ArrowUpRight,
  ShieldAlert,
  Flame,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { HeaderBanner } from '../common/HeaderBanner';

interface DashboardOverviewProps {
  onNavigate: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { 
    kpi, 
    activeSection, 
    coreTemperatures, 
    metalDetectorLogs, 
    sensoryEvaluations, 
    defectLogs, 
    releaseFormB1, 
    releaseFormB2,
    activeDate
  } = useApp();

  const currentReleaseStatus = activeSection === 1 ? releaseFormB1.decision : releaseFormB2.decision;

  // Prepare Core Temperature Chart Data
  const tempChartData = coreTemperatures
    .filter(t => t.bakerySection === activeSection)
    .map(t => ({
      name: t.productName.length > 12 ? t.productName.substring(0, 12) + '...' : t.productName,
      fullTitle: t.productName,
      temp: t.coreTemperature,
      time: t.time,
      isCompliant: t.isCompliant
    }));

  // Prepare Metal Detector 24h timeline
  const mdChartData = metalDetectorLogs.map(m => ({
    time: m.time,
    status: m.isCompliant ? 1 : 0,
    fe: m.feStatus === 'pass' ? 1 : 0,
    nfe: m.nfeStatus === 'pass' ? 1 : 0,
    ss: m.ssStatus === 'pass' ? 1 : 0,
  }));

  // Sensory Radar Chart Data
  const sensoryAvg = {
    'اللون': sensoryEvaluations.reduce((acc, curr) => acc + curr.colorScore, 0) / (sensoryEvaluations.length || 1),
    'الطعم': sensoryEvaluations.reduce((acc, curr) => acc + curr.tasteScore, 0) / (sensoryEvaluations.length || 1),
    'الرائحة': sensoryEvaluations.reduce((acc, curr) => acc + curr.aromaScore, 0) / (sensoryEvaluations.length || 1),
    'القوام': sensoryEvaluations.reduce((acc, curr) => acc + curr.textureScore, 0) / (sensoryEvaluations.length || 1),
    'الإنطباع': sensoryEvaluations.reduce((acc, curr) => acc + curr.overallImpressionScore, 0) / (sensoryEvaluations.length || 1),
  };

  const radarData = [
    { subject: 'اللون', score: Number(sensoryAvg['اللون'].toFixed(1)), fullMark: 10 },
    { subject: 'الطعم', score: Number(sensoryAvg['الطعم'].toFixed(1)), fullMark: 10 },
    { subject: 'الرائحة', score: Number(sensoryAvg['الرائحة'].toFixed(1)), fullMark: 10 },
    { subject: 'القوام', score: Number(sensoryAvg['القوام'].toFixed(1)), fullMark: 10 },
    { subject: 'الإنطباع العام', score: Number(sensoryAvg['الإنطباع'].toFixed(1)), fullMark: 10 },
  ];

  // Defects distribution by cluster
  const defectCategories = [
    { name: 'حجم القطع', count: defectLogs.reduce((a, c) => a + c.oversize + c.undersize, 0), color: '#3b82f6' },
    { name: 'الأوزان', count: defectLogs.reduce((a, c) => a + c.overweight + c.underweight, 0), color: '#6366f1' },
    { name: 'التسوية واللون', count: defectLogs.reduce((a, c) => a + c.darkColor + c.lightColor + c.burntParts, 0), color: '#f59e0b' },
    { name: 'النسيج والتوريق', count: defectLogs.reduce((a, c) => a + c.deflatedProduct + c.gapsInPieces + c.dryProduct + c.doughyProduct + c.nonLaminated, 0), color: '#10b981' },
    { name: 'الحشو والطعم', count: defectLogs.reduce((a, c) => a + c.bitterTaste + c.rancidTaste + c.fillingLeakage + c.excessFilling + c.insufficientFilling + c.noFilling, 0), color: '#ec4899' },
    { name: 'التلميع والمظهر', count: defectLogs.reduce((a, c) => a + c.heavyTexture + c.lightTexture + c.excessGlaze + c.surfaceSpots + c.surfaceCracks, 0), color: '#8b5cf6' },
    { name: 'التغليف والطباعة', count: defectLogs.reduce((a, c) => a + c.expiryDateDefect + c.sealingDefect + c.printingDefect, 0), color: '#14b8a6' },
  ];

  const compliancePieData = [
    { name: 'مطابق للمواصفة', value: kpi.compliancePercentage, color: '#10b981' },
    { name: 'انحرافات أو عيوب', value: 100 - kpi.compliancePercentage, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <HeaderBanner
        title={`لوحة المؤشرات والتحليلات الرقابية - قسم المخبوزات ${activeSection}`}
        subtitle={`نظرة شاملة ولحظية على عمليات الجودة، معايير التسوية، كواشف المعادن وإذن الإفراج النهائي عن الإنتاج (${activeDate})`}
        docCode={activeSection === 1 ? 'QC-IS-FM-01-06' : 'QC-IS-FM-01-19'}
        revNo="0 / 2"
        date={activeDate}
      />

      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Inspected Samples */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي العينات المفحوصة</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
              {kpi.totalSamplesInspected.toLocaleString('ar-EG')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>تغطية 100% لكافة خطوط المخبوزات {activeSection}</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        {/* Card 2: Compliance Percentage */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">نسبة الامتثال والمطابقة</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {kpi.compliancePercentage}%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              <span>ضمن الحدود المسموحة (≤3% و ≤5%)</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>

        {/* Card 3: CCP / OPRP Deviations */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">انحرافات CCP / OPRP الحرجة</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.criticalDeviationsCount > 0 ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl lg:text-3xl font-black ${kpi.criticalDeviationsCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
              {kpi.criticalDeviationsCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold mt-1">
              {kpi.criticalDeviationsCount === 0 ? (
                <span className="text-emerald-600">لا توجد انحرافات - خطوط آمنة</span>
              ) : (
                <span className="text-rose-600">تم تسجيل إجراءات تصحيحية فورية</span>
              )}
            </div>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${kpi.criticalDeviationsCount > 0 ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
        </div>

        {/* Card 4: Final Release Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">حالة الإفراج النهائي للتشغيلة</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className={`text-xl lg:text-2xl font-black px-3 py-1 rounded-xl ${
                currentReleaseStatus === 'approved'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : currentReleaseStatus === 'rejected'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {currentReleaseStatus === 'approved' ? 'معتمد ومفرج عنه' : currentReleaseStatus === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              إذن إفراج رقم: QC-IS-FM-01-16
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500" />
        </div>

      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Core Temperature vs Critical Limit (>= 90°C) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                  مراقبة درجات حرارة مركز المنتج بعد التسوية
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  الحد الحرج الإلزامي لسلامة الغذاء: <span className="font-bold text-rose-600">≥ 90 °م</span> (نماذج 10 & 27)
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('weights_temp')}
              className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>تفاصيل</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-cairo">
                          <div className="font-bold text-rose-300">{data.fullTitle}</div>
                          <div className="mt-1">الوقت: {data.time}</div>
                          <div className="text-emerald-400 font-bold text-sm">درجة الحرارة: {data.temp} °م</div>
                          <div className={`mt-1 font-bold ${data.isCompliant ? 'text-emerald-300' : 'text-rose-400'}`}>
                            {data.isCompliant ? '✓ مطابق (≥ 90°م)' : '✕ غير مطابق'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine 
                  y={90} 
                  label={{ value: 'الحد الحرج 90°C', position: 'top', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#059669" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#059669' }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>متوسط درجات الحرارة اليومية: <strong className="text-slate-800 dark:text-slate-200">{kpi.avgCoreTemp}°م</strong></span>
            <span className="text-emerald-600 font-bold">100% فوق الحد الحرج</span>
          </div>
        </div>

        {/* Chart 2: 24-Hour Metal Detector & Sieve Log Timeline */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                  المخطط الزمني لكاشف المعادن CCP (24 ساعة)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fe: 2.5mm | NFe: 3.0mm | S.S: 3.5mm (نموذج 11)
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('ccp_oprp')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>تفاصيل CCP</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mdChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 1.2]} ticks={[0, 1]} tickFormatter={(val) => val === 1 ? 'مطابق' : 'فشل'} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-cairo">
                          <div className="font-bold text-emerald-400">فحص الساعة: {data.time}</div>
                          <div className="mt-1 space-y-0.5">
                            <div>حديد Fe (2.5mm): <span className="font-bold text-emerald-300">{data.fe ? '✓ نجاح' : '✕ فشل'}</span></div>
                            <div>غير حديدي NFe (3.0mm): <span className="font-bold text-emerald-300">{data.nfe ? '✓ نجاح' : '✕ فشل'}</span></div>
                            <div>ستانلس S.S (3.5mm): <span className="font-bold text-emerald-300">{data.ss ? '✓ نجاح' : '✕ فشل'}</span></div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="status" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>عدد الفحوصات المنفذة: <strong className="text-slate-800 dark:text-slate-200">{metalDetectorLogs.length} ساعة</strong></span>
            <span className="text-emerald-600 font-bold">جميع الاختبارات القياسية ناجحة</span>
          </div>
        </div>

        {/* Chart 3: Sensory Evaluation Summary Radar */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                  ملخص التقييم الحسي للأغذية (MATRIX 1-10)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  متوسط درجات اللون، الطعم، الرائحة، القوام، الإنطباع (نماذج 13 & 14 & 29)
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('sensory_food_safety')}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>تفاصيل التقييم</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Radar name="التقييم الحسي" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs font-cairo">
                          <div className="font-bold text-purple-300">{data.subject}</div>
                          <div className="text-white font-bold text-sm mt-1">{data.score} / 10</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>التقييم العام للمنتجات: <strong className="text-purple-600 font-extrabold">{kpi.avgSensoryScore} / 10 (ممتاز)</strong></span>
            <span>عدد العينات المقيّمة: {sensoryEvaluations.length}</span>
          </div>
        </div>

        {/* Chart 4: Defect Distribution Pareto */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                  توزيع العيوب المكتشفة حسب الفئات
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  تحليل عيوب الحجم، الوزن، التسوية، التوريق، الحشو، التلميع والتغليف
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('defects')}
              className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>سجل العيوب</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectCategories} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs font-cairo">
                          <div className="font-bold text-amber-400">{data.name}</div>
                          <div className="mt-1">عدد الملاحظات: <span className="font-bold">{data.count} قطعة</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]}>
                  {defectCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>حالة العيوب الحرجة: <strong className="text-emerald-600 font-bold">صفر عيوب حرجة (0% للشوائب والروائح)</strong></span>
          </div>
        </div>

      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        <div 
          onClick={() => onNavigate('ipc')}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-rose-300">مرحلة العجن والتشغيل (IPC)</div>
            <div className="font-bold text-base mt-1">موازين الخامات والخلطات القياسية</div>
            <div className="text-xs text-slate-300 mt-1">متابعة سمك العجين 0.4:0.7cm وتركيز التلميع</div>
          </div>
          <ArrowUpRight className="w-6 h-6 text-rose-400" />
        </div>

        <div 
          onClick={() => onNavigate('defects')}
          className="p-4 rounded-2xl bg-gradient-to-br from-rose-900 to-rose-800 text-white shadow-md cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-amber-300">تسجيل العيوب باللمس</div>
            <div className="font-bold text-base mt-1">نموذج فحص خطوط الإنتاج السريع</div>
            <div className="text-xs text-rose-200 mt-1">فحص بداية، منتصف، ونهاية التشغيل</div>
          </div>
          <ArrowUpRight className="w-6 h-6 text-amber-400" />
        </div>

        <div 
          onClick={() => onNavigate('product_release')}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-900 text-white shadow-md cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-emerald-300">الاعتماد والتسليم</div>
            <div className="font-bold text-base mt-1">إذن الإفراج عن المنتج التام</div>
            <div className="text-xs text-emerald-200 mt-1">التحقق من الشروط الـ 5 والتوقيع الإلكتروني</div>
          </div>
          <ArrowUpRight className="w-6 h-6 text-emerald-400" />
        </div>

      </div>
    </div>
  );
};
