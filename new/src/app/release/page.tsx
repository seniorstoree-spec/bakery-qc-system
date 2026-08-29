"use client";

import React from "react";
import { CheckSquare, XCircle, FileSignature } from "lucide-react";
import { useRole } from "@/context/RoleContext";

export default function ReleasePage() {
  const { role } = useRole();
  const isManager = role === "Manager" || role === "Admin";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">الإفراج عن المنتج النهائي</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
        {/* Release Checklist */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
            معايير وشروط الإفراج
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <label className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded mt-0.5" disabled={!isManager} />
              <div>
                <span className="block text-sm font-medium text-slate-800">اكتمال سجلات الـ IPC</span>
                <span className="block text-xs text-slate-500">تم تسجيل كافة معايير التشغيل للتشغيلة الحالية.</span>
              </div>
            </label>
             <label className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded mt-0.5" disabled={!isManager} />
              <div>
                <span className="block text-sm font-medium text-slate-800">اجتياز نقاط CCP</span>
                <span className="block text-xs text-slate-500">لا توجد انحرافات غير معالجة في كاشف المعادن.</span>
              </div>
            </label>
             <label className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded mt-0.5" disabled={!isManager} />
              <div>
                <span className="block text-sm font-medium text-slate-800">المطابقة الحسية والوزنية</span>
                <span className="block text-xs text-slate-500">المنتج مطابق للأوزان ودرجة الحرارة المستهدفة.</span>
              </div>
            </label>
             <label className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded mt-0.5" disabled={!isManager} />
              <div>
                <span className="block text-sm font-medium text-slate-800">بيانات التغليف والتاريخ</span>
                <span className="block text-xs text-slate-500">تمت طباعة تاريخ الصلاحية ورقم التشغيلة بشكل صحيح.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Approval Section */}
        <div className="border-t border-slate-200 pt-6">
          {!isManager ? (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3 text-amber-800">
              <XCircle className="shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold">صلاحيات غير كافية</h4>
                <p className="text-sm mt-1">عذراً، صلاحية الإفراج عن المنتج النهائي وتوقيع النموذج تقتصر على <strong>مدير / رئيس قسم الجودة</strong>.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ملاحظات الإفراج</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                  rows={2} 
                  placeholder="أضف أي ملاحظات قبل اعتماد الإفراج..."
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
                  <CheckSquare size={20} />
                  اعتماد الإفراج (Approved)
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
                  <XCircle size={20} />
                  رفض وحجز المنتج (Hold / Rejected)
                </button>
              </div>
              <p className="text-xs text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
                <FileSignature size={14} /> توقيع إلكتروني مسجل باسم: مدير الجودة
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
