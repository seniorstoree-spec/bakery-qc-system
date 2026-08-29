"use client";

import React, { useState } from "react";
import { Thermometer, Scale, Loader2, CheckCircle2 } from "lucide-react";

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState([
    { id: 1, time: "08:00", item: "كرواسون سادة", doughWeight: 65, bakedWeight: 58, finalWeight: 58, temp: 92 },
    { id: 2, time: "09:00", item: "باتيه جبنة", doughWeight: 80, bakedWeight: 70, finalWeight: 85, temp: 88 },
  ]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    item: "",
    doughWeight: "",
    bakedWeight: "",
    finalWeight: "",
    temp: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.item || !formData.doughWeight || !formData.bakedWeight || !formData.finalWeight || !formData.temp) {
      setToast({ type: "error", message: "يرجى تعبئة جميع الحقول المطلوبة." });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);

    // Simulate API call and DB insertion
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      
      const newRecord = {
        id: Date.now(),
        time: new Date().toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' }),
        item: formData.item,
        doughWeight: parseFloat(formData.doughWeight),
        bakedWeight: parseFloat(formData.bakedWeight),
        finalWeight: parseFloat(formData.finalWeight),
        temp: parseFloat(formData.temp),
      };

      setMeasurements([newRecord, ...measurements]);
      
      // Reset form
      setFormData({ item: "", doughWeight: "", bakedWeight: "", finalWeight: "", temp: "" });
      
      setToast({ type: "success", message: "تم الحفظ بنجاح" });
    } catch (error) {
      console.error("Database Error:", error);
      setToast({ type: "error", message: "حدث خطأ أثناء حفظ البيانات." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">تتبع الأوزان والحرارة</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Scale size={20} className="text-blue-600" />
            تسجيل قراءة جديدة
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الصنف</label>
              <input 
                type="text" 
                value={formData.item}
                onChange={(e) => setFormData({...formData, item: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="اسم المنتج..." 
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">وزن العجين (جم)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.doughWeight}
                  onChange={(e) => setFormData({...formData, doughWeight: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الوزن بعد الخبيز (جم)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.bakedWeight}
                  onChange={(e) => setFormData({...formData, bakedWeight: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الوزن النهائي/المحشو (جم)</label>
              <input 
                type="number" 
                step="0.1"
                value={formData.finalWeight}
                onChange={(e) => setFormData({...formData, finalWeight: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                <span>حرارة قلب المنتج (°C)</span>
                <span className="text-xs text-slate-500">الحد: ≥ 90°C</span>
              </label>
              <div className="relative">
                <Thermometer className="absolute right-3 top-2.5 text-slate-400" size={20} />
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.temp}
                  onChange={(e) => setFormData({...formData, temp: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 pr-10 focus:ring-blue-500 focus:border-blue-500" 
                  disabled={loading}
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  جاري الحفظ...
                </>
              ) : "حفظ القراءة"}
            </button>
          </div>
        </form>

        {/* Measurements Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">سجل القراءات اليومية</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">الوقت</th>
                  <th className="px-4 py-3">الصنف</th>
                  <th className="px-4 py-3 text-center">عجين</th>
                  <th className="px-4 py-3 text-center">مخبوز</th>
                  <th className="px-4 py-3 text-center">نهائي</th>
                  <th className="px-4 py-3 text-center">الحرارة</th>
                  <th className="px-4 py-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((m) => {
                  const isTempPass = m.temp >= 90;
                  return (
                    <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 whitespace-nowrap">{m.time}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{m.item}</td>
                      <td className="px-4 py-3 text-center">{m.doughWeight}g</td>
                      <td className="px-4 py-3 text-center">{m.bakedWeight}g</td>
                      <td className="px-4 py-3 text-center">{m.finalWeight}g</td>
                      <td className="px-4 py-3 text-center font-semibold" dir="ltr">
                        {m.temp}°C
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          isTempPass ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>
                          {isTempPass ? "مطابق" : "غير مطابق"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {measurements.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      لا توجد قراءات مسجلة بعد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
