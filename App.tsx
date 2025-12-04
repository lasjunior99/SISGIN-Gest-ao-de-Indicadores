import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { loadData, saveData } from './services/storage';
import { AppData } from './types';
import { AdminTab } from './components/tabs/AdminTab';
import { ManagerTab } from './components/tabs/ManagerTab';
import { MetasTab } from './components/tabs/MetasTab';
import { ResultsTab } from './components/tabs/ResultsTab';
import { GuidelinesTab } from './components/tabs/GuidelinesTab';
import { INITIAL_DATA } from './constants';
import { 
  Toast, Logo, LayoutDashboardIcon, TargetIcon, BarChartIcon, 
  BookOpenIcon, SettingsIcon, MenuIcon, ChevronLeftIcon, ChevronRightIcon 
} from './components/ui/UIComponents';

export const generateId = () => 'ID' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'fichas' | 'admin' | 'metas' | 'orientacoes' | 'resultados'>('fichas');
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [loaded, setLoaded] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Persist Admin Auth State
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  // Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadedData = loadData();
    setData(loadedData);
    setLoaded(true);
  }, []);

  const updateData = (partialData: Partial<AppData>) => {
    const newData = { ...data, ...partialData };
    setData(newData);
    saveData(newData);
  };

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  if (!loaded) return <div className="p-10 text-center">Carregando sistema...</div>;

  const NavItem = ({ id, label, icon: Icon }: { id: typeof currentTab, label: string, icon: any }) => (
    <button
      onClick={() => {
        setCurrentTab(id);
        closeMobileMenu();
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border-r-4
        ${isSidebarCollapsed ? 'justify-center' : ''}
        ${currentTab === id 
          ? 'bg-blue-800 border-blue-400 text-white shadow-inner' 
          : 'text-blue-100 hover:bg-blue-900/50 border-transparent hover:text-white'}`}
      title={isSidebarCollapsed ? label : ''}
    >
      <Icon className={`flex-shrink-0 w-6 h-6 ${currentTab === id ? 'text-blue-200' : 'opacity-70'}`} />
      {!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Mobile Header (Hamburger) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-corporate z-30 flex items-center px-4 shadow-md justify-between">
         <Logo collapsed={true} />
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
            <MenuIcon className="w-8 h-8" />
         </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          bg-corporate flex flex-col shadow-2xl transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          lg:flex-shrink-0 h-full mt-16 lg:mt-0
        `}
      >
        <div className={`h-20 flex items-center px-6 border-b border-blue-800 bg-corporate-dark transition-all ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}>
          <Logo collapsed={isSidebarCollapsed} />
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
          <NavItem id="fichas" label="Fichas de Indicadores" icon={LayoutDashboardIcon} />
          <NavItem id="metas" label="Metas" icon={TargetIcon} />
          <NavItem id="resultados" label="Resultados" icon={BarChartIcon} />
          <NavItem id="orientacoes" label="Orientações e Ajuda" icon={BookOpenIcon} />
          <NavItem id="admin" label="Admin" icon={SettingsIcon} />
        </nav>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex p-4 border-t border-blue-800 justify-end">
            <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 text-blue-200 hover:text-white bg-blue-900/30 rounded hover:bg-blue-900/50 transition-colors w-full flex justify-center"
            >
                {isSidebarCollapsed ? <ChevronRightIcon className="w-5 h-5"/> : <ChevronLeftIcon className="w-5 h-5"/>}
            </button>
        </div>

        {!isSidebarCollapsed && (
            <div className="p-4 border-t border-blue-800 text-center">
                <p className="text-[10px] text-blue-300">Versão 3.3</p>
            </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative mt-16 lg:mt-0">
        {/* Notification Toast */}
        {notification && (
          <Toast 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}

        {/* Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth w-full">
          <div className="max-w-6xl mx-auto pb-10">
            {currentTab === 'fichas' && (
              <ManagerTab 
                data={data} 
                updateData={updateData} 
                notify={notify} 
              />
            )}
            {currentTab === 'metas' && (
              <MetasTab 
                data={data} 
                updateData={updateData} 
                notify={notify}
              />
            )}
            {currentTab === 'resultados' && (
              <ResultsTab 
                data={data}
                notify={notify}
              />
            )}
            {currentTab === 'orientacoes' && <GuidelinesTab />}
            {currentTab === 'admin' && (
              <AdminTab 
                data={data} 
                updateData={updateData} 
                isAuthenticated={adminAuthenticated}
                setIsAuthenticated={setAdminAuthenticated}
                notify={notify}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}

export default App;