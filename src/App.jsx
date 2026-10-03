import React, { useState } from 'react';
import { AppProvider } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Events from './pages/Events.jsx';
import Schedule from './pages/Schedule.jsx';
import Resources from './pages/Resources.jsx';
import Conflicts from './pages/Conflicts.jsx';
import Settings from './pages/Settings.jsx';

const pages = {
  dashboard: Dashboard, events: Events, schedule: Schedule,
  resources: Resources, conflicts: Conflicts, settings: Settings,
};

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="page-bg">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
      />
      <Header activePage={activePage} sidebarCollapsed={sidebarCollapsed} />
      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        <div className="p-6 max-w-[1600px]">
          <PageComponent onNavigate={setActivePage} />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
