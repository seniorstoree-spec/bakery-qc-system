"use client";

import React from "react";
import Link from "next/link";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Sparkles, ClipboardCheck } from "lucide-react";

// Mock Data
const tempChartData = [
  { time: "08:00", temp: 92, limit: 90 },
  { time: "09:00", temp: 94, limit: 90 },
  { time: "10:00", temp: 91, limit: 90 },
  { time: "11:00", temp: 89, limit: 90 },
  { time: "12:00", temp: 95, limit: 90 },
  { time: "13:00", temp: 93, limit: 90 },
];

const sensoryData = [
  { subject: "المظهر الخارجي", A: 9, fullMark: 10 },
  { subject: "القوام الداخلي", A: 8, fullMark: 10 },
  { subject: "التلميع", A: 9, fullMark: 10 },
  { subject: "الحشو", A: 7, fullMark: 10 },
  { subject: "الطعم", A: 8, fullMark: 10 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">إجمالي العينات (اليوم)</p>
            <p className="text-2xl font-bold text-slate-800">142</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">نسبة المطابقة</p>
            <p className="text-2xl font-bold text-emerald-600">96.5%</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">انحرافات حرجة (CCP)</p>
            <p className="text-2xl font-bold text-red-600">2</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">حالة الإفراج</p>
            <p className="text-xl font-bold text-amber-600">قيد الانتظار</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Quick Access Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/cleaning-log" className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-xl shadow-sm flex items-center justify-between transition-transform transform hover:-translate-y-1">
          <div>
            <h3 className="text-lg font-bold mb-1">نموذج النظافة والتطهير</h3>
            <p className="text-blue-100 text-sm">أضف سجل فحص النظافة اليومي للمعدات والمناطق</p>
          </div>
          <Sparkles size={32} className="text-blue-200" />
        </Link>
        <Link href="/food-safety-checklist" className="bg-emerald-600 hover:bg-emerald-700 text-white p-5 rounded-xl shadow-sm flex items-center justify-between transition-transform transform hover:-translate-y-1">
          <div>
            <h3 className="text-lg font-bold mb-1">اشتراطات سلامة الغذاء</h3>
            <p className="text-emerald-100 text-sm">أضف تقرير التفتيش عن الممارسات الصحية الجيدة (GHP)</p>
          </div>
          <ClipboardCheck size={32} className="text-emerald-200" />
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Temperature Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            درجة حرارة قلب المنتج (الحد الحرج ≥ 90°C)
          </h3>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temp" name="درجة الحرارة" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="limit" name="الحد الحرج" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensory Evaluation Radar */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            ملخص التقييم الحسي
          </h3>
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sensoryData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar name="المنتج الحالي" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
