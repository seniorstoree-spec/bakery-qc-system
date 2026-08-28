import React from 'react';
import { NavTab } from '../Sidebar';
import { 
  LayoutDashboard, 
  SlidersHorizontal, 
  ClipboardCheck, 
  ThermometerSnowflake, 
  ShieldAlert, 
  Sparkles, 
  FileCheck,
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileBottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSidebar: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSidebar
}) => {
  const { kpi } = useApp();

  const mainTabs = [
    { id: 'dashboard' as NavTab, label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'ipc' as NavTab, label: 'الخلطات', icon: SlidersHorizontal },
    { id: 'defects' as NavTab, label: 'العيوب', icon: ClipboardCheck, badge: kpi.nonCompliantCount > 0 ? kpi.nonCompliantCount : undefined },
    { id: 'weights_temp' as NavTab, label: 'الحرارة', icon: ThermometerSnowflake },
    { id: 'ccp_oprp' as NavTab, label: 'CCP', icon: ShieldAlert },
    { id: 'product_release' as NavTab, label: 'الإفراج', icon: FileCheck },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-2xl safe-bottom">
      <div className="flex items-center justify-around gap-1">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-extrabold scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight leading-tight">{tab.label}</span>
            </button>
          );
        })}

        {/* More / Menu toggle */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800"
        >
          <Menu className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5 tracking-tight leading-tight">المزيد</span>
        </button>
      </div>
    </div>
  );
};
