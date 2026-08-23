import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { InProcessModule } from './components/InProcessControl/InProcessModule';
import { DefectsModule } from './components/DefectsLog/DefectsModule';
import { WeightsTempModule } from './components/WeightsTemp/WeightsTempModule';
import { CcpOprpModule } from './components/CCP_OPRP/CcpOprpModule';
import { SensoryFoodSafetyModule } from './components/SensoryFoodSafety/SensoryFoodSafetyModule';
import { ProductReleaseModule } from './components/ProductRelease/ProductReleaseModule';
import { AdminPanel } from './admin/adminUi';
import { SupabaseLoginScreen } from './admin/SupabaseLoginScreen';
import { applyAdminAppearance } from './admin/admin.css';
import { loadAdminConfig, syncAdminConfigFromSupabase } from './admin/adminConfig';
import { AdminConfig } from './admin/adminTypes';
import { RemoteDataSync } from './components/common/RemoteDataSync';
import { supabase } from './lib/supabase';
import { getCurrentAuthProfile, signOutSupabase } from './lib/authService';
import { UserProfile } from './types';
import { withRolePermissions } from './admin/rbac';

const toUserProfile = (data: any): UserProfile => {
  const roleMap: Record<string, UserProfile['role']> = {
    quality_engineer: 'quality_engineer',
    production_supervisor: 'production_supervisor',
    quality_supervisor: 'production_supervisor',
    quality_manager: 'quality_manager',
    department_head: 'quality_manager',
    senior_quality: 'quality_engineer',
    Developer: 'system_admin',
    developer: 'system_admin',
    system_admin: 'system_admin',
  };
  const role = roleMap[data.role] || roleMap[data.position] || 'quality_engineer';
  return withRolePermissions({ id:data.id, name:data.name, role, department:'إدارة الجودة - قسم المخبوزات', title:data.position || 'مستخدم جودة', permissions:data.permissions || {} }, role);
};

const MainLayout: React.FC<{ config: AdminConfig; onConfigChange:(next:AdminConfig)=>void; onLogout:()=>void }> = ({ config, onConfigChange, onLogout }) => {
  const [activeTab,setActiveTab]=useState<NavTab>('dashboard');
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);
  const [showAdmin,setShowAdmin]=useState(false);
  const { currentUser } = useApp();
  useEffect(()=>{applyAdminAppearance(config.appearance)},[config.appearance]);
  const isAdmin=currentUser.role==='system_admin';
  return <div dir="rtl" className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors" style={{fontFamily:'var(--app-font)'}}>
    <Navbar onToggleSidebar={()=>setIsSidebarOpen(!isSidebarOpen)} onOpenAdmin={isAdmin?()=>setShowAdmin(true):undefined} onLogout={onLogout}/>
    <div className="flex-1 min-h-0 min-w-0 flex overflow-hidden"><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} onClose={()=>setIsSidebarOpen(false)}/><main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full"><div className="min-w-0 w-full">{activeTab==='dashboard'&&<DashboardOverview onNavigate={tab=>setActiveTab(tab)}/>} {activeTab==='ipc'&&<InProcessModule/>} {activeTab==='defects'&&<DefectsModule/>} {activeTab==='weights_temp'&&<WeightsTempModule/>} {activeTab==='ccp_oprp'&&<CcpOprpModule/>} {activeTab==='sensory_food_safety'&&<SensoryFoodSafetyModule/>} {activeTab==='product_release'&&<ProductReleaseModule/>}</div></main></div>
    {showAdmin&&isAdmin&&<AdminPanel config={config} onChange={(next)=>{onConfigChange(next);setShowAdmin(false)}} onLogout={onLogout}/>}<RemoteDataSync/>
  </div>;
};

const AppShell:React.FC=()=>{
  const [config,setConfig]=useState<AdminConfig>(()=>loadAdminConfig());
  const [authUserId,setAuthUserId]=useState<string|null>(null);
  const [booting,setBooting]=useState(true);
  const { setCurrentUserProfile } = useApp();

  const loadAuthProfile=async(userId:string)=>{
    const { data, error } = await supabase.from('users').select('id,name,position,role,permissions,active').eq('auth_user_id',userId).eq('active',true).single();
    if(error||!data){await supabase.auth.signOut();setAuthUserId(null);throw new Error('حساب Auth غير مربوط بمستخدم نشط داخل النظام.')}
    setCurrentUserProfile(toUserProfile(data));
    setAuthUserId(userId);
  };

  useEffect(()=>{
    let mounted=true;
    const boot=async()=>{
      try{
        const current=await getCurrentAuthProfile();
        if(!mounted)return;
        if(current){setCurrentUserProfile(toUserProfile(current.profile));setAuthUserId(current.user.id);const remote=await syncAdminConfigFromSupabase();if(mounted&&remote)setConfig(remote)}
      }catch(error){console.warn('Auth bootstrap failed',error)}finally{if(mounted)setBooting(false)}
    };
    void boot();
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{if(!mounted)return;if(session?.user){void loadAuthProfile(session.user.id).catch(()=>undefined)}else{setAuthUserId(null)}});
    return()=>{mounted=false;subscription.unsubscribe()};
  },[]);

  const login=async(userId:string)=>{await loadAuthProfile(userId);const remote=await syncAdminConfigFromSupabase();if(remote)setConfig(remote)};
  const logout=async()=>{try{await signOutSupabase()}finally{setAuthUserId(null)}};
  if(booting)return <div dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600">جارٍ التحقق من جلسة الدخول...</div>;
  if(!authUserId)return <SupabaseLoginScreen config={config} onLogin={login}/>;
  return <MainLayout config={config} onConfigChange={setConfig} onLogout={logout}/>;
};
export default function App(){return <AppProvider><AppShell/></AppProvider>}
