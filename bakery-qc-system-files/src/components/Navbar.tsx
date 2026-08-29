import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Layers, 
  Calendar, 
  UserCircle2, 
  Moon, 
  Sun, 
  Download, 
  Menu, 
  Sparkles, 
  Activity,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { RoleSwitcherModal } from './common/RoleSwitcherModal';
import { ExportModal } from './common/ExportModal';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { 
    activeSection, 
    setActiveSection, 
    currentUser, 
    isDarkMode, 
    setIsDarkMode, 
    activeDate, 
    setActiveDate,
    triggerMockUpdate,
    kpi
  } = useApp();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-3 transition-colors">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          
          {/* Right side: Mobile Menu + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="القائمة الرئيسية"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-700 to-rose-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-rose-600/30">
                العبد
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white leading-tight">
                    منظومة الجودة وقسم المخبوزات
                  </h1>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    مباشر
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  نظام الرقابة اللحظية ونقاط التحكم الحرجة (HACCP & IPC)
                </p>
              </div>
            </div>
          </div>

          {/* Center: Section Switcher (مخبوزات 1 vs مخبوزات 2) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
            <button
              onClick={() => setActiveSection(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
                activeSection === 1
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>مخبوزات 1</span>
              <span className="hidden md:inline text-[10px] opacity-80">(كرواسون/دانش)</span>
            </button>

            <button
              onClick={() => setActiveSection(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
                activeSection === 2
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>مخبوزات 2</span>
              <span className="hidden md:inline text-[10px] opacity-80">(دونتس/سينامون)</span>
            </button>
          </div>

          {/* Left side: Date, Role Switcher, Mock Trigger, Export, Dark Mode */}
          <div className="flex items-center gap-1.5 md:gap-2">
            
            {/* Quick Live Reading Generator */}
            <button
              onClick={triggerMockUpdate}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors"
              title="محاكاة تسجيل قراءة حرارة جديدة لحظياً"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>تسجيل قراءة حية</span>
            </button>

            {/* Date Input */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={activeDate}
                onChange={(e) => setActiveDate(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
              />
            </div>

            {/* Role Switcher Badge Button */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-right"
              title="تغيير الدور ومحاكاة الصلاحيات"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                  {currentUser.title.split(' ')[0]}
                </div>
              </div>
              <Shield className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
            </button>

            {/* Export & Print */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="تصدير وطباعة"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="تبديل الوضع الليلي"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </header>

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
};
