"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation"; // ← usePathname
import ButtonPrimary from "./button-primary";
import {
  LucideArrowUpRight,
  LucideSend,
  LucideMenu,
  LucideX,
  LucideCircleDot, // ← Active indicator
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // ← Current path

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Nav items data-driven
  const navItems = [
    { href: "/", label: "Beranda" },
    {
      href: "/doc",
      label: "Dokumentasi",
      icon: <LucideArrowUpRight size={18} />,
    },
    {
      href: "/developer",
      label: "Pengembang",
      icon: <LucideArrowUpRight size={18} />,
    },
    {
      href: "/auth/register",
      label: "Mulai Sekarang",
      cta: true,
      icon: <LucideSend size={22} />,
    },
  ];

  return (
    <>
      {/* Fixed Navbar Container */}
      <header className="w-full fixed top-5 left-0 z-50 px-4">
        {/* Navbar Pill */}
        <div className="mx-auto max-w-5xl bg-white py-3 px-6 rounded-md flex items-center justify-between border border-purple-200">
          {/* Brand */}
          <div className="font-black text-2xl bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparen font-monot">
            Sellora.
          </div>

          {/* Desktop Nav (XL+ = 1280px+) - NO active indicator */}
          <nav className="hidden xl:flex items-center gap-8 text-gray-700">
            <Link
              href="/"
              className="font-medium hover:text-blue-600 transition-all duration-300"
            >
              Beranda
            </Link>
            <Link
              href="/doc"
              className="flex items-center gap-1 font-medium hover:text-blue-600 transition-all duration-300"
            >
              Dokumentasi <LucideArrowUpRight size={14} />
            </Link>
            <Link
              href="/developer"
              className="flex items-center gap-1 font-medium hover:text-blue-600 transition-all duration-300"
            >
              Pengembang <LucideArrowUpRight size={14} />
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <LucideSend size={18} />
              Mulai Sekarang
            </Link>
          </nav>

          {/* Hamburger Button (md & lg) */}
          <button
            onClick={toggleMenu}
            className="xl:hidden p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 md:block"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <LucideX size={24} className="text-gray-700" />
            ) : (
              <LucideMenu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Dropdown Menu - WITH ACTIVE INDICATOR */}
      {isMenuOpen && (
        <div className="xl:hidden fixed top-24 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 z-40 md:hidden">
          <nav className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex flex-col items-stretch space-y-4">
              {/* Nav Links dengan Active State */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 text-lg font-semibold text-gray-800 group
                    ${
                      pathname === item.href
                        ? "bg-linear-to-r from-blue-500 to-purple-600 text-white"
                        : "hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50"
                    }
                  `}
                  onClick={closeMenu}
                >
                  {/* Active Indicator - MOBILE ONLY */}
                  {pathname === item.href && (
                    <LucideCircleDot
                      size={24}
                      className="text-white/90 drop-shadow-lg ml-1 -mr-1  md:hidden"
                    />
                  )}

                  <span className="flex-1 min-w-0">{item.label}</span>

                  {item.icon && (
                    <div
                      className={`
                      transition-all duration-300 
                      ${pathname === item.href ? "text-white/90" : "text-gray-700 group-hover:text-blue-600"}
                    `}
                    >
                      {item.icon}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="pt-28 xl:pt-24" />
    </>
  );
};

export default Navbar;
