import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface HeaderBannerProps {
  title: string;
  docCode: string;
  revNo: string | number;
  date: string;
  subtitle?: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  title,
  docCode,
  revNo,
  date,
  subtitle
}) => {
  const { activeSection } = useApp();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm mb-6 print:border-black print:shadow-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              تقرير مراقبة الجودة اليومى لقسم المخبوزات
            </h1>
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-rose-600 dark:text-rose-400">
              <span>إدارة الجودة وتأكيد الجودة</span>
              <span>•</span>
              <span className="bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full text-xs font-bold border border-rose-200 dark:border-rose-900">
                قسم: المخبوزات {activeSection === 1 ? '1 (كرواسون، باتيه، دانش، ميلفيه)' : '2 (دونتس، سينامون، ساندويتش)'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5 font-mono px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>كود: {docCode}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
            <span>Rev. No: {revNo}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>تاريخ الوثيقة: {date}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 w-fit">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>نظام الجودة وسلامة الغذاء ISO 22000 & HACCP</span>
        </div>
      </div>
    </div>
  );
};
