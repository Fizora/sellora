"use client";

import Link from "next/link";
import {
  LucideArrowUpRight,
  LucideLayoutGrid,
  LucidePackage,
  LucideCreditCard,
  LucideFileText,
} from "lucide-react";
import BlurText from "../components/animation/BlurText";
import Navbar from "../components/navbar";

// Data-driven pages (mudah tambah/edit)
const listOfPages = [
  {
    url: "/doc/dashboard",
    name: "Dashboard",
    icon: <LucideLayoutGrid size={16} />,
    description:
      "Overview dashboard untuk monitoring penjualan dan stok secara real-time.",
    sectionId: "dashboard",
  },
  {
    url: "/doc/inventory",
    name: "Inventory",
    icon: <LucidePackage size={16} />,
    description: "Kelola stok barang, tambah/edit/hapus produk dengan mudah.",
    sectionId: "inventory",
  },
  {
    url: "/doc/pos",
    name: "POS",
    icon: <LucideCreditCard size={16} />,
    description:
      "Point of Sale kasir cepat dengan scan barcode dan pembayaran.",
    sectionId: "pos",
  },
  {
    url: "/doc/invoice",
    name: "Invoice",
    icon: <LucideFileText size={16} />,
    description: "Buat, kirim, dan track invoice profesional otomatis.",
    sectionId: "invoice",
  },
  // Tambah page baru di sini aja!
];

export default function Documentation() {
  return (
    <>
      <div className="min-h-screen mx-auto max-w-5xl p-4 md:p-8">
        <Navbar />

        {/* Header */}
        <section className="mt-20 flex flex-col gap-6 mb-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono">
            <BlurText
              text="Documentation Sellora ✨"
              delay={200}
              animateBy="words"
              direction="top"
            />
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            Welcome to the Sellora documentation! Here you'll find everything
            you need to get started with our platform.
          </p>
        </section>

        {/* Dynamic List of Pages */}
        <section className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 font-mono">
            📚 List of Pages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {listOfPages.map((page, index) => (
              <Link
                key={page.url}
                href={page.url}
                className="group relative p-6 bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl hover:-translate-y-2 hover:border-purple-300 transition-all duration-500 overflow-hidden"
              >
                {/* Background shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-purple-500/0 via-blue-500/10 to-blue-500/0 -skew-x-12 -translate-x-40 group-hover:translate-x-0 transition-transform duration-1000" />

                <div className="relative z-10 flex flex-col items-start space-y-3">
                  <div className="flex items-center gap-2 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                    {page.icon}
                    <span className="font-bold text-lg font-mono">
                      {page.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {page.description}
                  </p>
                  <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 font-medium pt-2">
                    Baca Dokumentasi
                    <LucideArrowUpRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Dynamic Sections */}
        {listOfPages.map((page) => (
          <section
            key={page.sectionId}
            id={page.sectionId}
            className="mb-24 scroll-mt-20"
          >
            <h2 className="font-mono text-4xl md:text-5xl font-bold flex items-center gap-4 mb-4 bg-linear-to-r from-gray-900 via-purple-600 to-gray-700 bg-clip-text text-transparent">
              <span>{page.name}</span>
            </h2>
            {/* Konten section bisa diisi */}
            <div className="bg-linear-to-br from-slate-50 to-blue-50 p-8 md:p-12 rounded-3xl border border-purple-300 hover:border-blue-200 transition-all duration-300">
              <p className="text-lg text-gray-700 leading-relaxed">
                Dokumentasi lengkap untuk <strong>{page.name}</strong> akan
                tersedia di sini. Fitur utama: {page.description}
              </p>
              <Link
                href={page.url}
                className="inline-flex items-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
              >
                Mulai Baca <LucideArrowUpRight size={16} />
              </Link>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
