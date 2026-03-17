// app/components/layout/dashboard-layout.tsx
"use client";

import { useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  config?: {
    title?: string;
    moduleItems?: Array<{
      label: string;
      href: string;
      icon?: React.ReactNode;
    }>;
  };
}

export function DashboardLayout({
  children,
  config = { title: "Dashboard", moduleItems: [] },
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop: Sidebar + Main */}
      <div className="hidden lg:flex h-screen">
        <Sidebar className="w-64 border-r border-gray-200" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={config.title}
            moduleItems={config.moduleItems}
            className="border-b border-gray-200"
          />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>

      {/* Mobile: Header + Content + Bottom Sidebar */}
      <div className="lg:hidden flex flex-col h-screen">
        <Header
          title={config.title}
          moduleItems={config.moduleItems}
          className="border-b border-gray-200"
          mobile
        />
        <main className="flex-1 overflow-y-auto p-4 pb-20">{children}</main>
        <Sidebar
          mobileOpen={sidebarOpen}
          onMobileToggle={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        />
      </div>
    </div>
  );
}
