"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

export default function CleaningLogPage() {
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ type: "success", message });
    setTimeout(() => setToast(null), 3000);
  };

  const [cleaningLoading, setCleaningLoading] = useState(false);
  const [cleaningData, setCleaningData] = useState({
    equipmentName: "",
    frequency: "يومي",
    agent: "",
    concentration: "",
    contactTime: "",
    status: "مقبول",
    correctiveAction: "",
    inspectorName: "",
  });

  const handleCleaningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCleaningLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCleaningLoading(false);
    showToast("تم حفظ تقرير النظافة والتطهير بنجاح.");
    setCleaningData({
      equipmentName: "",
      frequency: "يومي",
      agent: "",
      concentration: "",
      contactTime: "",
      status: "مقبول",
      correctiveAction: "",
      inspectorName: "",
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative pb-10">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">متابعة النظافة والتطهير</h2>
      </div>

      <form onSubmit={handleCleaningSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
          <Sparkles size={20} className="text-blue-500" />
          نموذج متابعة النظافة والتطهير
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">اسم المعدة / المنطقة</label>
              <input 
                type="text" required
                value={cleaningData.equipmentName}
                onChange={(e) => setCleaningData({...cleaningData, equipmentName: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">تكرار النظافة</label>
              <select 
                value={cleaningData.frequency}
                onChange={(e) => setCleaningData({...cleaningData, frequency: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
              >
                <option>يومي</option>
                <option>أسبوعي</option>
                <option>شهري</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">المادة المستعملة للتنظيف</label>
              <input 
                type="text" required
                value={cleaningData.agent}
                onChange={(e) => setCleaningData({...cleaningData, agent: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">التركيز (Dose)</label>
              <input 
                type="text" required
                value={cleaningData.concentration}
                onChange={(e) => setCleaningData({...cleaningData, concentration: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">زمن التلامس</label>
              <input 
                type="text" required
                value={cleaningData.contactTime}
                onChange={(e) => setCleaningData({...cleaningData, contactTime: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">حالة النظافة (فحص بصري)</label>
              <select 
                value={cleaningData.status}
                onChange={(e) => setCleaningData({...cleaningData, status: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
              >
                <option>مقبول</option>
                <option>غير مقبول</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">اسم المفتش</label>
              <input 
                type="text" required
                value={cleaningData.inspectorName}
                onChange={(e) => setCleaningData({...cleaningData, inspectorName: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">الإجراء التصحيحي (إن وجد)</label>
              <textarea 
                value={cleaningData.correctiveAction}
                onChange={(e) => setCleaningData({...cleaningData, correctiveAction: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
                rows={2}
                placeholder="يسجل في حالة كانت النظافة غير مقبولة..."
              ></textarea>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={cleaningLoading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 disabled:bg-blue-400"
          >
            {cleaningLoading ? <Loader2 size={18} className="animate-spin" /> : null}
            {cleaningLoading ? "جاري الحفظ..." : "حفظ نموذج النظافة"}
          </button>
        </div>
      </form>
    </div>
  );
}
