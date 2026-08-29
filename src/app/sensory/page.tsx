"use client";

import React, { useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";

export default function SensoryPage() {
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ type: "success", message });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Form 1: Sensory Evaluation ---
  const criteriaList = ["المظهر الخارجي", "القوام الداخلي", "التلميع", "الحشو", "الطعم", "الرائحة"];
  const [sensoryLoading, setSensoryLoading] = useState(false);
  const [sensoryData, setSensoryData] = useState({
    productType: "منتج عادي (Regular)",
    scores: criteriaList.reduce((acc, curr) => ({ ...acc, [curr]: 8 }), {} as Record<string, number>)
  });

  const handleSensorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSensoryLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSensoryLoading(false);
    showToast("تم حفظ التقييم الحسي بنجاح.");
    // Reset to default
    setSensoryData({
      productType: "منتج عادي (Regular)",
      scores: criteriaList.reduce((acc, curr) => ({ ...acc, [curr]: 8 }), {} as Record<string, number>)
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative pb-10">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">التقييم الحسي للمنتج</h2>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSensorySubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Star size={20} className="text-amber-500" />
            تقييم المنتج النهائي (مقياس 1-10)
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">نوع المنتج المستهدف</label>
              <select 
                required
                value={sensoryData.productType}
                onChange={(e) => setSensoryData({...sensoryData, productType: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>منتج عادي (Regular)</option>
                <option>منتج نباتي (Vegan)</option>
              </select>
            </div>
            {criteriaList.map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 w-1/3">{item}</span>
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={sensoryData.scores[item]}
                  onChange={(e) => setSensoryData({
                    ...sensoryData, 
                    scores: { ...sensoryData.scores, [item]: parseInt(e.target.value) }
                  })}
                  className="w-1/2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-blue-600 w-10 text-left" dir="ltr">{sensoryData.scores[item]} / 10</span>
              </div>
            ))}
            <button 
              type="submit" 
              disabled={sensoryLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 disabled:bg-blue-400"
            >
              {sensoryLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {sensoryLoading ? "جاري الحفظ..." : "حفظ التقييم الحسي"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
