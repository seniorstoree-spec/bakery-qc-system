import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Layers,
  Calendar,
  Moon,
  Sun,
  Download,
  Menu,
  Sparkles,
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
  } = useApp();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 transition-colors">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden touch-target p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
              title="القائمة الرئيسية"
              aria-label="فتح القائمة الرئيسية"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-700 to-rose-500 flex items-center justify-center text-white font-black text-sm sm:text-lg shadow-md shadow-rose-600/30 shrink-0">
                العبد
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h1 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white leading-tight truncate">
                    منظومة الجودة وقسم المخبوزات
                  </h1>
                  <span className="hidden md:flex bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    مباشر
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  نظام الرقابة اللحظية ونقاط التحكم الحرجة (HACCP & IPC)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner shrink-0">
            <button
              onClick={() => setActiveSection(1)}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                activeSection === 1
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>مخبوزات 1</span>
              <span className="hidden lg:inline text-[10px] opacity-80">(كرواسون/دانش)</span>
            </button>

            <button
              onClick={() => setActiveSection(2)}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                activeSection === 2
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>مخبوزات 2</span>
              <span className="hidden lg:inline text-[10px] opacity-80">(دونتس/سينامون)</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={triggerMockUpdate}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors"
              title="محاكاة تسجيل قراءة حرارة جديدة لحظياً"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>تسجيل قراءة حية</span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={activeDate}
                onChange={(e) => setActiveDate(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer max-w-[125px]"
              />
            </div>

            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="touch-target flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 px-1.5 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-right"
              title="تغيير الدور ومحاكاة الصلاحيات"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block min-w-0 max-w-[90px] lg:max-w-[130px]">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold truncate">
                  {currentUser.title.split(' ')[0]}
                </div>
              </div>
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="touch-target p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
              title="تصدير وطباعة"
              aria-label="تصدير وطباعة"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="touch-target p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
              title="تبديل الوضع الليلي"
              aria-label="تبديل الوضع الليلي"
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
