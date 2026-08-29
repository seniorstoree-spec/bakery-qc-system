"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function DefectsPage() {
  const [defects, setDefects] = useState([
    { id: 1, stage: "بداية الإنتاج", category: "المظهر الخارجي", description: "شكل غير منتظم", action: "تعديل إعدادات التشكيل" }
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">تسجيل عيوب الجودة اليومية</h2>
      </div>

      {/* Add Defect Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">إضافة عيب جديد</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">مرحلة الإنتاج</label>
            <select className="w-full border border-slate-300 rounded-lg p-2.5">
              <option>بداية الإنتاج</option>
              <option>منتصف الإنتاج</option>
              <option>نهاية الإنتاج</option>
              <option>توقف غير مخطط</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">فئة العيب</label>
            <select className="w-full border border-slate-300 rounded-lg p-2.5">
              <option>المظهر الخارجي</option>
              <option>القوام الداخلي</option>
              <option>التلميع</option>
              <option>الحشو</option>
              <option>الطعم</option>
              <option>الأبعاد</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">وصف العيب والإجراء التصحيحي</label>
            <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5" placeholder="تفاصيل العيب وما تم اتخاذه..." />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
            <Plus size={18} />
            إضافة للسجل
          </button>
        </div>
      </div>

      {/* Defects Log Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-right text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">المرحلة</th>
              <th className="px-6 py-4">الفئة</th>
              <th className="px-6 py-4">الوصف</th>
              <th className="px-6 py-4">الإجراء التصحيحي</th>
              <th className="px-6 py-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {defects.map((defect) => (
              <tr key={defect.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{defect.stage}</td>
                <td className="px-6 py-4">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">{defect.category}</span>
                </td>
                <td className="px-6 py-4">{defect.description}</td>
                <td className="px-6 py-4 text-emerald-600">{defect.action}</td>
                <td className="px-6 py-4 text-center">
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
