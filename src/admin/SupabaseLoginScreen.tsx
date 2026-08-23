import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck, Mail, Users, UserRound } from 'lucide-react';
import { AdminConfig, ManagedUser } from './adminTypes';
import { signInWithSupabase } from '../lib/authService';

interface Props {
  config: AdminConfig;
  onLogin: (userId: string) => void | Promise<void>;
  onUserLogin?: (user: ManagedUser) => void | Promise<void>;
}

export const SupabaseLoginScreen: React.FC<Props> = ({ config, onLogin, onUserLogin }) => {
  const [mode, setMode] = useState<'user' | 'developer'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [busy, setBusy] = useState(false);
  const enabledUsers = config.users.filter((u) => u.enabled);

  const submitDeveloper = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      window.alert('اكتب البريد الإلكتروني وكلمة المرور.');
      return;
    }
    setBusy(true);
    try {
      const { user } = await signInWithSupabase(email.trim(), password);
      await onLogin(user.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر تسجيل الدخول.';
      window.alert(`تعذر تسجيل الدخول: ${message}`);
    } finally {
      setBusy(false);
    }
  };

  const submitUser = async (event: React.FormEvent) => {
    event.preventDefault();
    const selected = enabledUsers.find((u) => u.id === userId);
    if (!selected) {
      window.alert('اختار اسم المستخدم أولاً.');
      return;
    }
    if (!onUserLogin) return;
    setBusy(true);
    try {
      await onUserLogin(selected);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر فتح حساب المستخدم.';
      window.alert(`تعذر الدخول: ${message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-6">
          {config.appearance.logoDataUrl ? (
            <img src={config.appearance.logoDataUrl} alt="شعار التطبيق" className="w-12 h-12 rounded-2xl object-contain border border-slate-200 dark:border-slate-700" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black">QC</div>
          )}
          <div className="min-w-0">
            <h1 className="font-black text-lg text-slate-900 dark:text-white truncate">{config.content.appTitle}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">بوابة الدخول إلى منظومة الجودة</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
          <button type="button" onClick={() => setMode('user')} className={`rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 ${mode === 'user' ? 'bg-white dark:bg-slate-700 shadow text-rose-700 dark:text-rose-300' : 'text-slate-500'}`}>
            <Users className="w-4 h-4" /> المستخدمين
          </button>
          <button type="button" onClick={() => setMode('developer')} className={`rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 ${mode === 'developer' ? 'bg-white dark:bg-slate-700 shadow text-indigo-700 dark:text-indigo-300' : 'text-slate-500'}`}>
            <ShieldCheck className="w-4 h-4" /> المطور
          </button>
        </div>

        {mode === 'user' ? (
          <form onSubmit={submitUser} className="space-y-4">
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 p-4">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-black text-sm">
                <UserRound className="w-4 h-4" /> دخول المستخدم
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">اختار اسمك من القائمة للدخول إلى النظام بالصلاحيات المحددة لك.</p>
            </div>
            <label className="block">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">اسم المستخدم</span>
              <select value={userId} onChange={(e) => setUserId(e.target.value)} disabled={busy} className="mt-1.5 w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-60">
                <option value="">اختار اسمك</option>
                {enabledUsers.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.title}</option>)}
              </select>
            </label>
            <button disabled={busy || !userId} className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-black flex items-center justify-center gap-2">
              <UserRound className="w-4 h-4" />{busy ? 'جارٍ الدخول...' : 'دخول المستخدم'}
            </button>
            {!enabledUsers.length && <p className="text-center text-xs text-amber-600">لا يوجد مستخدمون مفعّلون. أضف المستخدمين من حساب المطور.</p>}
          </form>
        ) : (
          <form onSubmit={submitDeveloper} className="space-y-4">
            <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-black text-sm">
                <ShieldCheck className="w-4 h-4" /> دخول المطور
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">دخول آمن باستخدام Supabase Auth لإدارة المستخدمين والإعدادات.</p>
            </div>
            <label className="block">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">البريد الإلكتروني</span>
              <div className="mt-1.5 relative"><Mail className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" /><input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="username" dir="ltr" className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pr-10 pl-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="name@example.com" disabled={busy} /></div>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">كلمة المرور</span>
              <div className="mt-1.5 relative"><LockKeyhole className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" /><input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="current-password" dir="ltr" className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pr-10 pl-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" disabled={busy} /></div>
            </label>
            <button disabled={busy} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4" />{busy ? 'جارٍ التحقق...' : 'دخول المطور'}</button>
          </form>
        )}
      </div>
    </div>
  );
};
