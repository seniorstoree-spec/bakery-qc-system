import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { AdminConfig, ManagedUserRole } from './adminTypes';
import { loadAdminConfig } from './adminConfig';

const roleLabels: Record<ManagedUserRole, string> = {
  quality_engineer: 'مهندس جودة',
  quality_supervisor: 'مشرف',
  department_head: 'رئيس قسم',
  senior_quality: 'سنيور',
  quality_department_manager: 'مدير إدارة الجودة',
  deputy_quality_manager: 'نائب مدير الجودة',
};

export const AdminLogin: React.FC<{ onLogin: (userId?: string) => void }> = ({ onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const config = useMemo(() => loadAdminConfig(), []);
  const enabledUsers = Array.isArray(config.users) ? config.users.filter((u) => u.enabled) : [];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
          <div><h2 className="font-black text-lg">دخول النظام</h2><p className="text-xs text-slate-500">اختيار الحساب النشط</p></div>
        </div>
        <label className="block">
          <span className="text-xs font-bold text-slate-600">الحساب</span>
          <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="mt-2 w-full h-11 rounded-xl border px-3 bg-white dark:bg-slate-950">
            <option value="">اختار حسابك</option>
            {enabledUsers.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.title} — {roleLabels[u.position]}</option>)}
          </select>
          <span className="block mt-2 text-[11px] text-slate-500">لا يوجد باسورد للمستخدمين في المرحلة الحالية.</span>
        </label>
        <button onClick={() => onLogin(selectedUserId || undefined)} className="mt-5 w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" /> دخول
        </button>
      </div>
    </div>
  );
};

interface AdminPanelProps {
  config: AdminConfig;
  onChange: (next: AdminConfig) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, onChange, onLogout }) => {
  const [draft, setDraft] = useState<AdminConfig>(config);
  const [newUserName, setNewUserName] = useState('');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'sections' | 'appearance' | 'content'>('users');
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    try { onChange(draft); } finally { setIsSaving(false); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3"><h2 className="font-black text-xl">إدارة النظام</h2><button onClick={onLogout} className="px-4 py-2 rounded-xl border">خروج</button></div>
      <div className="flex gap-2 flex-wrap">{(['users','sections','appearance','content'] as const).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl ${activeTab===tab?'bg-rose-600 text-white':'bg-slate-100 dark:bg-slate-800'}`}>{tab}</button>)}</div>
      {activeTab==='users' && <div className="space-y-3"><input value={newUserName} onChange={e=>setNewUserName(e.target.value)} placeholder="اسم المستخدم" className="border rounded-xl px-3 py-2"/><input value={newUserTitle} onChange={e=>setNewUserTitle(e.target.value)} placeholder="المسمى الوظيفي" className="border rounded-xl px-3 py-2"/><div className="text-xs text-slate-500">الأدوار الحالية محفوظة كما هي ولا يتم تعديلها من هذه الشاشة.</div></div>}
      {activeTab==='sections' && <div className="text-sm">إعدادات الأقسام محفوظة في الإعدادات الحالية.</div>}
      {activeTab==='appearance' && <div className="text-sm">إعدادات المظهر محفوظة في الإعدادات الحالية.</div>}
      {activeTab==='content' && <div className="text-sm">إعدادات المحتوى محفوظة في الإعدادات الحالية.</div>}
      <button disabled={isSaving} onClick={save} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold">{isSaving?'جاري الحفظ...':'حفظ'}</button>
    </div>
  );
};
