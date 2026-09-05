"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Save } from "lucide-react";

const stages = [
  "العجن (Kneading)",
  "الترقيق (Flattening)",
  "تشكيل العجين (Sheet Forming)",
  "الخبيز (Baking)",
  "التلميع (Glazing)",
  "التغليف (Packaging)",
  "التجميد السريع (Quick Freezing)",
];

export default function IPCPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">التحكم أثناء العملية (IPC)</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Save size={18} />
          حفظ التقرير
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50">
          {stages.map((stage, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === index
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
            معايير مرحلة {stages[activeTab]}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  أوزان الخامات (كجم)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="أدخل الوزن..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  درجة حرارة الصالة (°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full border border-slate-300 rounded-lg p-2.5 pr-10 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="الحد الأمثل 22°C"
                  />
                  <CheckCircle className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  وقت المعالجة (دقيقة)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="أدخل الوقت..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ملاحظات الانحراف (إن وجدت)
                </label>
                <textarea
                  className="w-full border border-red-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50"
                  rows={2}
                  placeholder="سجل أي انحراف عن المعايير هنا..."
                ></textarea>
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> في حالة وجود انحراف، يجب تسجيل الإجراء التصحيحي.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
