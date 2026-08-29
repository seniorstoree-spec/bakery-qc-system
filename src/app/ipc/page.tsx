"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Save, Loader2, CheckCircle2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    materialWeight: "",
    roomTemp: "",
    processTime: "",
    deviationNotes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.materialWeight || !formData.roomTemp || !formData.processTime) {
      setToast({ type: "error", message: "يرجى تعبئة الحقول الأساسية (الأوزان، الحرارة، الوقت)." });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);

    // Simulate API Database Upsert
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
      
      console.log("Saving IPC Record:", {
        stage: stages[activeTab],
        materialWeight: parseFloat(formData.materialWeight),
        roomTemp: parseFloat(formData.roomTemp),
        processTime: parseFloat(formData.processTime),
        deviationNotes: formData.deviationNotes,
        timestamp: new Date().toISOString(),
      });

      // Reset form
      setFormData({ materialWeight: "", roomTemp: "", processTime: "", deviationNotes: "" });
      
      setToast({ type: "success", message: `تم حفظ تقرير مرحلة ${stages[activeTab]} بنجاح.` });
    } catch (error) {
      console.error("Database Error:", error);
      setToast({ type: "error", message: "فشل حفظ البيانات. حاول مرة أخرى." });
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
        <h2 className="text-2xl font-bold text-slate-800">التحكم أثناء العملية (IPC)</h2>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "جاري الحفظ..." : "حفظ التقرير"}
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
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
            معايير مرحلة {stages[activeTab]}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  أوزان الخامات أو المادة المضافة (كجم)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.materialWeight}
                  onChange={(e) => setFormData({...formData, materialWeight: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="أدخل الوزن..."
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  درجة حرارة الصالة (°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.roomTemp}
                    onChange={(e) => setFormData({...formData, roomTemp: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2.5 pr-10 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="الحد الأمثل 22°C"
                    disabled={loading}
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
                  required
                  value={formData.processTime}
                  onChange={(e) => setFormData({...formData, processTime: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="أدخل الوقت..."
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ملاحظات الانحراف (إن وجدت)
                </label>
                <textarea
                  value={formData.deviationNotes}
                  onChange={(e) => setFormData({...formData, deviationNotes: e.target.value})}
                  className="w-full border border-red-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500 outline-none bg-red-50"
                  rows={2}
                  placeholder="سجل أي انحراف عن المعايير هنا..."
                  disabled={loading}
                ></textarea>
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> في حالة وجود انحراف، يجب تسجيل الإجراء التصحيحي.
                </p>
              </div>
            </div>
          </div>
          
          <button type="submit" className="hidden">Submit</button>
        </form>
      </div>
    </div>
  );
}
