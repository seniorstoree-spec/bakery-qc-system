import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from '../../data/initialData';
import { UserRole } from '../../types';
import { Shield, Check, Key } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUserRole } = useApp();

  if (!isOpen) return null;

  const roleBadges: Record<UserRole, { label: string; color: string; desc: string }> = {
    quality_engineer: {
      label: 'مهندس جودة (Quality Engineer)',
      color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
      desc: 'تسجيل البيانات اليومية، متابعة درجات الحرارة والأوزان، تسجيل عيوب الجودة والعمليات'
    },
    quality_manager: {
      label: 'مدير الجودة / رئيس قسم المراقبة (Quality Manager)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
      desc: 'مراجعة التقارير، اعتماد أذونات الإفراج النهائي، تعديل الحدود الحرجة، التحقق من الانحرافات'
    },
    production_supervisor: {
      label: 'مشرف إنتاج / أمين مخزن (Supervisor / Storekeeper)',
      color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
      desc: 'عرض أذونات الإفراج المعتمدة والكميات المتاحة للتوزيع والتسليم (قراءة فقط للتقارير الحساسة)'
    },
    system_admin: {
      label: 'مدير النظام (System Admin)',
      color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
      desc: 'تحكم كامل بالنظام وإدارة المستخدمين وإعدادات النسخ الاحتياطي والصلاحيات'
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overscroll-contain">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] my-auto overflow-hidden flex flex-col">
        <div className="shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-6 break-words">
                  محاكي الصلاحيات وأدوار المستخدمين (RBAC)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-5 break-words">
                  اختر الحساب والدور الوظيفي لاختبار الصلاحيات وسير العمل وتواقيع الاعتماد
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl touch-target"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar px-3 sm:px-6 py-3 sm:py-4">
          <div className="space-y-3">
            {INITIAL_USERS.map((user) => {
              const isSelected = currentUser.role === user.role;
              const badge = roleBadges[user.role];

              return (
                <div
                  key={user.id}
                  onClick={() => setCurrentUserRole(user.role)}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <div className="shrink-0 pt-1">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-transparent" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base break-words">
                        {user.name}
                      </span>
                      <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold border break-words ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-5 break-words">
                      <span>{user.title}</span> • <span>{user.department}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-5 break-words">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mt-4 text-xs space-y-2">
            <div className="flex items-start gap-2 font-bold text-slate-800 dark:text-slate-200 leading-5">
              <Key className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="break-words">صلاحيات الحساب النشط حالياً ({currentUser.name}):</span>
            </div>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-2">
              <div className={`min-w-0 p-2 rounded-lg border flex items-start gap-1.5 ${currentUser.permissions.canEnterData ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'}`}>
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="break-words leading-4">إدخال البيانات اليومية</span>
              </div>
              <div className={`min-w-0 p-2 rounded-lg border flex items-start gap-1.5 ${currentUser.permissions.canApproveRelease ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'}`}>
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="break-words leading-4">اعتماد إذن الإفراج النهائي</span>
              </div>
              <div className={`min-w-0 p-2 rounded-lg border flex items-start gap-1.5 ${currentUser.permissions.canEditCriticalLimits ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'}`}>
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="break-words leading-4">تعديل الحدود الحرجة</span>
              </div>
              <div className={`min-w-0 p-2 rounded-lg border flex items-start gap-1.5 ${currentUser.permissions.canSignOff ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'}`}>
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="break-words leading-4">التوقيع الإلكتروني</span>
              </div>
              <div className={`min-w-0 p-2 rounded-lg border flex items-start gap-1.5 ${currentUser.permissions.canExportReports ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'}`}>
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="break-words leading-4">تصدير وطباعة التقارير</span>
              </div>
              <div className={`min-w-0 p-2 rounded-lg border flex items-start gap-1.5 ${currentUser.permissions.canManageUsers ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'}`}>
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="break-words leading-4">إدارة النظام والمستخدمين</span>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-3 sm:px-6 py-3 sm:py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-md shadow-rose-600/20"
          >
            تطبيق ومتابعة
          </button>
        </div>
      </div>
    </div>
  );
};
