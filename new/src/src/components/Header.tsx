"use client";

import React from "react";
import { useRole, Role } from "@/context/RoleContext";
import { Bell, UserCircle, Settings } from "lucide-react";

export default function Header() {
  const { role, setRole } = useRole();

  const roles: Role[] = ["Quality Engineer", "Manager", "Supervisor", "Admin"];

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800 hidden md:block">
          لوحة التحكم
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <label htmlFor="role-select" className="text-sm font-medium text-slate-600">
            تغيير الصلاحية:
          </label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="bg-slate-100 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === "Quality Engineer" && "مهندس جودة"}
                {r === "Manager" && "مدير / رئيس قسم"}
                {r === "Supervisor" && "مشرف إنتاج / أمين مخزن"}
                {r === "Admin" && "مدير النظام"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-slate-500 hover:text-slate-700 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="text-slate-500 hover:text-slate-700">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
            <UserCircle size={28} className="text-slate-400" />
            <div className="text-sm hidden sm:block">
              <p className="font-semibold text-slate-700">المستخدم الحالي</p>
              <p className="text-xs text-slate-500">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
