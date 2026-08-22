import React, { useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { InProcessModule } from './components/InProcessControl/InProcessModule';
import { DefectsModule } from './components/DefectsLog/DefectsModule';
import { WeightsTempModule } from './components/WeightsTemp/WeightsTempModule';
import { CcpOprpModule } from './components/CCP_OPRP/CcpOprpModule';
import { SensoryFoodSafetyModule } from './components/SensoryFoodSafety/SensoryFoodSafetyModule';
import { ProductReleaseModule } from './components/ProductRelease/ProductReleaseModule';
import { AdminPanel, LoginScreen, clearSession, getSession, setSession } from './admin/adminUi';
import { applyAdminAppearance } from './admin/admin.css';
import { loadAdminConfig } from './admin/adminConfig';
import { AdminConfig, LoginMode } from './admin/adminTypes';
import { RemoteDataSync } from './components/common/RemoteDataSync';

const MainLayout: React.FC<{ config: AdminConfig; onLogout: () => void }> = ({ config, onLogout }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    applyAdminAppearance(config.appearance);
  }, [config.appearance]);

  const isAdmin = getSession()?.mode === 'admin';

  return (
    <div dir="rtl" className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors" style={{ fontFamily: 'var(--app-font)' }}>
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onOpenAdmin={isAdmin ? () => setShowAdmin(true) : undefined} onLogout={onLogout} />
      <div className="flex-1 min-h-0 min-w-0 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="min-w-0 w-full">
            {activeTab === 'dashboard' && <DashboardOverview onNavigate={(tab) => setActiveTab(tab)} />}
            {activeTab === 'ipc' && <InProcessModule />}
            {activeTab === 'defects' && <DefectsModule />}
            {activeTab === 'weights_temp' && <WeightsTempModule />}
            {activeTab === 'ccp_oprp' && <CcpOprpModule />}
            {activeTab === 'sensory_food_safety' && <SensoryFoodSafetyModule />}
            {activeTab === 'product_release' && <ProductReleaseModule />}
          </div>
        </main>
      </div>
      {showAdmin && isAdmin && <AdminPanel config={config} onChange={() => window.location.reload()} onLogout={onLogout} />}
    </div>
  );
};

const AppShell: React.FC = () => {
  const [config] = useState<AdminConfig>(() => loadAdminConfig());
  const [session, setSessionState] = useState<{ mode: LoginMode; userId?: string } | null>(() => getSession());

  const login = (mode: LoginMode, userId?: string) => {
    const next = { mode, userId };
    setSession(next);
    setSessionState(next);
  };

  const logout = () => {
    clearSession();
    setSessionState(null);
  };

  if (!session) return <LoginScreen config={config} onLogin={login} />;
  return <MainLayout config={config} onLogout={logout} />;
};

export default function App() {
  return (
    <AppProvider>
      <RemoteDataSync />
      <AppShell />
    </AppProvider>
  );
}
