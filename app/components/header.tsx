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
} from "lucide-react";

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
    <header
      className={`bg-white ${className} shadow-sm border-b border-gray-200`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Left: Title and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {mobile && (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {dropdownOpen ? <LucideX size={20} /> : <LucideMenu size={20} />}
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {/* Desktop Module Navigation */}
          {!mobile && moduleItems.length > 0 && (
            <nav className="mx-4 flex-1 flex justify-center gap-6">
              {moduleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === item.href
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                  <LucideArrowUpRight size={12} />
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <LucideBell size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <LucideDownload size={20} />
            <span className="sr-only">Export</span>
          </button>
          <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            SA
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Module Navigation */}
      {mobile && dropdownOpen && (
        <div className=" lg:hidden border-t border-gray-200 bg-white shadow-lg animate-slideDown">
          <nav className="p-4 space-y-2">
            {moduleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setDropdownOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
