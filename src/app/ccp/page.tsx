"use client";

import React, { useState } from "react";
import { ShieldAlert, Plus, Loader2, CheckCircle2 } from "lucide-react";

interface MetalLog {
  id: number;
  time: string;
  fe: boolean;
  nfe: boolean;
  ss: boolean;
  inspector: string;
}

export default function CCPPage() {
  const [activeTab, setActiveTab] = useState("metal");
  
  // Data State
  const [metalLogs, setMetalLogs] = useState<MetalLog[]>([
    { id: 1, time: "08:00", fe: true, nfe: true, ss: true, inspector: "أحمد محمد" },
    { id: 2, time: "09:00", fe: true, nfe: true, ss: true, inspector: "أحمد محمد" },
  ]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fe: false,
    nfe: false,
    ss: false,
    inspector: "",
  });

  const handleMetalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.inspector) {
      setToast({ type: "error", message: "يرجى إدخال اسم القائم بالفحص." });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay
      
      const newLog: MetalLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' }),
        fe: formData.fe,
        nfe: formData.nfe,
        ss: formData.ss,
        inspector: formData.inspector,
      };

      setMetalLogs([...metalLogs, newLog]);
      setFormData({ fe: false, nfe: false, ss: false, inspector: "" });
      
      setToast({ type: "success", message: "تم تسجيل فحص جهاز كشف المعادن بنجاح." });
    } catch (error) {
      console.error("Database Error:", error);
      setToast({ type: "error", message: "فشل حفظ البيانات. يرجى المحاولة مرة أخرى." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

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

              {/* Add New Log Form */}
              <form onSubmit={handleMetalSubmit} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-4">تسجيل فحص جديد (الساعة الحالية)</h4>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-slate-700 mb-2">القائم بالفحص</label>
                    <input 
                      type="text" 
                      required
                      value={formData.inspector}
                      onChange={(e) => setFormData({...formData, inspector: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="اسم المفتش..." 
                      disabled={loading}
                    />
                  </div>
                  <div className="flex items-center gap-6 pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.fe}
                        onChange={(e) => setFormData({...formData, fe: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded" 
                        disabled={loading}
                      />
                      <span className="text-sm font-medium">Fe (2.5mm) اجتاز</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.nfe}
                        onChange={(e) => setFormData({...formData, nfe: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded" 
                        disabled={loading}
                      />
                      <span className="text-sm font-medium">NFe (3.0mm) اجتاز</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.ss}
                        onChange={(e) => setFormData({...formData, ss: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded" 
                        disabled={loading}
                      />
                      <span className="text-sm font-medium">S.S (3.5mm) اجتاز</span>
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:bg-slate-500"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    {loading ? "جاري الحفظ..." : "حفظ الفحص"}
                  </button>
                </div>
              </form>

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
                    {metalLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 font-medium">{log.time}</td>
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" checked={log.fe} readOnly />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" checked={log.nfe} readOnly />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" checked={log.ss} readOnly />
                        </td>
                        <td className="px-4 py-3">{log.inspector}</td>
                      </tr>
                    ))}
                    {metalLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          لا توجد فحوصات مسجلة اليوم.
                        </td>
                      </tr>
                    )}
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
