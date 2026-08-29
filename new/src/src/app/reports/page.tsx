"use client";

import React, { useState } from "react";
import { FileText, Download, Filter, Search, FileSpreadsheet, FileIcon, Loader2, CheckCircle2 } from "lucide-react";

// Mock Consolidated QC Data
const reportData = [
  { id: "QC-1001", date: "2026-08-29", time: "08:00", formType: "تتبع الأوزان والحرارة", inspector: "أحمد محمد", status: "مطابق", details: "حرارة: 92°C | منتج: كرواسون" },
  { id: "QC-1002", date: "2026-08-29", time: "09:00", formType: "كاشف المعادن (CCP)", inspector: "محمود علي", status: "مطابق", details: "اجتياز جميع العينات (Fe, NFe, SS)" },
  { id: "QC-1003", date: "2026-08-29", time: "10:30", formType: "عيوب الجودة", inspector: "سعيد كمال", status: "غير مطابق", details: "تشوه المظهر الخارجي | إجراء: تم التعديل" },
  { id: "QC-1004", date: "2026-08-28", time: "11:00", formType: "التحكم أثناء العملية (IPC)", inspector: "أحمد محمد", status: "مطابق", details: "مرحلة الخبيز | وقت المعالجة سليم" },
  { id: "QC-1005", date: "2026-08-28", time: "14:00", formType: "التقييم الحسي", inspector: "منى سعيد", status: "مطابق", details: "متوسط التقييم 8.5/10" },
  { id: "QC-1006", date: "2026-08-27", time: "07:30", formType: "نظافة وتطهير", inspector: "علي حسن", status: "مطابق", details: "العجانة الرئيسية | تركيز المادة سليم" },
  { id: "QC-1007", date: "2026-08-27", time: "12:15", formType: "اشتراطات سلامة الغذاء", inspector: "سعيد كمال", status: "غير مطابق", details: "ملاحظة على ظروف التخزين" },
];

export default function ReportsPage() {
  const [toast, setToast] = useState<{ type: "success" | "info" | "error"; message: string } | null>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "الكل",
    inspector: "",
    formType: "الكل"
  });

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = async (format: string) => {
    setExportLoading(format);
    // Simulate export generation time
    await new Promise(r => setTimeout(r, 2000));
    setExportLoading(null);
    showToast(`تم تصدير التقرير بصيغة ${format} بنجاح.`, "success");
  };

  // Filter Logic
  const filteredData = reportData.filter(item => {
    let match = true;
    if (filters.status !== "الكل" && item.status !== filters.status) match = false;
    if (filters.formType !== "الكل" && item.formType !== filters.formType) match = false;
    if (filters.inspector && !item.inspector.includes(filters.inspector)) match = false;
    if (filters.dateFrom && item.date >= filters.dateFrom) {} // Basic date comparison logic
    if (filters.dateTo && item.date <= filters.dateTo) {}
    // In a real app we'd parse dates, but string comparison works for standard YYYY-MM-DD
    if (filters.dateFrom && item.date < filters.dateFrom) match = false;
    if (filters.dateTo && item.date > filters.dateTo) match = false;
    
    return match;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative pb-10">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all ${
          toast.type === "success" ? "bg-emerald-500 text-white" : 
          toast.type === "info" ? "bg-blue-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={20} /> : <FileText size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-blue-600" />
          التقارير الشاملة (QC Reports)
        </h2>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExport("Excel")}
            disabled={exportLoading !== null}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:bg-emerald-400"
          >
            {exportLoading === "Excel" ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
            تصدير Excel
          </button>
          <button 
            onClick={() => handleExport("PDF")}
            disabled={exportLoading !== null}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:bg-red-400"
          >
            {exportLoading === "PDF" ? <Loader2 size={16} className="animate-spin" /> : <FileIcon size={16} />}
            تصدير PDF
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">إجمالي التقارير المصدرة</p>
          <p className="text-2xl font-bold text-slate-800">{filteredData.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">سجلات مطابقة</p>
          <p className="text-2xl font-bold text-emerald-600">{filteredData.filter(d => d.status === "مطابق").length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">سجلات غير مطابقة</p>
          <p className="text-2xl font-bold text-red-600">{filteredData.filter(d => d.status === "غير مطابق").length}</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Filter size={16} />
          فلاتر التقرير
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">من تاريخ</label>
            <input 
              type="date" 
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">إلى تاريخ</label>
            <input 
              type="date" 
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">حالة الفحص</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>الكل</option>
              <option>مطابق</option>
              <option>غير مطابق</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">نوع التقرير</label>
            <select 
              value={filters.formType}
              onChange={(e) => setFilters({...filters, formType: e.target.value})}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>الكل</option>
              <option>تتبع الأوزان والحرارة</option>
              <option>كاشف المعادن (CCP)</option>
              <option>التحكم أثناء العملية (IPC)</option>
              <option>عيوب الجودة</option>
              <option>نظافة وتطهير</option>
              <option>اشتراطات سلامة الغذاء</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">اسم المفتش</label>
            <div className="relative">
              <Search className="absolute right-2 top-2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="بحث بالاسم..."
                value={filters.inspector}
                onChange={(e) => setFilters({...filters, inspector: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2 pr-8 text-sm focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">معرف التقرير</th>
                <th className="px-4 py-3">التاريخ والوقت</th>
                <th className="px-4 py-3">نوع النموذج (QC Form)</th>
                <th className="px-4 py-3">المفتش (Inspector)</th>
                <th className="px-4 py-3">تفاصيل البيانات (Metrics)</th>
                <th className="px-4 py-3 text-center">الحالة (Status)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-blue-600" dir="ltr">{row.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.date} - {row.time}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{row.formType}</td>
                  <td className="px-4 py-3">{row.inspector}</td>
                  <td className="px-4 py-3 max-w-xs truncate" title={row.details}>{row.details}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      row.status === "مطابق" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    لا توجد بيانات مطابقة لهذه الفلاتر.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
