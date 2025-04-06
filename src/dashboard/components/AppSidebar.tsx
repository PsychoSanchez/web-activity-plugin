import { Home, Calendar, BarChart2, Settings, Shield } from 'lucide-react';
import React from 'react';

import { SidebarMenuButton } from '@shared/ui/sidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@shared/ui/sidebar';

import { Routes, useRouter } from '../hooks/useRouter';

export function AppSidebar() {
  const { currentRoute, navigate } = useRouter();

  return (
    <Sidebar className="w-64 bg-gray-800">
      <SidebarHeader>
        <h2 className="text-xl font-bold p-4">Admin Panel</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex flex-col space-y-1 p-2">
            <SidebarMenuButton
              asChild
              isActive={currentRoute === Routes.Overview}
              onClick={() => navigate(Routes.Overview)}
            >
              <button className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Overview</span>
              </button>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              isActive={currentRoute === Routes.Calendar}
              onClick={() => navigate(Routes.Calendar)}
            >
              <button className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Calendar</span>
              </button>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              isActive={currentRoute === Routes.Detailed}
              onClick={() => navigate(Routes.Detailed)}
            >
              <button className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5" />
                <span>Detailed View</span>
              </button>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              isActive={currentRoute === Routes.Settings}
              onClick={() => navigate(Routes.Settings)}
            >
              <button className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </SidebarMenuButton>
            <SidebarMenuButton
              asChild
              isActive={currentRoute === Routes.IgnoredDomains}
              onClick={() => navigate(Routes.IgnoredDomains)}
            >
              <button className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Ignored Domains</span>
              </button>
            </SidebarMenuButton>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-sm text-gray-400 p-4">© 2023 BroTime</p>
      </SidebarFooter>
    </Sidebar>
  );
}
