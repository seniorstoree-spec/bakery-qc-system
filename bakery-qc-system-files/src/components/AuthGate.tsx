"use client";

import React, { FormEvent, ReactNode, useEffect, useState } from "react";
import { clearLabSession, getCurrentSession, signInLabUser, signOutLabUser, signUpLabUser, LabSession } from "../supabaseClient";

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LabSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [registerMode, setRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getCurrentSession()
      .then((current) => { if (active) setSession(current); })
      .catch(() => { if (active) setSession(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (registerMode) {
        const created = await signUpLabUser(email, password);
        if (created) {
          setSession(created);
          setMessage("تم إنشاء الحساب وتسجيل الدخول.");
        } else {
          setMessage("تم إرسال طلب إنشاء الحساب. لو تأكيد البريد الإلكتروني مفعّل، افتح رسالة التأكيد ثم سجّل الدخول.");
          setRegisterMode(false);
        }
      } else {
        setSession(await signInLabUser(email, password));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حصل خطأ غير متوقع.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try { await signOutLabUser(); } catch { clearLabSession(); }
    setSession(null);
    setPassword("");
    setMessage("");
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600" dir="rtl">جارٍ التحقق من حساب المعمل...</div>;
  }

  if (session) {
    return (
      <>
        <div className="fixed top-2 left-2 z-[100] flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-md" dir="ltr">
          <span className="max-w-40 truncate text-slate-600">{session.user.email}</span>
          <button onClick={logout} className="rounded-lg bg-slate-800 px-2.5 py-1.5 font-bold text-white hover:bg-slate-700">خروج</button>
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl space-y-5">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-700 text-white font-black text-lg">QC</div>
          <h1 className="text-2xl font-black text-slate-900">منظومة الجودة - المعمل</h1>
          <p className="text-sm text-slate-500">{registerMode ? "إنشاء حساب للوصول إلى سجلات المعمل المشتركة" : "سجّل الدخول للوصول إلى سجلات المعمل"}</p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-bold text-slate-700">البريد الإلكتروني</span>
          <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-rose-600" placeholder="name@example.com" dir="ltr" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-bold text-slate-700">كلمة المرور</span>
          <input type="password" required minLength={6} autoComplete={registerMode ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-rose-600" placeholder="6 أحرف على الأقل" dir="ltr" />
        </label>
        {message && <p role="status" className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">{message}</p>}
        <button disabled={busy} type="submit" className="w-full rounded-xl bg-rose-700 px-4 py-3 font-bold text-white transition hover:bg-rose-800 disabled:opacity-60">
          {busy ? "جارٍ التنفيذ..." : registerMode ? "إنشاء الحساب" : "تسجيل الدخول"}
        </button>
        <button type="button" onClick={() => { setRegisterMode(v => !v); setMessage(""); }} className="w-full text-sm font-bold text-rose-700 hover:text-rose-900">
          {registerMode ? "عندي حساب بالفعل — تسجيل الدخول" : "إنشاء حساب جديد"}
        </button>
        <p className="text-[11px] leading-5 text-slate-500">السجلات محفوظة في قاعدة بيانات مستقلة لقسم المعمل، ويستطيع المستخدمون المسجلون الدخول العمل على نفس البيانات.</p>
      </form>
    </div>
  );
}
