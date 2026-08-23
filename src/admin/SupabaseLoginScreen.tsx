import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck, Mail } from 'lucide-react';
import { AdminConfig } from './adminTypes';
import { signInWithSupabase } from '../lib/authService';

interface Props { config: AdminConfig; onLogin: (userId: string) => void | Promise<void>; }

export const SupabaseLoginScreen: React.FC<Props> = ({ config, onLogin }) => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [busy,setBusy]=useState(false);
  const submit=async(event:React.FormEvent)=>{
    event.preventDefault();
    if(!email.trim()||!password){window.alert('اكتب البريد الإلكتروني وكلمة المرور.');return;}
    setBusy(true);
    try{const {user}=await signInWithSupabase(email.trim(),password);await onLogin(user.id)}catch(error){const message=error instanceof Error?error.message:'تعذر تسجيل الدخول.';window.alert(`تعذر تسجيل الدخول: ${message}`)}finally{setBusy(false)}
  };
  return <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4"><div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-5 sm:p-7">
    <div className="flex items-center gap-3 mb-6">{config.appearance.logoDataUrl?<img src={config.appearance.logoDataUrl} alt="شعار التطبيق" className="w-12 h-12 rounded-2xl object-contain border border-slate-200 dark:border-slate-700"/>:<div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black">QC</div>}<div className="min-w-0"><h1 className="font-black text-lg text-slate-900 dark:text-white truncate">{config.content.appTitle}</h1><p className="text-xs text-slate-500 dark:text-slate-400">تسجيل الدخول الآمن</p></div></div>
    <form onSubmit={submit} className="space-y-4"><label className="block"><span className="text-xs font-bold text-slate-700 dark:text-slate-200">البريد الإلكتروني</span><div className="mt-1.5 relative"><Mail className="absolute right-3 top-3.5 w-4 h-4 text-slate-400"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="username" dir="ltr" className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pr-10 pl-3 outline-none focus:ring-2 focus:ring-rose-500" placeholder="name@example.com" disabled={busy}/></div></label><label className="block"><span className="text-xs font-bold text-slate-700 dark:text-slate-200">كلمة المرور</span><div className="mt-1.5 relative"><LockKeyhole className="absolute right-3 top-3.5 w-4 h-4 text-slate-400"/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="current-password" dir="ltr" className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pr-10 pl-3 outline-none focus:ring-2 focus:ring-rose-500" placeholder="••••••••" disabled={busy}/></div></label><button disabled={busy} className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-black flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4"/>{busy?'جارٍ التحقق...':'دخول'}</button></form>
    <p className="mt-4 text-[11px] leading-5 text-slate-500">الحساب يجب أن يكون موجودًا في Supabase Auth ومربوطًا بسجل المستخدم داخل النظام.</p>
  </div></div>;
};
