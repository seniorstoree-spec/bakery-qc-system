import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { loadAdminConfig } from '../../admin/adminConfig';
import { ManagedUserRole } from '../../admin/adminTypes';
import { UserRole } from '../../types';
import { Shield, Check, Key } from 'lucide-react';

interface RoleSwitcherModalProps { isOpen:boolean; onClose:()=>void; }
const POSITION_TO_ROLE:Record<ManagedUserRole,UserRole>={quality_engineer:'quality_engineer',quality_supervisor:'production_supervisor',department_head:'quality_manager',senior_quality:'quality_engineer'};
const BADGES:Record<ManagedUserRole,{label:string;color:string;desc:string}>={
 quality_engineer:{label:'مهندس جودة (Quality Engineer)',color:'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',desc:'تسجيل البيانات اليومية ومتابعة درجات الحرارة والأوزان وعيوب الجودة'},
 quality_supervisor:{label:'مشرف (Supervisor)',color:'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',desc:'عرض ومتابعة البيانات حسب الصلاحيات المحددة من المطور'},
 department_head:{label:'رئيس قسم (Department Head)',color:'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',desc:'مراجعة التقارير والاعتمادات حسب الصلاحيات المحددة من المطور'},
 senior_quality:{label:'سنيور جودة (Senior Quality)',color:'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800',desc:'صلاحيات جودة متقدمة وفق إعدادات المطور'},
};
export const RoleSwitcherModal:React.FC<RoleSwitcherModalProps>=({isOpen,onClose})=>{
 const {currentUser,setCurrentUserProfile}=useApp();
 const managedUsers=useMemo(()=>{const config=loadAdminConfig();return (Array.isArray(config.users)?config.users:[]).filter(u=>u.enabled&&BADGES[u.position])},[isOpen]);
 if(!isOpen)return null;
 const applyManagedUser=(u:(typeof managedUsers)[number])=>{setCurrentUserProfile({...u,role:POSITION_TO_ROLE[u.position]});};
 const activeManagedUser=managedUsers.find(u=>u.id===currentUser.id);
 return <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overscroll-contain">
  <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] my-auto overflow-hidden flex flex-col">
   <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3"><div className="flex items-start gap-3 min-w-0"><div className="shrink-0 w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center"><Shield className="w-5 h-5"/></div><div className="min-w-0"><h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">محاكي الصلاحيات وأدوار المستخدمين (RBAC)</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">الحسابات والصلاحيات مأخوذة من إعدادات المطور المحفوظة مركزيًا</p></div></div><button onClick={onClose} className="shrink-0 text-slate-400 p-2 rounded-xl" aria-label="إغلاق">✕</button></div>
   <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar p-3 sm:p-5 space-y-3">
    {managedUsers.length===0&&<div className="p-6 text-center text-sm text-slate-500">لا يوجد مستخدمون فعالون.</div>}
    {managedUsers.map(user=>{const badge=BADGES[user.position];const selected=currentUser.id===user.id;return <button type="button" key={user.id} onClick={()=>applyManagedUser(user)} className={`w-full text-right p-3 sm:p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-colors ${selected?'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-md':'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-rose-300'}`}><div className="shrink-0 pt-1">{selected?<div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center"><Check className="w-4 h-4"/></div>:<div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600"/>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base break-words">{user.name}</span><span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold border ${badge.color}`}>{badge.label}</span></div><div className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words">{user.title} • {user.department}</div><p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-5 break-words">{badge.desc}</p></div></button>})}
    {activeManagedUser&&<div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2"><div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200"><Key className="w-4 h-4 text-amber-500"/>صلاحيات الحساب النشط حالياً ({activeManagedUser.name})</div><div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-2">{([['canEnterData','إدخال البيانات اليومية'],['canApproveRelease','اعتماد إذن الإفراج النهائي'],['canEditCriticalLimits','تعديل الحدود الحرجة'],['canSignOff','التوقيع الإلكتروني'],['canExportReports','تصدير وطباعة التقارير'],['canManageUsers','إدارة النظام والمستخدمين']] as const).map(([key,label])=><div key={key} className={`p-2 rounded-lg border flex items-start gap-1.5 ${activeManagedUser.permissions[key]?'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300':'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'}`}><Check className="w-3.5 h-3.5 shrink-0 mt-0.5"/><span>{label}</span></div>)}</div></div>}
   </div>
   <div className="shrink-0 px-3 sm:px-6 py-3 sm:py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end"><button onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold">تطبيق ومتابعة</button></div>
  </div>
 </div>;
};
