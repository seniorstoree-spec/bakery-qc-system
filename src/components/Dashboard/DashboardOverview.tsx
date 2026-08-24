import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ShieldCheck, ShieldAlert, Activity, Flame, ChevronLeft } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { HeaderBanner } from '../common/HeaderBanner';

interface DashboardOverviewProps { onNavigate:(tab:any)=>void; }
const enNumber=(value:number)=>Number.isFinite(value)?value.toLocaleString('en-US'):'0';

export const DashboardOverview:React.FC<DashboardOverviewProps>=({onNavigate})=>{
 const {kpi,activeSection,coreTemperatures,defectLogs,releaseFormB1,releaseFormB2,activeDate}=useApp();
 const currentReleaseStatus=activeSection===1?releaseFormB1.decision:releaseFormB2.decision;
 const tempChartData=coreTemperatures.filter(t=>t.bakerySection===activeSection).map(t=>({name:t.productName.length>12?t.productName.slice(0,12)+'...':t.productName,temp:t.coreTemperature,time:t.time}));
 const defectChartData=[
  {name:'حجم القطع',count:defectLogs.reduce((a,c)=>a+c.oversize+c.undersize,0)},
  {name:'الأوزان',count:defectLogs.reduce((a,c)=>a+c.overweight+c.underweight,0)},
  {name:'التسوية واللون',count:defectLogs.reduce((a,c)=>a+c.darkColor+c.lightColor+c.burntParts,0)},
  {name:'التغليف والطباعة',count:defectLogs.reduce((a,c)=>a+c.expiryDateDefect+c.sealingDefect+c.printingDefect,0)},
 ];
 return <div className="space-y-6 animate-fadeIn pb-12">
  <HeaderBanner title={`لوحة المؤشرات والتحليلات الرقابية - قسم المخبوزات ${activeSection}`} subtitle={`بيانات تشغيلية فعلية للتاريخ ${activeDate}`} docCode={activeSection===1?'QC-IS-FM-01-06':'QC-IS-FM-01-19'} revNo="0 / 2" date={activeDate}/>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
   <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">إجمالي العينات المفحوصة</span><Activity className="w-5 h-5 text-blue-600"/></div><div className="text-3xl font-black mt-3">{enNumber(kpi.totalSamplesInspected)}</div><div className="text-xs text-slate-500 mt-1">من السجلات الفعلية لليوم</div></div>
   <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">نسبة الامتثال</span><CheckCircle2 className="w-5 h-5 text-emerald-600"/></div><div className="text-3xl font-black mt-3 text-emerald-600">{enNumber(kpi.compliancePercentage)}%</div><div className="text-xs text-slate-500 mt-1">محسوبة من البيانات الفعلية</div></div>
   <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">الانحرافات الحرجة</span><ShieldAlert className="w-5 h-5 text-rose-600"/></div><div className="text-3xl font-black mt-3">{enNumber(kpi.criticalDeviationsCount)}</div><div className="text-xs text-slate-500 mt-1">من السجلات الفعلية</div></div>
   <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">حالة الإفراج النهائي</span><ShieldCheck className="w-5 h-5 text-amber-600"/></div><div className="text-xl font-black mt-3">{currentReleaseStatus==='approved'?'معتمد ومفرج عنه':currentReleaseStatus==='rejected'?'مرفوض':'قيد المراجعة'}</div></div>
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
   <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm"><div className="flex items-center justify-between mb-4"><div><h3 className="font-bold flex items-center gap-2"><Flame className="w-4 h-4 text-rose-600"/>درجات حرارة مركز المنتج</h3><p className="text-[11px] text-slate-500">بيانات فعلية مسجلة اليوم والقسم</p></div><button onClick={()=>onNavigate('weights_temp')} className="text-xs text-rose-600 font-bold flex items-center gap-1">تفاصيل<ChevronLeft className="w-3.5 h-3.5"/></button></div><div className="h-64">{tempChartData.length?<ResponsiveContainer width="100%" height="100%"><LineChart data={tempChartData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2}/></LineChart></ResponsiveContainer>:<div className="h-full flex items-center justify-center text-slate-400">لا توجد بيانات فعلية مسجلة لهذا اليوم.</div>}</div></div>
   <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm"><div className="mb-4"><h3 className="font-bold">توزيع العيوب المسجلة</h3><p className="text-[11px] text-slate-500">محسوب من سجل العيوب الفعلي</p></div><div className="h-64">{defectChartData.some(x=>x.count>0)?<ResponsiveContainer width="100%" height="100%"><BarChart data={defectChartData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="count" fill="#f59e0b"/></BarChart></ResponsiveContainer>:<div className="h-full flex items-center justify-center text-slate-400">لا توجد عيوب فعلية مسجلة.</div>}</div></div>
  </div>
 </div>;
};
