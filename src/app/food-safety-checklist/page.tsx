"use client";

import React, { useState } from "react";
import { ClipboardCheck, Loader2, CheckCircle2 } from "lucide-react";

export default function FoodSafetyChecklistPage() {
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ type: "success", message });
    setTimeout(() => setToast(null), 3000);
  };

  const safetyCheckpoints = [
    { id: "hygiene", label: "النظافة الشخصية للعمال والتزامهم بالزي الموحد" },
    { id: "temp", label: "التحكم في درجات الحرارة للمناطق الباردة والساخنة" },
    { id: "pest", label: "فحص مكافحة الآفات (Pest Control) وخلو الصالة من الحشرات" },
    { id: "raw", label: "التعامل السليم مع الخامات والمواد الخام" },
    { id: "cross", label: "منع التلوث التبادلي (Cross-contamination Prevention)" },
    { id: "storage", label: "ظروف التخزين الجيدة للجاهز والخام (Storage Conditions)" },
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
    <div className="space-y-6 max-w-5xl mx-auto relative pb-10">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">اشتراطات سلامة الغذاء</h2>
      </div>

      <form onSubmit={handleSafetySubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
          <ClipboardCheck size={20} className="text-emerald-600" />
          نموذج اشتراطات سلامة الغذاء الشامل
        </h3>
        
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-right text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">الاشتراط / نقطة الفحص</th>
                <th className="px-4 py-3 text-center min-w-[250px]">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {safetyCheckpoints.map((check) => (
                <tr key={check.id} className="border-b border-slate-100 hover:bg-slate-50">
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
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" 
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
                          className="w-4 h-4 text-red-600 focus:ring-red-500" 
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
                          className="w-4 h-4 text-slate-500 focus:ring-slate-500" 
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-emerald-400 w-full md:w-auto"
            >
              {safetyLoading ? <Loader2 size={18} className="animate-spin" /> : <ClipboardCheck size={18} />}
              {safetyLoading ? "جاري الحفظ..." : "اعتماد وحفظ التقرير"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
