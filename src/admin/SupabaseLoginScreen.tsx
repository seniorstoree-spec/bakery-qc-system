import React, { useEffect, useState } from 'react';
import { ChevronDown, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { AdminConfig, LoginMode } from './adminTypes';
import { signInWithSupabase } from '../lib/authService';
import { supabase } from '../lib/supabase';

interface Props {
  config: AdminConfig;
  onLogin: (mode: LoginMode, userId?: string) => void | Promise<void>;
}

type LoginUser = { id: string; name: string; position: string | null; role: string | null; active: boolean };

export const SupabaseLoginScreen: React.FC<Props> = ({ config, onLogin }) => {
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState<LoginUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id,name,position,role,active')
          .eq('active', true)
          .order('name', { ascending: true });
        if (error) throw error;

        const remoteUsers = (data ?? []) as LoginUser[];
        const configUsers: LoginUser[] = config.users
          .filter((user) => user.enabled)
          .map((user) => ({
            id: user.id,
            name: user.name,
            position: user.position,
            role: user.role,
            active: true,
          }));

        // Merge the current admin configuration with Supabase records, preferring
        // Supabase records when the same user ID exists. This keeps the login list
        // aligned with the developer's saved user list while still supporting
        // users created directly in the database.
        const merged = [...configUsers, ...remoteUsers].filter((user, index, all) =>
          all.findIndex((candidate) => candidate.id === user.id) === index,
        );

        if (mounted) setUsers(merged);
      } catch (error) {
        console.error('Failed to load users:', error);
        if (mounted) {
          setUsers(config.users.filter((u) => u.enabled).map((user) => ({
            id: user.id,
            name: user.name,
            position: user.position,
            role: user.role,
            active: true,
          })));
        }
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    };
    void loadUsers();
    return () => { mounted = false; };
  }, [config.users]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (mode === 'user') {
      const selected = users.find((user) => user.id === selectedUserId);
      if (!selected || !selected.active) {
        window.alert('اختار اسم المستخدم أولاً.');
        return;
      }
      await onLogin('user', selected.id);
      return;
    }

    if (!email.trim() || !password) {
      window.alert('اكتب البريد الإلكتروني وكلمة المرور الخاصة بالمطور.');
      return;
    }

    setBusy(true);
    try {
      const { user, profile } = await signInWithSupabase(email.trim(), password);
      if (!profile.active) throw new Error('هذا الحساب غير مفعل. تواصل مع المطور.');
      const isDeveloper = profile.role === 'Developer' || profile.role === 'developer' || profile.position === 'System Admin';
      if (!isDeveloper) throw new Error('هذا الحساب ليس حساب مطور.');
      await onLogin('admin', user.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر تسجيل الدخول.';
      window.alert(`تعذر تسجيل الدخول: ${message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-6">
          {config.appearance.logoDataUrl ? <img src={config.appearance.logoDataUrl} alt="شعار التطبيق" className="w-12 h-12 rounded-2xl object-contain border border-slate-200 dark:border-slate-700" /> : <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black">QC</div>}
          <div className="min-w-0"><h1 className="font-black text-lg text-slate-900 dark:text-white truncate">{config.content.appTitle}</h1><p className="text-xs text-slate-500 dark:text-slate-400">تسجيل الدخول</p></div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
          <button type="button" onClick={() => setMode('user')} className={`rounded-xl py-2.5 text-sm font-bold ${mode === 'user' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>المستخدمون</button>
          <button type="button" onClick={() => setMode('admin')} className={`rounded-xl py-2.5 text-sm font-bold ${mode === 'admin' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>المطور</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'user' ? (
            <label className="block">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">اختار اسمك</span>
              <div className="mt-1.5 relative">
                <UserRound className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <ChevronDown className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} disabled={loadingUsers} className="w-full h-11 appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pr-10 pl-10 outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="">{loadingUsers ? 'جارٍ تحميل المستخدمين...' : 'اختار اسم المستخدم'}</option>
                  {users.map((user) => <option key={user.id} value={user.id}>{user.name}{user.position ? ` — ${user.position}` : ''}</option>)}
                </select>
              </div>
              <span className="block mt-2 text-[11px] text-slate-500">المستخدمون يدخلون باختيار الاسم فقط بدون كلمة مرور.</span>
            </label>
          ) : (
            <>
              <label className="block"><span className="text-xs font-bold text-slate-700 dark:text-slate-200">البريد الإلكتروني للمطور</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" dir="ltr" className="mt-1.5 w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 outline-none focus:ring-2 focus:ring-rose-500" placeholder="name@example.com" disabled={busy} /></label>
              <label className="block"><span className="text-xs font-bold text-slate-700 dark:text-slate-200">كلمة مرور المطور</span><div className="mt-1.5 relative"><LockKeyhole className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" /><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" dir="ltr" className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pr-10 pl-3 outline-none focus:ring-2 focus:ring-rose-500" placeholder="••••••••" disabled={busy} /></div></label>
            </>
          )}
          <button disabled={busy || (mode === 'user' && loadingUsers)} className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-black flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4" />{busy ? 'جارٍ التحقق...' : 'دخول'}</button>
        </form>
      </div>
    </div>
  );
};
