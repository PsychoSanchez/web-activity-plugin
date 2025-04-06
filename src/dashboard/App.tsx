import React from 'react';

import '@shared/styles/tailwind.css';
import { SidebarProvider, SidebarTrigger } from '@shared/ui/sidebar';

import { AppSidebar } from './components/AppSidebar';
import { CalendarTab } from './components/CalendarTab';
import { DetailedViewTab } from './components/DetailedViewTab';
import { IgnoredDomainsPage } from './components/IgnoredDomainsPage';
import { OverviewTab } from './components/OverviewTab';
import { SettingsTab } from './components/SettingsTab';
import { RouterProvider, useRouter, Routes } from './hooks/useRouter';

function AppContent() {
  const { currentRoute } = useRouter();

  const renderContent = () => {
    switch (currentRoute) {
      case Routes.Overview:
        return <OverviewTab />;
      case Routes.Calendar:
        return <CalendarTab />;
      case Routes.Detailed:
        return <DetailedViewTab />;
      case Routes.Settings:
        return <SettingsTab />;
      case Routes.IgnoredDomains:
        return <IgnoredDomainsPage />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold ml-4">Dashboard</h1>
            </div>
          </header>
          <main className="flex-1 p-4 w-full overflow-auto">
            <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
