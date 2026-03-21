"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LucideLayoutDashboard,
  LucidePackage,
  LucideCreditCard,
  LucideFileText,
  LucideMenu,
  LucideX,
  LucideSettings,
  LucideLogOut,
  LucideChevronsUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileToggle?: () => void;
  className?: string;
  title?: string;
}

// Item default dengan title mapping
const defaultItems = [
  {
    icon: <LucideLayoutDashboard size={20} />,
    label: "Dashboard",
    href: "/admin/dashboard",
    pageTitle: "Dashboard",
  },
  {
    icon: <LucidePackage size={20} />,
    label: "Inventory",
    href: "/admin/inventory",
    pageTitle: "Inventory",
  },
  {
    icon: <LucideCreditCard size={20} />,
    label: "POS",
    href: "/admin/pos",
    pageTitle: "Point of Sale",
  },
  {
    icon: <LucideFileText size={20} />,
    label: "Invoice",
    href: "/admin/invoice",
    pageTitle: "Invoice",
  },
];

export default function Sidebar({
  mobileOpen,
  onMobileToggle,
  className = "",
  title,
}: SidebarProps) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get current page title based on pathname
  const currentItem = defaultItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );
  const currentTitle = currentItem?.pageTitle || title || "Sellora";

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Placeholder functions for actions
  const handleSettings = () => {
    console.log("Open settings");
    setUserMenuOpen(false);
  };

  const handleSignOut = () => {
    console.log("Sign out");
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`bg-white border-r border-purple-200 h-full flex flex-col ${className}`}
      >
        <div className="p-5 border-b border-purple-200">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-xl font-black bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-mono">
              Sellora
            </span>
          </Link>

          {/* Current Page Indicator */}
          <div className="mt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider px-1">
              Current Page
            </p>
            <div className="mt-2 px-3 py-2.5 bg-linear-to-r from-violet-50 to-purple-50 rounded-md border border-violet-100 font-mono">
              <p className="font-bold text-gray-900">{currentTitle}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {defaultItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center font-bold gap-3 px-4 py-3 rounded-md transition-all duration-200 group ${
                  isActive
                    ? "bg-linear-to-r from-violet-500 to-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-violet-600"
                }`}
              >
                <div
                  className={
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-violet-600"
                  }
                >
                  {item.icon}
                </div>
                <span
                  className={`font-semibold ${isActive ? "text-white" : ""}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile with Dropdown */}
        <div
          className="p-4 border-t border-purple-200 relative"
          ref={userMenuRef}
        >
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-gray-900 truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">
                admin@sellora.com
              </p>
            </div>
            <LucideChevronsUpDown
              size={16}
              className="text-gray-400 shrink-0"
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 right-0 m-2 bg-white rounded-lg shadow-lg border border-purple-200 py-1 z-50"
              >
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LucideSettings size={16} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LucideLogOut size={16} />
                  <span>Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {onMobileToggle && (
        <div className="lg:hidden fixed bottom-20 right-4 z-40">
          <button
            onClick={onMobileToggle}
            className="w-12 h-12 rounded-2xl bg-linear-to-r from-violet-500 to-purple-600 text-white hover:shadow-2xl transition-all flex items-center justify-center"
          >
            {mobileOpen ? <LucideX size={22} /> : <LucideMenu size={22} />}
          </button>
        </div>
      )}

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {mobileOpen && onMobileToggle && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              onClick={onMobileToggle}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col"
            >
              <div className="p-5 border-b border-gray-100">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={onMobileToggle}
                >
                  <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-md flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-xl">S</span>
                  </div>
                  <span className="text-xl font-black bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Sellora
                  </span>
                </Link>
              </div>
              <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                {defaultItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-linear-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-50 hover:text-violet-600"
                      }`}
                      onClick={onMobileToggle}
                    >
                      <div className="w-5 h-5">{item.icon}</div>
                      <span className="font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-purple-200">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">admin@sellora.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
