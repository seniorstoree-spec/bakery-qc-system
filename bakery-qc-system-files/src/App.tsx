import React, { useState } from 'react';
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

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardOverview onNavigate={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'ipc' && <InProcessModule />}
          {activeTab === 'defects' && <DefectsModule />}
          {activeTab === 'weights_temp' && <WeightsTempModule />}
          {activeTab === 'ccp_oprp' && <CcpOprpModule />}
          {activeTab === 'sensory_food_safety' && <SensoryFoodSafetyModule />}
          {activeTab === 'product_release' && <ProductReleaseModule />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
