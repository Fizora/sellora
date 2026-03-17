// app/components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideLayoutDashboard,
  LucidePackage,
  LucideCreditCard,
  LucideFileText,
  LucideMenu,
  LucideX,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileToggle?: () => void;
  className?: string;
}

// Item default (paten)
const defaultItems = [
  {
    icon: <LucideLayoutDashboard size={20} />,
    label: "Dashboard",
    href: "/app/dashboard",
  },
  {
    icon: <LucidePackage size={20} />,
    label: "Inventory",
    href: "/app/inventory",
  },
  {
    icon: <LucideCreditCard size={20} />,
    label: "POS",
    href: "/app/pos",
  },
  {
    icon: <LucideFileText size={20} />,
    label: "Invoice",
    href: "/app/invoice",
  },
];

export default function Sidebar({
  mobileOpen,
  onMobileToggle,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`bg-white ${className}`}>
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h2 className="text-xl font-bold text-gray-800">Sellora</h2>
        </div>
        <nav className="hidden md:block p-4 space-y-2">
          {defaultItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <div className="w-6 h-6">{item.icon}</div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Button (hanya jika onMobileToggle diberikan) */}
      {onMobileToggle && (
        <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={onMobileToggle}
            className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 border-4 border-white/50 flex items-center justify-center"
          >
            {mobileOpen ? <LucideX size={24} /> : <LucideMenu size={24} />}
          </button>
        </div>
      )}

      {/* Mobile Drop-up Menu (Sidebar) */}
      {mobileOpen && onMobileToggle && (
        <div className="lg:hidden fixed bottom-20 left-0 w-full bg-white shadow-2xl border-t-4 border-blue-500 z-50 animate-slideUp">
          <nav className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {defaultItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-xl"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
                onClick={onMobileToggle}
              >
                <div className="w-8 h-8 p-2 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="font-semibold text-lg">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
