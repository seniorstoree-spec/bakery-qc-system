import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, SlidersHorizontal, ClipboardCheck, ThermometerSnowflake,
  ShieldAlert, Sparkles, FileCheck, X, Scale
} from 'lucide-react';

export type NavTab =
  | 'dashboard' | 'ipc' | 'defects' | 'weights_temp'
  | 'ccp_oprp' | 'sensory_food_safety' | 'product_release';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PRODUCT_WEIGHTS_URL = 'https://preview--bake-scan-form.lovable.app/login';

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { kpi, activeSection } = useApp();
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'لوحة المؤشرات والتحليلات', sublabel: 'ملخص مؤشرات الأداء والرسوم البيانية', icon: LayoutDashboard, badge: `${kpi.compliancePercentage}%`, badgeColor: kpi.compliancePercentage >= 95 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
    { id: 'ipc' as NavTab, label: 'موازين الخامات والتشغيل (IPC)', sublabel: 'الخلطات، العجن، الفرد، التبنيط، التسوية', icon: SlidersHorizontal },
    { id: 'defects' as NavTab, label: 'تسجيل عيوب الجودة اليومية', sublabel: 'فحص الحجم، الوزن، التسوية، الحشو، التغليف', icon: ClipboardCheck, badge: kpi.nonCompliantCount > 0 ? `${kpi.nonCompliantCount} عيب` : undefined, badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
    { id: 'weights_temp' as NavTab, label: 'درجات الحرارة والأوزان', sublabel: 'حرارة مركز المنتج ≥ 90°C والمواد المضافة', icon: ThermometerSnowflake, badge: `${kpi.avgCoreTemp}°C`, badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
    { id: 'ccp_oprp' as NavTab, label: 'نقاط التحكم الحرجة (CCP / OPRP)', sublabel: 'كاشف المعادن على مدار 24 ساعة والمنخل 600µ', icon: ShieldAlert, badge: kpi.ccpFailureCount > 0 ? `${kpi.ccpFailureCount} انحراف` : 'آمن 100%', badgeColor: kpi.ccpFailureCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
    { id: 'sensory_food_safety' as NavTab, label: 'التقييم الحسي وسلامة الغذاء', sublabel: 'مصفوفة التقييم 1-10، النظافة، GHP، تقارير NCR', icon: Sparkles, badge: `تقييم ${kpi.avgSensoryScore}/10`, badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
    { id: 'product_release' as NavTab, label: 'إذن الإفراج عن المنتج التام', sublabel: 'الاعتماد النهائي والتوقيع للمخازن والتوزيع', icon: FileCheck, badge: activeSection === 1 ? (kpi.releaseStatusB1 === 'approved' ? 'معتمد' : 'معلق') : (kpi.releaseStatusB2 === 'approved' ? 'معتمد' : 'معلق'), badgeColor: (activeSection === 1 ? kpi.releaseStatusB1 : kpi.releaseStatusB2) === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
  ];
  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-fadeIn" />}
      <aside className={`fixed lg:sticky top-0 right-0 z-40 h-screen w-80 shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-sm">العبد</div><span className="font-bold text-slate-900 dark:text-white text-sm">أقسام تقرير الجودة</span></div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pb-1">وحدات المراقبة والتحقق اليومي</div>
          {navItems.map((item) => {
            const Icon = item.icon; const isActive = activeTab === item.id;
            return <button key={item.id} onClick={() => { setActiveTab(item.id); onClose(); }} className={`w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between gap-3 group relative ${isActive ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold border border-rose-200/80 dark:border-rose-900/60 shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'}`}>
              <div className="flex items-center gap-3 min-w-0"><div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400'}`}><Icon className="w-5 h-5" /></div><div className="truncate"><div className="text-sm truncate leading-snug">{item.label}</div><div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{item.sublabel}</div></div></div>
              {item.badge && <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 border border-current/20 ${item.badgeColor}`}>{item.badge}</span>}
            </button>;
          })}
        </div>

        <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="px-4 pt-3 pb-2">
            <button
              type="button"
              onClick={() => { window.location.href = PRODUCT_WEIGHTS_URL; }}
              className="w-full text-right p-3 rounded-2xl transition-all flex items-center gap-3 group text-slate-700 dark:text-slate-300 bg-indigo-50/70 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium border border-indigo-200/70 dark:border-indigo-900/60 shadow-sm"
              title="متابعة أوزان المنتجات"
              aria-label="متابعة أوزان المنتجات"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1"><div className="text-sm leading-snug font-bold">متابعة أوزان المنتجات</div><div className="text-[11px] text-indigo-500/80 dark:text-indigo-300/70 mt-0.5">فتح نظام متابعة الأوزان</div></div>
            </button>
          </div>
          <div className="p-4 pt-2 bg-slate-50/70 dark:bg-slate-900/70">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold"><span>حالة الامتثال العام:</span><span className="text-emerald-600 font-extrabold">{kpi.compliancePercentage}%</span></div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${kpi.compliancePercentage}%` }} /></div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-0.5"><span>عينات مفحوصة: {kpi.totalSamplesInspected}</span><span>انحرافات حرجة: {kpi.criticalDeviationsCount}</span></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
