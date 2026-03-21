// app/components/layout/dashboard-layout.tsx
"use client";

import { useState } from "react";
import Sidebar from "../sidebar";
import Header from "../header";
import {
  LucideLayoutDashboard,
  LucidePackage,
  LucideCreditCard,
  LucideFileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

// Navigation items
const navItems = [
  {
    icon: <LucideLayoutDashboard size={22} />,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: <LucidePackage size={22} />,
    label: "Inventory",
    href: "/admin/inventory",
  },
  { icon: <LucideCreditCard size={22} />, label: "POS", href: "/admin/pos" },
  {
    icon: <LucideFileText size={22} />,
    label: "Invoice",
    href: "/admin/invoice",
  },
];

export function DashboardLayout({
  children,
  config = { title: "Dashboard", moduleItems: [] },
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Get current page title
  const currentNavItem = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );
  const pageTitle = currentNavItem?.label || config.title || "Dashboard";

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-purple-50/30">
      {/* Desktop: Sidebar + Main */}
      <div className="hidden lg:flex h-screen">
        <Sidebar className="w-64 " title={config.title} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Header */}
          <Header
            title={pageTitle}
            moduleItems={config.moduleItems}
            className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-sm "
          />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>

      {/* Mobile: Content + Bottom Navigation */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Mobile Header with Dropdown */}
        <Header
          title={pageTitle}
          moduleItems={config.moduleItems}
          mobile={true}
          className="h-14 border-b border-gray-100 bg-white/95 backdrop-blur-sm  sticky top-0 z-30"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/95 backdrop-blur-sm z-40 px-1 pb-safe">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center h-12 px-4 rounded-2xl transition-all ${
                    isActive
                      ? "text-violet-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {isActive ? (
                    <div className="p-1.5 bg-linear-to-r from-violet-500 to-purple-600 rounded-xl text-white">
                      {item.icon}
                    </div>
                  ) : (
                    <div className="p-1.5">{item.icon}</div>
                  )}
                  <span
                    className={`text-[10px] font-semibold mt-0.5 ${isActive ? "text-violet-600" : ""}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
