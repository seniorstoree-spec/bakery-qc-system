import React, { useEffect, useMemo, useState } from 'react';
import { Settings, UserPlus, Trash2, Save, Type, Image as ImageIcon, LockKeyhole, LogOut, ShieldCheck } from 'lucide-react';
import { AdminConfig, ADMIN_PASSWORD, LoginMode, ManagedUser, ManagedUserRole, SESSION_STORAGE_KEY } from './adminTypes';
import { saveAdminConfig } from './adminConfig';

interface LoginScreenProps {
  onLogin: (mode: LoginMode, userId?: string) => void;
  config: AdminConfig;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, config }) => {
  const [mode, setMode] = useState<LoginMode>('user');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const enabledUsers = config.users.filter((u) => u.enabled);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'admin') {
      if (password === ADMIN_PASSWORD) onLogin('admin');
      else window.alert('كلمة مرور المطور غير صحيحة.');
      return;
    }
    if (!userId) {
      window.alert('اختار المستخدم أولاً.');
      return;
    }
    onLogin('user', userId);
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
            <p className="text-xs text-slate-500 dark:text-slate-400">تسجيل الدخول</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
          <button type="button" onClick={() => setMode('user')} className={`rounded-xl py-2.5 text-sm font-bold ${mode === 'user' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>مستخدم</button>
          <button type="button" onClick={() => setMode('admin')} className={`rounded-xl py-2.5 text-sm font-bold ${mode === 'admin' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>المطور</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'admin' ? (
            <label className="block">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">كلمة مرور المطور</span>
              <div className="mt-1.5 relative">
                <LockKeyhole className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pr-10 pl-3 outline-none focus:ring-2 focus:ring-rose-500" placeholder="كلمة المرور" />
              </div>
              <span className="block mt-2 text-[11px] text-amber-600">الوضع الحالي يستخدم كلمة مرور محلية مؤقتة حسب طلبك.</span>
            </label>
          ) : (
            <label className="block">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">اختيار المستخدم</span>
              <select value={userId} onChange={(e) => setUserId(e.target.value)} className="mt-1.5 w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 outline-none focus:ring-2 focus:ring-rose-500">
                <option value="">اختار حسابك</option>
                {enabledUsers.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.title}</option>)}
              </select>
              <span className="block mt-2 text-[11px] text-slate-500">لا يوجد باسورد للمستخدمين في المرحلة الحالية.</span>
            </label>
          )}

          <button className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> دخول
          </button>
        </form>
      </div>
    </div>
  );
};

const roleLabels: Record<ManagedUserRole, string> = {
  quality_engineer: 'مهندس جودة',
  quality_supervisor: 'مشرف',
  department_head: 'رئيس قسم',
  senior_quality: 'سنيور',
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

  useEffect(() => setDraft(config), [config]);

  const persist = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const saved = await saveAdminConfig(draft);
      onChange(saved);
      window.alert('تم حفظ إعدادات المستخدمين والتأكد من تخزينها بنجاح.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'حدث خطأ غير معروف أثناء الحفظ.';
      window.alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const addUser = () => {
    if (!newUserName.trim()) return;
    const newUser: ManagedUser = {
      id: `managed-${Date.now()}`,
      name: newUserName.trim(),
      title: newUserTitle.trim() || 'مستخدم جودة',
      department: 'إدارة الجودة',
      role: 'quality_engineer',
      position: 'quality_engineer',
      enabled: true,
      permissions: {
        canEnterData: true,
        canApproveRelease: false,
        canEditCriticalLimits: false,
        canManageUsers: false,
        canExportReports: true,
        canSignOff: true,
      },
    };
    setDraft((p) => ({ ...p, users: [newUser, ...p.users] }));
    setNewUserName('');
    setNewUserTitle('');
  };

  const updateUser = (id: string, patch: Partial<ManagedUser>) => {
    setDraft((p) => ({ ...p, users: p.users.map((u) => u.id === id ? { ...u, ...patch } : u) }));
  };

  const removeUser = (id: string) => {
    if (!window.confirm('حذف هذا المستخدم؟')) return;
    setDraft((p) => ({ ...p, users: p.users.filter((u) => u.id !== id) }));
  };

  const updateSection = (id: string, patch: Partial<AdminConfig['sections'][number]>) => {
    setDraft((p) => ({ ...p, sections: p.sections.map((s) => s.id === id ? { ...s, ...patch } : s) }));
  };

  const contentRows = useMemo(() => Object.entries(draft.content), [draft.content]);

  return (
    <div dir="rtl" className="fixed inset-0 z-[80] bg-slate-950/40 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center"><Settings className="w-5 h-5" /></div>
            <div className="min-w-0"><h2 className="font-black text-base sm:text-lg truncate">إدارة التطبيق</h2><p className="text-[11px] sm:text-xs text-slate-500">حساب المطور — إدارة المستخدمين والمحتوى والمظهر</p></div>
          </div>
          <button onClick={onLogout} className="shrink-0 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center gap-1.5"><LogOut className="w-4 h-4" /> خروج</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-slate-50 dark:bg-slate-950">
          {([['users', 'المستخدمين'], ['sections', 'الأقسام'], ['appearance', 'المظهر'], ['content', 'النصوص']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`rounded-xl py-2.5 text-xs sm:text-sm font-black ${activeTab === id ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}>{label}</button>
          ))}
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {activeTab === 'users' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                <input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="اسم المستخدم" className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 px-3 bg-white dark:bg-slate-950" />
                <input value={newUserTitle} onChange={(e) => setNewUserTitle(e.target.value)} placeholder="المسمى الوظيفي" className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 px-3 bg-white dark:bg-slate-950" />
                <button type="button" onClick={addUser} className="h-10 px-4 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2"><UserPlus className="w-4 h-4" /> إضافة</button>
              </div>

              <div className="space-y-3">
                {draft.users.map((user) => (
                  <div key={user.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 items-center">
                      <input value={user.name} onChange={(e) => updateUser(user.id, { name: e.target.value })} className="h-9 rounded-lg border px-2 bg-transparent text-sm font-bold" />
                      <input value={user.title} onChange={(e) => updateUser(user.id, { title: e.target.value })} className="h-9 rounded-lg border px-2 bg-transparent text-sm" />
                      <select value={user.position} onChange={(e) => updateUser(user.id, { position: e.target.value as ManagedUserRole })} className="h-9 rounded-lg border px-2 bg-transparent text-sm">
                        {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                      <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={user.enabled} onChange={(e) => updateUser(user.id, { enabled: e.target.checked })} /> فعال</label>
                      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={user.permissions.canEnterData} onChange={(e) => updateUser(user.id, { permissions: { ...user.permissions, canEnterData: e.target.checked } })} /> إدخال بيانات</label>
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => removeUser(user.id)} className="p-2 rounded-lg bg-red-50 text-red-600" title="حذف"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-2">
              {draft.sections.map((section) => (
                <div key={section.id} className="grid grid-cols-[1fr_auto] gap-3 items-center p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <input value={section.label} onChange={(e) => updateSection(section.id, { label: e.target.value })} className="h-10 rounded-xl border px-3 bg-transparent font-bold" />
                  <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={section.visible} onChange={(e) => updateSection(section.id, { visible: e.target.checked })} /> ظاهر</label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block"><span className="text-xs font-bold">لون أساسي</span><div className="mt-1.5 flex gap-2"><input type="color" value={draft.appearance.primaryColor} onChange={(e) => setDraft((p) => ({ ...p, appearance: { ...p.appearance, primaryColor: e.target.value } }))} className="w-12 h-10 rounded-lg" /><input value={draft.appearance.primaryColor} onChange={(e) => setDraft((p) => ({ ...p, appearance: { ...p.appearance, primaryColor: e.target.value } }))} className="flex-1 h-10 rounded-xl border px-3 bg-transparent" /></div></label>
              <label className="block"><span className="text-xs font-bold">لون مساعد</span><div className="mt-1.5 flex gap-2"><input type="color" value={draft.appearance.accentColor} onChange={(e) => setDraft((p) => ({ ...p, appearance: { ...p.appearance, accentColor: e.target.value } }))} className="w-12 h-10 rounded-lg" /><input value={draft.appearance.accentColor} onChange={(e) => setDraft((p) => ({ ...p, appearance: { ...p.appearance, accentColor: e.target.value } }))} className="flex-1 h-10 rounded-xl border px-3 bg-transparent" /></div></label>
              <label className="block"><span className="text-xs font-bold">Font</span><div className="mt-1.5 flex items-center gap-2"><Type className="w-4 h-4 text-slate-400" /><select value={draft.appearance.fontFamily} onChange={(e) => setDraft((p) => ({ ...p, appearance: { ...p.appearance, fontFamily: e.target.value } }))} className="flex-1 h-10 rounded-xl border px-3 bg-transparent"><option value="system-ui">System UI</option><option value="Arial">Arial</option><option value="Tahoma">Tahoma</option><option value="Cairo, sans-serif">Cairo</option></select></div></label>
              <div><span className="text-xs font-bold">اللوجو</span><label className="mt-1.5 flex items-center justify-center gap-2 h-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 cursor-pointer"><ImageIcon className="w-5 h-5" /><span className="text-xs text-slate-500">رفع صورة</span><input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setDraft((p) => ({ ...p, appearance: { ...p.appearance, logoDataUrl: String(reader.result) } })); reader.readAsDataURL(file); }} /></label></div>
              {draft.appearance.logoDataUrl && <div className="md:col-span-2 flex items-center gap-3"><img src={draft.appearance.logoDataUrl} alt="الشعار" className="w-20 h-20 object-contain rounded-2xl border" /><span className="text-xs text-slate-500">سيتم استخدام الصورة الجديدة في شاشة الدخول والهوية البصرية.</span></div>}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-3">
              {contentRows.map(([key, value]) => (
                <label key={key} className="block"><span className="text-xs font-bold">{key}</span><input value={value} onChange={(e) => setDraft((p) => ({ ...p, content: { ...p.content, [key]: e.target.value } }))} className="mt-1.5 w-full h-10 rounded-xl border px-3 bg-transparent" /></label>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button type="button" onClick={persist} disabled={isSaving} className="px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-wait text-white font-black flex items-center gap-2">
            <Save className="w-4 h-4" /> {isSaving ? 'جاري الحفظ والتحقق...' : 'حفظ التعديلات'}
          </button>
        </div>
      </div>
    </div>
  );
};

export function getSession(): { mode: LoginMode; userId?: string } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session: { mode: LoginMode; userId?: string }) {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
