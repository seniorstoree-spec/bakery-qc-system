"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  AlertTriangle, 
  Thermometer, 
  ShieldCheck, 
  Eye, 
  CheckSquare,
  Sparkles,
  ClipboardCheck
} from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "الرئيسية", href: "/", icon: LayoutDashboard },
    { name: "التحكم أثناء العملية (IPC)", href: "/ipc", icon: ClipboardList },
    { name: "تسجيل عيوب الجودة", href: "/defects", icon: AlertTriangle },
    { name: "تتبع الأوزان والحرارة", href: "/measurements", icon: Thermometer },
    { name: "النقاط الحرجة (CCP / OPRP)", href: "/ccp", icon: ShieldCheck },
    { name: "التقييم الحسي", href: "/sensory", icon: Eye },
    { name: "نموذج متابعة النظافة", href: "/cleaning-log", icon: Sparkles },
    { name: "اشتراطات سلامة الغذاء", href: "/food-safety-checklist", icon: ClipboardCheck },
    { name: "الإفراج عن المنتج النهائي", href: "/release", icon: CheckSquare },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col hidden lg:flex shrink-0">
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <h2 className="text-lg font-bold text-white tracking-wide">
          الجودة - قسم المخابز
        </h2>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        الإصدار 1.1.0
      </div>
    </aside>
  );
}
