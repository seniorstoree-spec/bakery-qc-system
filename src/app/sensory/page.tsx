"use client";

import React from "react";
import { Star } from "lucide-react";

export default function SensoryPage() {
  const criteria = ["المظهر الخارجي", "القوام الداخلي", "التلميع", "الحشو", "الطعم", "الرائحة"];
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">التقييم الحسي والسلامة</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensory Evaluation Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
            تقييم المنتج النهائي (مقياس 1-10)
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">نوع المنتج المستهدف</label>
              <select className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50">
                <option>منتج عادي (Regular)</option>
                <option>منتج نباتي (Vegan)</option>
              </select>
            </div>

            {criteria.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 w-1/3">{item}</span>
                <input 
                  type="range" 
                  min="1" max="10" defaultValue="8" 
                  className="w-1/2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-blue-600 w-10 text-left" dir="ltr">8 / 10</span>
              </div>
            ))}

            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
              حفظ التقييم الحسي
            </button>
          </div>
        </div>

        {/* Hygiene & GHP Checklist */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
            قائمة الممارسات الصحية الجيدة (GHP)
          </h3>

          <div className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-2">النظافة الشخصية للعمال</h4>
              <label className="flex items-center gap-3 mb-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-slate-600">ارتداء الزي الموحد النظيف وغطاء الرأس/الكمامة</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-slate-600">خلو الأيدي من الجروح أو ارتداء القفازات الملونة (أزرق)</span>
              </label>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-2">نظافة الصالة والمعدات</h4>
              <label className="flex items-center gap-3 mb-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-slate-600">نظافة الأرضيات وعدم وجود مياه راكدة</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-slate-600">خلو الصالة من أي علامات للآفات (Pest Control)</span>
              </label>
            </div>

            <button className="w-full mt-4 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-sm font-medium transition-colors">
              حفظ وتوثيق الفحص
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
