import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BakerySectionDef, CriticalLimitsConfig, RawMaterialRecipe, UserProfile } from '../../types';
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Sliders, 
  Scale, 
  Users, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Sparkles,
  Flame,
  Save,
  RotateCcw
} from 'lucide-react';

interface DeveloperDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperDashboardModal: React.FC<DeveloperDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    isDevUnlocked,
    verifyDevPassword,
    lockDevMode,
    sections,
    addSection,
    updateSection,
    deleteSection,
    criticalLimits,
    updateCriticalLimits,
    recipesList,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    usersList,
    addUser,
    updateUser,
    deleteUser,
    resetAllData
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeDevTab, setActiveDevTab] = useState<'sections' | 'recipes' | 'limits' | 'users' | 'database'>('sections');

  // New Section Form State
  const [newSecName, setNewSecName] = useState('');
  const [newSecSubtitle, setNewSecSubtitle] = useState('');
  const [newSecDesc, setNewSecDesc] = useState('');

  // Editing Section State
  const [editingSecId, setEditingSecId] = useState<number | null>(null);
  const [editSecName, setEditSecName] = useState('');
  const [editSecSubtitle, setEditSecSubtitle] = useState('');

  // Critical limits local state
  const [limitsForm, setLimitsForm] = useState<CriticalLimitsConfig>(criticalLimits);

  // New Recipe State
  const [newRecipeForm, setNewRecipeForm] = useState<RawMaterialRecipe>({
    sectionId: 1,
    productName: '',
    flour_kg: 50,
    butter_kg: 5,
    pasteurized_eggs_kg: 10,
    powdered_milk_kg: 2,
    sugar_kg: 5,
    salt_gm: 500,
    yeast_gm: 500,
    water_ice_L: 20
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyDevPassword(passwordInput);
    if (!success) {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 3000);
    } else {
      setPasswordInput('');
    }
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecName) return;
    addSection({
      name: newSecName,
      subtitle: newSecSubtitle || 'قسم مخبوزات إضافي',
      description: newSecDesc || 'قسم إنتاج تم إضافته بواسطة المطور'
    });
    setNewSecName('');
    setNewSecSubtitle('');
    setNewSecDesc('');
  };

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    updateCriticalLimits(limitsForm);
    alert('تم حفظ وتحديث كافة المعايير والحدود الحرجة بنجاح!');
  };

  const handleAddRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeForm.productName) return;
    addRecipe(newRecipeForm);
    setNewRecipeForm({
      sectionId: 1,
      productName: '',
      flour_kg: 50,
      butter_kg: 5,
      pasteurized_eggs_kg: 10,
      powdered_milk_kg: 2,
      sugar_kg: 5,
      salt_gm: 500,
      yeast_gm: 500,
      water_ice_L: 20
    });
    alert('تم إضافة الصنف والخلطة بنجاح!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-600/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base md:text-lg">
                  لوحة تحكم المطور والتحكم الفائق (Developer Control Panel)
                </h3>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-400/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                إدارة الأقسام، تعديل الخلطات، ضبط الحدود الحرجة، التحكم بالمستخدمين وقواعد البيانات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDevUnlocked && (
              <button
                onClick={lockDevMode}
                className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                title="قفل وضع المطور"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">قفل</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: If Locked -> Show Password Form */}
        {!isDevUnlocked ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shadow-md">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-1">
              <h4 className="font-black text-xl text-slate-900 dark:text-white">
                منطقة محمية بكلمة مرور المطور
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                يرجى إدخال كلمة المرور المخصصة للمطور للوصول إلى أدوات التحكم الشامل وتعديل أقسام ومعايير التطبيق.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-3">
              <div>
                <input
                  type="password"
                  placeholder="أدخل كلمة مرور المطور..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl p-3 text-center text-sm font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none ${
                    authError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-slate-700 focus:border-purple-600'
                  }`}
                  autoFocus
                />
                {authError && (
                  <p className="text-xs font-bold text-rose-600 mt-1.5 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>فتح لوحة تحكم المطور</span>
              </button>
            </form>
          </div>
        ) : (
          /* If Unlocked -> Show Full Dev Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Dev Tabs Switcher */}
            <div className="flex items-center gap-1.5 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 overflow-x-auto custom-scrollbar shrink-0 text-xs font-bold">
              <button
                onClick={() => setActiveDevTab('sections')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeDevTab === 'sections' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>إدارة الأقسام ({sections.length})</span>
              </button>

              <button
                onClick={() => setActiveDevTab('recipes')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeDevTab === 'recipes' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>الخلطات والمقادير ({recipesList.length})</span>
              </button>

              <button
                onClick={() => setActiveDevTab('limits')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeDevTab === 'limits' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>الحدود الحرجة والمعايير القياسية</span>
              </button>

              <button
                onClick={() => setActiveDevTab('users')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeDevTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>المستخدمين والصلاحيات ({usersList.length})</span>
              </button>

              <button
                onClick={() => setActiveDevTab('database')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeDevTab === 'database' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>قاعدة البيانات والنظام</span>
              </button>
            </div>

            {/* Tab 1: Sections Management */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar text-xs space-y-6">
              {activeDevTab === 'sections' && (
                <div className="space-y-5">
                  {/* Add New Section Form */}
                  <form onSubmit={handleAddSection} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-3">
                    <div className="font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-2 text-sm">
                      <Plus className="w-4 h-4" />
                      <span>إضافة قسم مخبوزات أو خط إنتاج جديد</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">اسم القسم</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: مخبوزات 3 أو قسم الحلويات الشرقية"
                          value={newSecName}
                          onChange={(e) => setNewSecName(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">العنوان الفرعي والأصناف</label>
                        <input
                          type="text"
                          placeholder="مثال: كيك، تورت، ساليزون، كنافة..."
                          value={newSecSubtitle}
                          onChange={(e) => setNewSecSubtitle(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">الوصف</label>
                        <input
                          type="text"
                          placeholder="وصف مختصر للقسم..."
                          value={newSecDesc}
                          onChange={(e) => setNewSecDesc(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إنشاء وتفعيل القسم</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Existing Sections */}
                  <div className="space-y-3">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      الأقسام المفعلة حالياً في النظام:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sections.map((sec) => {
                        const isEditing = editingSecId === sec.id;

                        return (
                          <div key={sec.id} className="p-4 rounded-2xl border bg-white dark:bg-slate-800/80 shadow-sm space-y-2">
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editSecName}
                                  onChange={(e) => setEditSecName(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2 font-bold"
                                />
                                <input
                                  type="text"
                                  value={editSecSubtitle}
                                  onChange={(e) => setEditSecSubtitle(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2"
                                />
                                <div className="flex justify-end gap-2 pt-1">
                                  <button
                                    onClick={() => setEditingSecId(null)}
                                    className="px-3 py-1 border rounded-lg"
                                  >
                                    إلغاء
                                  </button>
                                  <button
                                    onClick={() => {
                                      updateSection(sec.id, { name: editSecName, subtitle: editSecSubtitle });
                                      setEditingSecId(null);
                                    }}
                                    className="px-3 py-1 bg-purple-600 text-white rounded-lg font-bold"
                                  >
                                    حفظ
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                                      {sec.id}
                                    </span>
                                    <strong className="text-sm text-slate-900 dark:text-white">{sec.name}</strong>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingSecId(sec.id);
                                        setEditSecName(sec.name);
                                        setEditSecSubtitle(sec.subtitle);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg"
                                      title="تعديل"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteSection(sec.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                                      title="حذف"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <div className="text-slate-500 dark:text-slate-400">
                                  {sec.subtitle}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {sec.description}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Recipes & Formulations */}
              {activeDevTab === 'recipes' && (
                <div className="space-y-5">
                  {/* Add Recipe */}
                  <form onSubmit={handleAddRecipeSubmit} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-3">
                    <div className="font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-2 text-sm">
                      <Plus className="w-4 h-4" />
                      <span>إضافة صنف وخلطة عجين جديدة</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-bold mb-1">القسم</label>
                        <select
                          value={newRecipeForm.sectionId}
                          onChange={(e) => setNewRecipeForm({ ...newRecipeForm, sectionId: parseInt(e.target.value) })}
                          className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                        >
                          {sections.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">اسم الصنف</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: دونتس كيندر سوبريم"
                          value={newRecipeForm.productName}
                          onChange={(e) => setNewRecipeForm({ ...newRecipeForm, productName: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">دقيق (كجم)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newRecipeForm.flour_kg || ''}
                          onChange={(e) => setNewRecipeForm({ ...newRecipeForm, flour_kg: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">زبدة (كجم)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newRecipeForm.butter_kg || ''}
                          onChange={(e) => setNewRecipeForm({ ...newRecipeForm, butter_kg: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>حفظ الخلطة الجديدة</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Recipes List */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-900 font-bold border-b">
                          <tr>
                            <th className="p-3">الصنف</th>
                            <th className="p-3">القسم</th>
                            <th className="p-3">دقيق (كجم)</th>
                            <th className="p-3">زبدة (كجم)</th>
                            <th className="p-3">بيض (كجم)</th>
                            <th className="p-3">سكر (كجم)</th>
                            <th className="p-3">خميرة (جم)</th>
                            <th className="p-3 text-center">إجراء</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {recipesList.map((rec) => (
                            <tr key={rec.id || rec.productName} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                              <td className="p-3 font-bold">{rec.productName}</td>
                              <td className="p-3 text-purple-600 font-semibold">
                                {sections.find(s => s.id === rec.sectionId)?.name || `قسم ${rec.sectionId}`}
                              </td>
                              <td className="p-3">{rec.flour_kg || '-'}</td>
                              <td className="p-3">{rec.butter_kg || '-'}</td>
                              <td className="p-3">{rec.pasteurized_eggs_kg || '-'}</td>
                              <td className="p-3">{rec.sugar_kg || '-'}</td>
                              <td className="p-3">{rec.yeast_gm || '-'}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => rec.id && deleteRecipe(rec.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Critical Limits Config */}
              {activeDevTab === 'limits' && (
                <form onSubmit={handleSaveLimits} className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      تعديل وتخصيص الحدود الحرجة والمعايير الفنية العامة للنظام
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ المعايير الجديدة</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Core Temp */}
                    <div className="p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                      <div className="font-bold text-rose-600 flex items-center gap-2">
                        <Flame className="w-4 h-4" />
                        <span>حرارة مركز المنتج بعد التسوية</span>
                      </div>
                      <div>
                        <label className="block font-medium mb-1">الحد الأدنى الإلزامي (°م)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={limitsForm.coreTempMin}
                          onChange={(e) => setLimitsForm({ ...limitsForm, coreTempMin: parseFloat(e.target.value) || 90 })}
                          className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2.5 font-bold"
                        />
                      </div>
                    </div>

                    {/* Metal Detector */}
                    <div className="p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                      <div className="font-bold text-blue-600 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        <span>حدود قطع معايرة كاشف المعادن (CCP)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[11px] mb-1">حديدي Fe (mm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={limitsForm.metalDetector.fe_mm}
                            onChange={(e) => setLimitsForm({
                              ...limitsForm,
                              metalDetector: { ...limitsForm.metalDetector, fe_mm: parseFloat(e.target.value) || 2.5 }
                            })}
                            className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] mb-1">غير حديدي NFe (mm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={limitsForm.metalDetector.nfe_mm}
                            onChange={(e) => setLimitsForm({
                              ...limitsForm,
                              metalDetector: { ...limitsForm.metalDetector, nfe_mm: parseFloat(e.target.value) || 3.0 }
                            })}
                            className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] mb-1">ستانلس S.S (mm)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={limitsForm.metalDetector.ss_mm}
                            onChange={(e) => setLimitsForm({
                              ...limitsForm,
                              metalDetector: { ...limitsForm.metalDetector, ss_mm: parseFloat(e.target.value) || 3.5 }
                            })}
                            className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sieve & TPM */}
                    <div className="p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                      <div className="font-bold text-teal-600">المنخل الكهربائي وزيت القلي</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] mb-1">مقاس المنخل (ميكرون)</label>
                          <input
                            type="number"
                            value={limitsForm.sieveMeshMicrons}
                            onChange={(e) => setLimitsForm({ ...limitsForm, sieveMeshMicrons: parseInt(e.target.value) || 600 })}
                            className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] mb-1">أقصى نسبة TPM للزيت %</label>
                          <input
                            type="number"
                            value={limitsForm.frying.tpmMaxPct}
                            onChange={(e) => setLimitsForm({
                              ...limitsForm,
                              frying: { ...limitsForm.frying, tpmMaxPct: parseFloat(e.target.value) || 24 }
                            })}
                            className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2 font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Kneading */}
                    <div className="p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                      <div className="font-bold text-amber-600">معايير مرحلة العجن</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] mb-1">درجة حرارة العجن (°م)</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={limitsForm.kneading.minTemp}
                              onChange={(e) => setLimitsForm({
                                ...limitsForm,
                                kneading: { ...limitsForm.kneading, minTemp: parseFloat(e.target.value) || 15 }
                              })}
                              className="w-full bg-white dark:bg-slate-900 border rounded-lg p-1.5 font-bold"
                            />
                            <span>:</span>
                            <input
                              type="number"
                              value={limitsForm.kneading.maxTemp}
                              onChange={(e) => setLimitsForm({
                                ...limitsForm,
                                kneading: { ...limitsForm.kneading, maxTemp: parseFloat(e.target.value) || 19 }
                              })}
                              className="w-full bg-white dark:bg-slate-900 border rounded-lg p-1.5 font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] mb-1">مدة العجن (دقيقة)</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={limitsForm.kneading.minDuration}
                              onChange={(e) => setLimitsForm({
                                ...limitsForm,
                                kneading: { ...limitsForm.kneading, minDuration: parseFloat(e.target.value) || 12 }
                              })}
                              className="w-full bg-white dark:bg-slate-900 border rounded-lg p-1.5 font-bold"
                            />
                            <span>:</span>
                            <input
                              type="number"
                              value={limitsForm.kneading.maxDuration}
                              onChange={(e) => setLimitsForm({
                                ...limitsForm,
                                kneading: { ...limitsForm.kneading, maxDuration: parseFloat(e.target.value) || 20 }
                              })}
                              className="w-full bg-white dark:bg-slate-900 border rounded-lg p-1.5 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Tab 4: Users Management */}
              {activeDevTab === 'users' && (
                <div className="space-y-4">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    قائمة المستخدمين والأدوار الوظيفية
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {usersList.map((usr) => (
                      <div key={usr.id} className="p-4 rounded-2xl border bg-white dark:bg-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm">{usr.name}</strong>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                            {usr.role}
                          </span>
                        </div>
                        <div className="text-slate-500">{usr.title} • {usr.department}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Database Control */}
              {activeDevTab === 'database' && (
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-4">
                  <div className="font-extrabold text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>التحكم الشامل في قاعدة البيانات وإعادة الضبط</span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400">
                    يمكنك إعادة ضبط كافة السجلات والنماذج إلى الحالة الافتراضية الأصلية المأخوذة من الوثيقة.
                  </p>

                  <button
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات إلى الحالة الافتراضية؟')) {
                        resetAllData();
                        alert('تمت استعادة البيانات الافتراضية بنجاح!');
                      }
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة ضبط المصنع (Factory Reset Data)</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
