import React, { useState } from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import { authConfigured, developerLogin, getSession, clearSession, userLogin } from '../lib/authClient';

const DEVELOPER_EMAIL = 'esalm.kamel@elabdfoods.com';

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(() => getSession());
  const [mode, setMode] = useState<'user' | 'developer'>('user');
  const [email, setEmail] = useState(DEVELOPER_EMAIL);
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (session) return <div className="relative min-h-screen"><button type="button" onClick={() => { clearSession(); setSession(null); }} className="fixed bottom-3 left-3 z-[60] rounded-xl border bg-white px-3 py-2 text-xs font-bold shadow dark:bg-slate-900"><LogOut className="inline h-4 w-4 ml-1" />خروج</button>{children}</div>;

  const login = async () => {
    setError(''); setBusy(true);
    try { const result = mode === 'developer' ? await developerLogin(email.trim(), secret) : await userLogin(); setSession(result); }
    catch (e: any) { setError(e?.message || 'تعذر تسجيل الدخول.'); }
    finally { setBusy(false); }
  };

  return <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
    <div className="w-full max-w-md rounded-3xl border bg-white dark:bg-slate-900 p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center"><ShieldCheck /></div><div><h1 className="font-black text-lg">منظومة الجودة</h1><p className="text-xs text-slate-500">تسجيل الدخول للنظام</p></div></div>
      <div className="grid grid-cols-2 gap-2 mb-5"><button onClick={() => setMode('user')} className={`rounded-xl py-3 font-bold ${mode === 'user' ? 'bg-rose-600 text-white' : 'bg-slate-100'}`}>مستخدم</button><button onClick={() => setMode('developer')} className={`rounded-xl py-3 font-bold ${mode === 'developer' ? 'bg-rose-600 text-white' : 'bg-slate-100'}`}>مطور</button></div>
      {mode === 'developer' ? <div className="space-y-3"><input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full rounded-xl border px-3 py-3" placeholder="البريد الإلكتروني" /><input value={secret} onChange={e => setSecret(e.target.value)} type="password" className="w-full rounded-xl border px-3 py-3" placeholder="كلمة المرور" /></div> : <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">دخول المستخدمين متاح بدون كلمة مرور في المرحلة الحالية.</div>}
      {error && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}
      {!authConfigured && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">إعدادات Supabase غير موجودة في بيئة التشغيل.</div>}
      <button disabled={busy || !authConfigured} onClick={login} className="mt-5 w-full rounded-xl bg-rose-600 py-3 font-black text-white disabled:opacity-50">{busy ? 'جاري التحقق...' : mode === 'developer' ? 'دخول المطور' : 'الدخول إلى التطبيق'}</button>
    </div>
  </div>;
};
