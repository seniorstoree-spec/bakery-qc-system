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
import { AdminPanel, clearSession, getSession, setSession } from './admin/adminUi';
import { SupabaseLoginScreen } from './admin/SupabaseLoginScreen';
import { applyAdminAppearance } from './admin/admin.css';
import { loadAdminConfig, syncAdminConfigFromSupabase } from './admin/adminConfig';
import { AdminConfig, LoginMode } from './admin/adminTypes';
import { RemoteDataSync } from './components/common/RemoteDataSync';
import { supabase } from './lib/supabase';
import { UserProfile } from './types';
import { withRolePermissions } from './admin/rbac';

const MainLayout: React.FC<{ config: AdminConfig; onConfigChange:(next:AdminConfig)=>void; onLogout:()=>void }> = ({ config, onConfigChange, onLogout }) => {
  const [activeTab,setActiveTab]=useState<NavTab>('dashboard'); const [isSidebarOpen,setIsSidebarOpen]=useState(false); const [showAdmin,setShowAdmin]=useState(false);
  useEffect(()=>{applyAdminAppearance(config.appearance)},[config.appearance]);
  const isAdmin=getSession()?.mode==='admin';
  return <div dir="rtl" className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors" style={{fontFamily:'var(--app-font)'}}>
    <Navbar onToggleSidebar={()=>setIsSidebarOpen(!isSidebarOpen)} onOpenAdmin={isAdmin?()=>setShowAdmin(true):undefined} onLogout={onLogout}/>
    <div className="flex-1 min-h-0 min-w-0 flex overflow-hidden"><Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} onClose={()=>setIsSidebarOpen(false)}/><main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full"><div className="min-w-0 w-full">{activeTab==='dashboard'&&<DashboardOverview onNavigate={tab=>setActiveTab(tab)}/>} {activeTab==='ipc'&&<InProcessModule/>} {activeTab==='defects'&&<DefectsModule/>} {activeTab==='weights_temp'&&<WeightsTempModule/>} {activeTab==='ccp_oprp'&&<CcpOprpModule/>} {activeTab==='sensory_food_safety'&&<SensoryFoodSafetyModule/>} {activeTab==='product_release'&&<ProductReleaseModule/>}</div></main></div>
    {showAdmin&&isAdmin&&<AdminPanel config={config} onChange={(next)=>{onConfigChange(next);setShowAdmin(false)}} onLogout={onLogout}/>}<RemoteDataSync/>
  </div>;
};

const AppShell:React.FC=()=>{
  const [config,setConfig]=useState<AdminConfig>(()=>loadAdminConfig());
  const [session,setSessionState]=useState<{mode:LoginMode;userId?:string}|null>(()=>getSession());
  const { setCurrentUserProfile } = useApp();

  const loadSelectedUser = async (userId?: string) => {
    if (!userId) return;

    const configUser = config.users.find((u) => u.id === userId || u.supabaseId === userId);
    if (configUser) {
      setCurrentUserProfile(withRolePermissions({ ...configUser }));
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('id,name,position,role,permissions,active')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data || !data.active) return;

    const roleMap: Record<string, UserProfile['role']> = {
      quality_engineer: 'quality_engineer',
      quality_supervisor: 'production_supervisor',
      department_head: 'quality_manager',
      senior_quality: 'quality_engineer',
      Developer: 'system_admin',
      developer: 'system_admin',
    };

    const role = roleMap[data.position || ''] || roleMap[data.role || ''] || 'quality_engineer';

    setCurrentUserProfile(withRolePermissions({
      id: data.id,
      name: data.name,
      role,
      department: 'إدارة الجودة - قسم المخبوزات',
      title: data.position || 'مستخدم جودة',
      permissions: data.permissions || {},
    }, role));
  };

  useEffect(()=>{
    let active=true;
    const load=async()=>{
      const remote=await syncAdminConfigFromSupabase();
      if(!active)return;
      if(remote){
        setConfig(remote);
        const currentSession = getSession();
        if(currentSession?.mode==='user'){
          const selected = remote.users.find((u)=>u.id===currentSession.userId || u.supabaseId===currentSession.userId);
          if(selected){
            setCurrentUserProfile(withRolePermissions({...selected}));
          } else {
            clearSession();
            setSessionState(null);
          }
        } else if(currentSession?.mode==='admin') {
          setCurrentUserProfile(withRolePermissions({
            id: currentSession.userId || 'developer',
            name: 'Eslam Kamel',
            role: 'system_admin',
            department: 'نظم المعلومات',
            title: 'System Admin',
            permissions: { canEnterData: true, canApproveRelease: true, canEditCriticalLimits: true, canManageUsers: true, canExportReports: true, canSignOff: true },
          }, 'system_admin'));
        }
      }
    };
    void load();
    return()=>{active=false};
  },[]);

  const login=async(mode:LoginMode,userId?:string)=>{
    const next={mode,userId};
    if(mode==='user') {
      await loadSelectedUser(userId);
    } else {
      setCurrentUserProfile(withRolePermissions({
        id: userId || 'developer',
        name: 'Eslam Kamel',
        role: 'system_admin',
        department: 'نظم المعلومات',
        title: 'System Admin',
        permissions: { canEnterData: true, canApproveRelease: true, canEditCriticalLimits: true, canManageUsers: true, canExportReports: true, canSignOff: true },
      }, 'system_admin'));
    }
    setSession(next);
    setSessionState(next);
  };

  const logout=()=>{clearSession();setSessionState(null)};
  if(!session)return <SupabaseLoginScreen config={config} onLogin={login}/>;
  return <MainLayout config={config} onConfigChange={setConfig} onLogout={logout}/>;
};
export default function App(){return <AppProvider><AppShell/></AppProvider>}
