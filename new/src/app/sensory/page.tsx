"use client";

import React, { useState } from "react";
import { Star, ClipboardCheck, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

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

  // --- Form 2: Cleaning & Disinfection ---
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

  // --- Form 3: Food Safety Requirements ---
  const safetyCheckpoints = [
    { id: "hygiene", label: "النظافة الشخصية للعمال" },
    { id: "temp", label: "التحكم في درجات الحرارة" },
    { id: "pest", label: "فحص مكافحة الآفات" },
    { id: "raw", label: "التعامل مع الخامات" },
    { id: "cross", label: "منع التلوث التبادلي" },
    { id: "storage", label: "ظروف التخزين" },
  ];
  const [safetyLoading, setSafetyLoading] = useState(false);
  const [safetyData, setSafetyData] = useState({
    checks: safetyCheckpoints.reduce((acc, curr) => ({ ...acc, [curr.id]: "مطابق" }), {} as Record<string, string>),
    notes: "",
    inspectorName: "",
  });

  const handleSafetySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSafetyLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSafetyLoading(false);
    showToast("تم حفظ تقرير اشتراطات سلامة الغذاء بنجاح.");
    setSafetyData({
      checks: safetyCheckpoints.reduce((acc, curr) => ({ ...acc, [curr.id]: "مطابق" }), {} as Record<string, string>),
      notes: "",
      inspectorName: "",
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
        <h2 className="text-2xl font-bold text-slate-800">التقييم الحسي والسلامة والمتابعة</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form 1: Sensory Evaluation */}
        <form onSubmit={handleSensorySubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
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

        {/* Form 2: Cleaning & Disinfection Tracking */}
        <form onSubmit={handleCleaningSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-500" />
            نموذج متابعة النظافة والتطهير
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم المعدة / المنطقة</label>
                <input 
                  type="text" required
                  value={cleaningData.equipmentName}
                  onChange={(e) => setCleaningData({...cleaningData, equipmentName: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">المادة المستعملة</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">حالة النظافة</label>
                <select 
                  value={cleaningData.status}
                  onChange={(e) => setCleaningData({...cleaningData, status: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                >
                  <option>مقبول</option>
                  <option>غير مقبول</option>
                </select>
              </div>
              <div>
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

      {/* Form 3: Food Safety Requirements */}
      <form onSubmit={handleSafetySubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
          <ClipboardCheck size={20} className="text-emerald-600" />
          نموذج اشتراطات سلامة الغذاء
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-right text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">الاشتراط / نقطة الفحص</th>
                <th className="px-4 py-3 text-center">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {safetyCheckpoints.map((check) => (
                <tr key={check.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{check.label}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-4">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name={check.id} 
                          value="مطابق"
                          checked={safetyData.checks[check.id] === "مطابق"}
                          onChange={(e) => setSafetyData({
                            ...safetyData, 
                            checks: { ...safetyData.checks, [check.id]: e.target.value }
                          })}
                          className="w-4 h-4 text-emerald-600" 
                        />
                        <span className="text-emerald-700 font-medium text-xs">مطابق</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name={check.id} 
                          value="غير مطابق"
                          checked={safetyData.checks[check.id] === "غير مطابق"}
                          onChange={(e) => setSafetyData({
                            ...safetyData, 
                            checks: { ...safetyData.checks, [check.id]: e.target.value }
                          })}
                          className="w-4 h-4 text-red-600" 
                        />
                        <span className="text-red-700 font-medium text-xs">غير مطابق</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name={check.id} 
                          value="لا ينطبق"
                          checked={safetyData.checks[check.id] === "لا ينطبق"}
                          onChange={(e) => setSafetyData({
                            ...safetyData, 
                            checks: { ...safetyData.checks, [check.id]: e.target.value }
                          })}
                          className="w-4 h-4 text-slate-500" 
                        />
                        <span className="text-slate-600 font-medium text-xs">لا ينطبق</span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم المفتش</label>
            <input 
              type="text" required
              value={safetyData.inspectorName}
              onChange={(e) => setSafetyData({...safetyData, inspectorName: e.target.value})}
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="الاسم الكامل..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ملاحظات إضافية</label>
            <input 
              type="text" 
              value={safetyData.notes}
              onChange={(e) => setSafetyData({...safetyData, notes: e.target.value})}
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="أضف أي ملاحظات هنا..."
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
             <button 
              type="submit" 
              disabled={safetyLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-emerald-400"
            >
              {safetyLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {safetyLoading ? "جاري حفظ التقرير..." : "اعتماد وحفظ نموذج السلامة"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
