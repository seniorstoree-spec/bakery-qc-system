import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthGate } from './components/AuthGate';
import { DeveloperPanel } from './components/DeveloperPanel';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { InProcessModule } from './components/InProcessControl/InProcessModule';
import { DefectsModule } from './components/DefectsLog/DefectsModule';
import { WeightsTempModule } from './components/WeightsTemp/WeightsTempModule';
import { CcpOprpModule } from './components/CCP_OPRP/CcpOprpModule';
import { SensoryFoodSafetyModule } from './components/SensoryFoodSafety/SensoryFoodSafetyModule';
import { ProductReleaseModule } from './components/ProductRelease/ProductReleaseModule';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
    <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
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
    <DeveloperPanel />
  </div>;
};

export default function App() {
  return <AuthGate><AppProvider><MainLayout /></AppProvider></AuthGate>;
}
