// app/components/header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideArrowUpRight,
  LucideBell,
  LucideDownload,
  LucideMenu,
  LucideX,
  LucideChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  title?: string;
  moduleItems?: Array<{ label: string; href: string; icon?: React.ReactNode }>;
  className?: string;
  mobile?: boolean;
}

export default function Header({
  title,
  moduleItems = [],
  className = "",
  mobile = false,
}: HeaderProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className={`bg-white border-b border-purple-200 ${className}`}>
      <div className="px-3 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Module Navigation or Title */}
        <div className="flex items-center gap-3">
          {mobile ? (
            // Mobile: Show dropdown if there are moduleItems
            <div className="relative">
              {moduleItems.length > 0 ? (
                <>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-lg font-bold text-gray-900"
                  >
                    {title}
                    <LucideChevronDown
                      size={18}
                      className={`transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md border border-purple-200 py-2 z-50"
                      >
                        {moduleItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              pathname === item.href
                                ? "bg-violet-50 text-violet-600 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <h1 className="text-lg font-bold text-gray-900">{title}</h1>
              )}
            </div>
          ) : (
            // Desktop: Show module navigation
            moduleItems.length > 0 && (
              <nav className="flex gap-1">
                {moduleItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                      pathname === item.href
                        ? "bg-violet-50 text-violet-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <LucideBell size={18} />
          </button>
          <div className="w-8 h-8 bg-linear-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
