"use client";

import React, { useState } from "react";
import { ShieldAlert, Check } from "lucide-react";

export default function CCPPage() {
  const [activeTab, setActiveTab] = useState("metal");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">النقاط الحرجة (CCP / OPRP)</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab("metal")}
            className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "metal"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            جهاز كشف المعادن (Metal Detector - CCP)
          </button>
          <button
            onClick={() => setActiveTab("sieve")}
            className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "sieve"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            المنخل الكهربائي (Electric Sieve - OPRP)
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "metal" ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                <ShieldAlert className="text-blue-600 mt-0.5 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-blue-900">معايير الاختبار القياسية</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    يجب اختبار الجهاز كل ساعة باستخدام العينات القياسية: Fe (2.5mm) | NFe (3.0mm) | S.S (3.5mm)
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-slate-600">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">الوقت</th>
                      <th className="px-4 py-3 text-center">Fe (2.5mm)</th>
                      <th className="px-4 py-3 text-center">NFe (3.0mm)</th>
                      <th className="px-4 py-3 text-center">S.S (3.5mm)</th>
                      <th className="px-4 py-3">القائم بالفحص</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["08:00", "09:00", "10:00", "11:00"].map((time, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="px-4 py-3 font-medium">{time}</td>
                        <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked /></td>
                        <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked /></td>
                        <td className="px-4 py-3 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked /></td>
                        <td className="px-4 py-3">أحمد محمد</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-start gap-3">
                <ShieldAlert className="text-emerald-600 mt-0.5 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-emerald-900">معايير فحص المنخل</h4>
                  <p className="text-sm text-emerald-800 mt-1">
                    التأكد من سلامة شبكة المنخل (600 ميكرون) وعدم وجود تمزق قبل وبعد التشغيل.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-800 mb-4 border-b pb-2">فحص بداية الوردية</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" />
                      <span className="text-sm text-slate-700">الشبكة سليمة تماماً (600 microns)</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" />
                      <span className="text-sm text-slate-700">لا توجد شوائب معدنية ملتصقة</span>
                    </label>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-800 mb-4 border-b pb-2">فحص نهاية الوردية</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" />
                      <span className="text-sm text-slate-700">الشبكة سليمة بعد انتهاء العمل</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" />
                      <span className="text-sm text-slate-700">تم تنظيف منطقة المنخل وتأمينها</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
